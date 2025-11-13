"use client";

import { useState, useEffect } from "react";
import { API_BASE_A, fetchAPI } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Producto {
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Pedido {
  id: number;
  descripcion: string;
  total: number;
  clienteId?: number;
  cliente?: Cliente;
  productos?: Producto[];
}

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
}

export default function PedidosClientePage() {
  const params = useParams();
  const clienteId = params.clienteId as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clienteIdFormateado, setClienteIdFormateado] = useState<string>("");

  useEffect(() => {
    cargarDatos();
  }, [clienteId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar información del cliente
      const clienteData = await fetchAPI(`${API_BASE_A}/clientes/${clienteId}`);
      setCliente(clienteData);

      // Cargar todos los clientes para calcular el índice formateado
      const todosLosClientes = await fetchAPI(`${API_BASE_A}/clientes`);
      const clientesOrdenados = todosLosClientes.sort((a: Cliente, b: Cliente) => a.id - b.id);
      const indice = clientesOrdenados.findIndex((c: Cliente) => c.id === parseInt(clienteId));
      setClienteIdFormateado(String(indice + 1).padStart(3, "0"));

      // Cargar todos los pedidos
      const pedidosData = await fetchAPI(`${API_BASE_A}/pedidos`);
      
      // Filtrar solo los pedidos del cliente (por ID del cliente en el objeto)
      const pedidosDelCliente = pedidosData.filter(
        (p: Pedido) => p.cliente?.id === parseInt(clienteId)
      );
      setPedidos(pedidosDelCliente);
      setError("");
    } catch (err) {
      setError("Error al cargar datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotalPedidos = () => {
    return pedidos.reduce((sum, p) => sum + (p.total || 0), 0);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado con info del cliente */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md p-8 text-white">
        <Link
          href="/clientes"
          className="text-blue-100 hover:text-white mb-4 inline-block"
        >
          ← Volver a Clientes
        </Link>
        <h1 className="text-4xl font-bold mb-2">{cliente?.nombre}</h1>
        <p className="text-blue-100 text-lg">{cliente?.correo}</p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-700 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Total de Pedidos</p>
            <p className="text-3xl font-bold">{pedidos.length}</p>
          </div>
          <div className="bg-blue-700 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Monto Total</p>
            <p className="text-3xl font-bold">Q.{calcularTotalPedidos().toFixed(2)}</p>
          </div>
          <div className="bg-blue-700 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Cliente ID</p>
            <p className="text-3xl font-bold">#{clienteIdFormateado}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Lista de Pedidos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pedidos Registrados</h2>

        {pedidos.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
            <p className="text-yellow-800 font-medium">
              Este cliente no tiene pedidos registrados aún.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido, index) => (
              <div
                key={pedido.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
              >
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase">ID Pedido</p>
                    <p className="text-lg font-bold text-gray-900">#{pedido.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Código</p>
                    <p className="text-lg font-mono text-gray-700">{pedido.descripcion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Cantidad Artículos</p>
                    <p className="text-lg font-bold text-gray-900">{pedido.productos?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Total</p>
                    <p className="text-2xl font-bold text-green-600">Q.{(pedido.total || 0).toFixed(2)}</p>
                  </div>
                </div>

                {/* Tabla de productos */}
                {pedido.productos && pedido.productos.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Artículos</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-gray-700">Producto</th>
                          <th className="px-3 py-2 text-right text-gray-700">P. Unitario</th>
                          <th className="px-3 py-2 text-right text-gray-700">Cantidad</th>
                          <th className="px-3 py-2 text-right text-gray-700">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedido.productos.map((prod, prodIndex) => (
                          <tr key={prodIndex} className="border-b">
                            <td className="px-3 py-2">{prod.nombre}</td>
                            <td className="px-3 py-2 text-right">Q.{prod.precio?.toFixed(2) || "0.00"}</td>
                            <td className="px-3 py-2 text-right">{prod.cantidad || 1}</td>
                            <td className="px-3 py-2 text-right font-semibold">
                              Q.{((prod.precio || 0) * (prod.cantidad || 1)).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para crear nuevo pedido */}
      <div className="flex justify-center">
        <Link
          href={`/pedidos?clienteId=${clienteId}`}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
        >
          + Crear Nuevo Pedido para este Cliente
        </Link>
      </div>
    </div>
  );
}
