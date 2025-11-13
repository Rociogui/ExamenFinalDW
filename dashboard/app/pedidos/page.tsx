"use client";

import { useState, useEffect } from "react";
import { API_BASE_A, fetchAPI } from "@/lib/api";
import { PRODUCTOS_CATALOGO } from "@/lib/productos";
import { useSearchParams } from "next/navigation";

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
}

interface Producto {
  nombre: string;
  precio: number;
}

interface Pedido {
  id: number;
  descripcion: string;
  total: number;
  clienteId: number;
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
    productos: [{ nombre: "", precio: 0 }],
  });

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
      setClientes(clientesData);
      setPedidos(pedidosData);
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
      };
    } else {
      newProductos[index] = { ...newProductos[index], [field]: value };
    }
    setFormData({ ...formData, productos: newProductos });
  };

  const addProducto = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { nombre: "", precio: 0 }],
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

      const payload = {
        clienteId: formData.clienteId,
        productos: formData.productos.filter((p) => p.nombre && p.precio > 0),
      };

      const response = await fetchAPI(`${API_BASE_A}/pedidos`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setPedidos([...pedidos, response]);
      setFormData({
        clienteId: clienteIdParam ? parseInt(clienteIdParam) : 0,
        productos: [{ nombre: "", precio: 0 }],
      });
      setShowForm(false);
    } catch (err) {
      setError("Error al crear pedido");
      console.error(err);
    }
  };

  const calcularTotal = (productos: Producto[]) => {
    return productos.reduce((sum, p) => sum + (p.precio || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Productos del Catálogo</label>
              <div className="space-y-3">
                {formData.productos.map((producto, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={producto.nombre}
                      onChange={(e) => handleProductoChange(index, "nombre", e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                    >
                      <option value="">Seleccionar producto...</option>
                      {PRODUCTOS_CATALOGO.map((prod) => (
                        <option key={prod.id} value={prod.nombre}>
                          {prod.nombre} - Q.{prod.precio.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={producto.precio}
                      disabled
                      className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 bg-gray-100 cursor-not-allowed"
                    />
                    {formData.productos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProducto(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
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

            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <p className="text-sm font-medium text-gray-700">
                Total Estimado: <span className="text-lg font-bold text-blue-600">Q.{calcularTotal(formData.productos).toFixed(2)}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
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
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay pedidos registrados
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{pedido.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pedido.descripcion || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {pedido.clienteId || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      Q.{(pedido.total || 0).toFixed(2)}
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
