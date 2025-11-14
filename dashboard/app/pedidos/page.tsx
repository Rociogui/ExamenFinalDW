"use client";

import { useState, useEffect } from "react";
import { API_BASE_A, fetchAPI } from "@/lib/api";
import { PRODUCTOS_CATALOGO, obtenerNombreCompleto, formatearPrecio } from "@/lib/productos";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
  clienteId?: number;
  cliente_id?: number;
  productos?: Producto[];
}

export default function PedidosPage() {
  const searchParams = useSearchParams();
  const clienteIdParam = searchParams.get("clienteId");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: clienteIdParam ? parseInt(clienteIdParam) : 0,
    productos: [{ nombre: "", precio: 0, cantidad: 1 }],
  });

  // Función para formatear precio con comas
  const formatearPrecioLocal = (precio: number): string => {
    return precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Función para formatear ID de pedido como "P001", "P002", etc.
  const formatPedidoId = (pedidoId: number): string => {
    // Encontrar la posición del pedido basada en su ID
    const sortedPedidos = [...pedidos].sort((a, b) => a.id - b.id);
    const index = sortedPedidos.findIndex(p => p.id === pedidoId);
    return "P" + String(index + 1).padStart(3, "0");
  };

  // Función para formatear ID de cliente como "001", "002", etc.
  const formatClienteId = (clienteId: number | undefined): string => {
    if (!clienteId || clienteId === 0) return "—";
    const index = clientes.findIndex(c => c.id === clienteId);
    if (index === -1) return "—";
    return String(index + 1).padStart(3, "0");
  };

  // Función para obtener el nombre del cliente
  const getClienteNombre = (clienteId: number | undefined): string => {
    if (!clienteId) return "—";
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "—";
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [clientesData, pedidosData] = await Promise.all([
        fetchAPI(`${API_BASE_A}/clientes`),
        fetchAPI(`${API_BASE_A}/pedidos`),
      ]);
      const clientesOrdenados = clientesData.sort((a: Cliente, b: Cliente) => a.id - b.id);
      setClientes(clientesOrdenados);
      
      // Enriquecer pedidos con información del cliente
      const pedidosEnriquecidos = pedidosData.map((pedido: any) => ({
        ...pedido,
        // Asegurar que tenemos el ID del cliente de cualquier forma que venga
        clienteId: pedido.cliente?.id || pedido.clienteId || pedido.cliente_id,
        // Si no tenemos la información del cliente, intentar obtenerla
        cliente: pedido.cliente || (
          clientesOrdenados.find((c: Cliente) => 
            c.id === (pedido.cliente?.id || pedido.clienteId || pedido.cliente_id)
          )
        )
      }));
      
      const pedidosOrdenados = pedidosEnriquecidos.sort((a: Pedido, b: Pedido) => a.id - b.id);
      setPedidos(pedidosOrdenados);
      setError("");
    } catch (err) {
      setError("Error al cargar datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductoChange = (index: number, field: string, value: any) => {
    const newProductos = [...formData.productos];
    if (field === "nombre") {
      const productoSeleccionado = PRODUCTOS_CATALOGO.find((p) => p.nombre === value);
      newProductos[index] = {
        nombre: value,
        precio: productoSeleccionado?.precio || 0,
        cantidad: newProductos[index].cantidad || 1,
      };
    } else {
      newProductos[index] = { ...newProductos[index], [field]: value };
    }
    setFormData({ ...formData, productos: newProductos });
  };

  const addProducto = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { nombre: "", precio: 0, cantidad: 1 }],
    });
  };

  const removeProducto = (index: number) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.clienteId === 0) {
        setError("Debe seleccionar un cliente");
        return;
      }

      const productosValidos = formData.productos.filter((p) => p.nombre && p.precio > 0 && p.cantidad > 0);
      
      if (productosValidos.length === 0) {
        setError("Debe seleccionar al menos un producto con cantidad mayor a 0");
        return;
      }

      const payload = {
        clienteId: formData.clienteId,
        productos: productosValidos,
      };

      const response = await fetchAPI(`${API_BASE_A}/pedidos`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setPedidos([...pedidos, response]);
      setFormData({
        clienteId: clienteIdParam ? parseInt(clienteIdParam) : 0,
        productos: [{ nombre: "", precio: 0, cantidad: 1 }],
      });
      setShowForm(false);
      setError("");
    } catch (err) {
      setError("Error al crear pedido: " + (err instanceof Error ? err.message : "Error desconocido"));
      console.error(err);
    }
  };

  const eliminarPedido = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      return;
    }
    try {
      await fetchAPI(`${API_BASE_A}/pedidos/${id}`, {
        method: "DELETE",
      });
      setPedidos(pedidos.filter((p) => p.id !== id));
      setError("");
    } catch (err) {
      setError("Error al eliminar pedido");
      console.error(err);
    }
  };

  const calcularTotal = (productos: Producto[]) => {
    return productos.reduce((sum, p) => sum + (p.precio * p.cantidad || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#7a9b76] text-white px-6 py-2 rounded-lg hover:bg-[#6a8b66] transition font-medium"
        >
          + Nuevo Pedido
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Nuevo Pedido</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                required
              >
                <option value={0}>Seleccionar cliente...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} ({cliente.correo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Productos</label>
              <div className="space-y-3">
                {formData.productos.map((producto, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Marca</label>
                      <select
                        value={producto.nombre}
                        onChange={(e) => handleProductoChange(index, "nombre", e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      >
                        <option value="">Seleccionar producto...</option>
                        {PRODUCTOS_CATALOGO.map((prod) => (
                          <option key={prod.id} value={prod.nombre}>
                            {obtenerNombreCompleto(prod)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <label className="block text-xs text-gray-600 mb-1">Precio Unidad</label>
                      <div className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 bg-gray-100 text-sm font-medium">
                        Q.{formatearPrecioLocal(producto.precio)}
                      </div>
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-600 mb-1">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={producto.cantidad}
                        onChange={(e) => handleProductoChange(index, "cantidad", Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white text-sm"
                      />
                    </div>
                    <div className="w-28">
                      <label className="block text-xs text-gray-600 mb-1">Subtotal</label>
                      <div className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-[#ecdfcd] text-[#604a33] font-semibold text-sm">
                        Q.{formatearPrecioLocal(producto.precio * producto.cantidad)}
                      </div>
                    </div>
                    {formData.productos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProducto(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 h-10"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addProducto}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                + Agregar Producto
              </button>
            </div>

            <div className="bg-[#ecdfcd] p-4 rounded-lg border-2 border-[#604a33]">
              <p className="text-sm font-medium text-gray-700">
                Total Estimado: <span className="text-lg font-bold text-[#604a33]">Q.{formatearPrecioLocal(calcularTotal(formData.productos))}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#7a9b76] text-white px-6 py-2 rounded-lg hover:bg-[#6a8b66] transition font-medium"
              >
                Guardar Pedido
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay pedidos registrados
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-mono font-semibold">{formatPedidoId(pedido.id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pedido.descripcion || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {formatClienteId(pedido.clienteId)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-700">
                      Q.{formatearPrecioLocal(pedido.total || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center items-center gap-6">
                        <Link
                          href={`/pedidos/info/${pedido.id}`}
                          className="text-amber-700 hover:text-amber-900 font-medium"
                        >
                          Detalle
                        </Link>
                        <button
                          onClick={() => eliminarPedido(pedido.id)}
                          className="text-gray-950 hover:scale-110 transition text-2xl font-bold"
                          title="Eliminar pedido"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
