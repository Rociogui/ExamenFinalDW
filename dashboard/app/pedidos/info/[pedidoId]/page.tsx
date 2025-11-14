"use client";

import { useState, useEffect } from "react";
import { API_BASE_A, fetchAPI } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
}

interface Producto {
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Pedido {
  id: number;
  descripcion: string;
  total: number;
  cliente?: Cliente;
  cliente_id?: number;
  productos?: Producto[];
}

export default function PedidoInfoPage() {
  const params = useParams();
  const pedidoId = params.pedidoId as string;

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [allClientes, setAllClientes] = useState<Cliente[]>([]);
  const [allPedidos, setAllPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clienteIdFormateado, setClienteIdFormateado] = useState<string>("");
  const [pedidoIdFormateado, setPedidoIdFormateado] = useState<string>("");

  // Función para formatear precio con comas
  const formatearPrecio = (precio: number): string => {
    return precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    cargarDatos();
  }, [pedidoId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar el pedido
      const pedidoData = await fetchAPI(`${API_BASE_A}/pedidos/${pedidoId}`);
      setPedido(pedidoData);

      // Cargar todos los pedidos para calcular el índice formateado
      const todosLosPedidos = await fetchAPI(`${API_BASE_A}/pedidos`);
      const pedidosOrdenados = todosLosPedidos.sort((a: Pedido, b: Pedido) => a.id - b.id);
      setAllPedidos(pedidosOrdenados);
      
      const indicePedido = pedidosOrdenados.findIndex((p: Pedido) => p.id === parseInt(pedidoId));
      setPedidoIdFormateado("P" + String(indicePedido + 1).padStart(3, "0"));

      // Cargar información del cliente
      const clienteId = pedidoData.cliente?.id || pedidoData.cliente_id;
      if (clienteId) {
        const clienteData = await fetchAPI(`${API_BASE_A}/clientes/${clienteId}`);
        setCliente(clienteData);

        // Cargar todos los clientes para calcular el índice formateado
        const todosLosClientes = await fetchAPI(`${API_BASE_A}/clientes`);
        const clientesOrdenados = todosLosClientes.sort((a: Cliente, b: Cliente) => a.id - b.id);
        setAllClientes(clientesOrdenados);
        
        const indice = clientesOrdenados.findIndex((c: Cliente) => c.id === clienteId);
        setClienteIdFormateado(String(indice + 1).padStart(3, "0"));
      }

      setError("");
    } catch (err) {
      setError("Error al cargar datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      {/* Encabezado con link de retorno */}
      <div className="flex items-center gap-4">
        <Link
          href="/pedidos"
          className="text-amber-700 hover:text-amber-900 font-medium"
        >
          ← Volver a Pedidos
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Información del Pedido */}
      <div className="bg-blue-600 rounded-lg shadow-md p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Información del Pedido</h1>
        <p className="text-blue-100 text-lg mb-4">
          Cliente: <span className="font-bold">{cliente?.nombre || "—"} ({clienteIdFormateado})</span>
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-700 rounded-lg p-4">
            <p className="text-blue-100 text-sm">ID Pedido</p>
            <p className="text-3xl font-bold font-mono">{pedidoIdFormateado}</p>
          </div>
          <div className="bg-blue-700 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Código</p>
            <p className="text-2xl font-bold font-mono">{pedido?.descripcion || "—"}</p>
          </div>
          <div className="bg-blue-700 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Total Pedido</p>
            <p className="text-3xl font-bold">Q.{formatearPrecio(pedido?.total || 0)}</p>
          </div>
        </div>
      </div>

      {/* Información del Cliente */}
      {cliente && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-md p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">{cliente.nombre}</h2>
          <p className="text-amber-100 text-lg">{cliente.correo}</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-amber-700 rounded-lg p-4">
              <p className="text-amber-100 text-sm">Artículos en Pedido</p>
              <p className="text-3xl font-bold">{pedido?.productos?.length || 0}</p>
            </div>
            <div className="bg-amber-700 rounded-lg p-4">
              <p className="text-amber-100 text-sm">Total del Pedido</p>
              <p className="text-3xl font-bold">Q.{formatearPrecio(pedido?.total || 0)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detalle de Productos */}
      {pedido?.productos && pedido.productos.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Artículos del Pedido</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">P. Unitario</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Cantidad</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.productos.map((prod, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{prod.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-right">Q.{formatearPrecio(prod.precio || 0)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-right">{prod.cantidad || 1}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                    Q.{formatearPrecio((prod.precio || 0) * (prod.cantidad || 1))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <p className="text-lg font-bold text-blue-700">
                Total: Q.{formatearPrecio(pedido.total || 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
