"use client";

import { useState, useEffect } from "react";
import { API_BASE_B, fetchAPI } from "@/lib/api";
import { useSearchParams } from "next/navigation";

interface PedidoReferencia {
  pedidoId: number;
  total: number;
}

interface Factura {
  id: number;
  numero: string;
  proveedorId: number;
  pedidos?: PedidoReferencia[];
  totalFactura: number;
}

export default function FacturasPage() {
  const searchParams = useSearchParams();
  const proveedorId = searchParams.get("proveedorId");

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    proveedorId: proveedorId ? parseInt(proveedorId) : 0,
    pedidos: [{ pedidoId: 0, total: 0 }],
  });

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI(`${API_BASE_B}/facturas`);
      setFacturas(data);
      setError("");
    } catch (err) {
      setError("Error al cargar facturas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePedidoChange = (index: number, field: string, value: any) => {
    const newPedidos = [...formData.pedidos];
    newPedidos[index] = { ...newPedidos[index], [field]: value };
    setFormData({ ...formData, pedidos: newPedidos });
  };

  const addPedido = () => {
    setFormData({
      ...formData,
      pedidos: [...formData.pedidos, { pedidoId: 0, total: 0 }],
    });
  };

  const removePedido = (index: number) => {
    setFormData({
      ...formData,
      pedidos: formData.pedidos.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.proveedorId === 0) {
        setError("Debe seleccionar un proveedor");
        return;
      }

      const payload = {
        proveedorId: formData.proveedorId,
        pedidos: formData.pedidos.filter((p) => p.pedidoId > 0),
      };

      const response = await fetchAPI(`${API_BASE_B}/facturas`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setFacturas([...facturas, response]);
      setFormData({
        proveedorId: proveedorId ? parseInt(proveedorId) : 0,
        pedidos: [{ pedidoId: 0, total: 0 }],
      });
      setShowForm(false);
    } catch (err) {
      setError("Error al crear factura");
      console.error(err);
    }
  };

  const calcularTotal = (pedidos: PedidoReferencia[]) => {
    return pedidos.reduce((sum, p) => sum + (p.total || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Facturas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
        >
          + Nueva Factura
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Nueva Factura</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Proveedor</label>
              <input
                type="number"
                value={formData.proveedorId}
                onChange={(e) => setFormData({ ...formData, proveedorId: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                placeholder="Ej. 1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pedidos</label>
              {formData.pedidos.map((pedido, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="ID Pedido"
                    value={pedido.pedidoId}
                    onChange={(e) => handlePedidoChange(index, "pedidoId", parseInt(e.target.value))}
                    className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Total"
                    value={pedido.total}
                    onChange={(e) => handlePedidoChange(index, "total", parseFloat(e.target.value))}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  />
                  {formData.pedidos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePedido(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPedido}
                className="mt-2 text-purple-600 hover:text-purple-800 font-medium"
              >
                + Agregar Pedido
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Guardar Factura
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
          <p className="text-gray-600">Cargando facturas...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Número</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Proveedor ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {facturas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay facturas registradas
                  </td>
                </tr>
              ) : (
                facturas.map((factura) => (
                  <tr key={factura.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{factura.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{factura.numero || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{factura.proveedorId || "—"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-purple-600">
                      Q.{(factura.totalFactura || 0).toFixed(2)}
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
