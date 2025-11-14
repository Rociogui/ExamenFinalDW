"use client";

import { useState, useEffect } from "react";
import { API_BASE_B, fetchAPI } from "@/lib/api";
import Link from "next/link";

interface Proveedor {
  id: number;
  nombre: string;
  correo: string;
  telefono?: string;
  contacto: string;
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", correo: "", telefono: "", contacto: "" });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI(`${API_BASE_B}/proveedores`);
      setProveedores(data);
      setError("");
    } catch (err) {
      setError("Error al cargar proveedores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatId = (proveedor: Proveedor): string => {
    const sortedProveedores = [...proveedores].sort((a, b) => a.id - b.id);
    const index = sortedProveedores.findIndex(p => p.id === proveedor.id);
    return String(index + 1).padStart(3, "0");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchAPI(`${API_BASE_B}/proveedores`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setProveedores([...proveedores, response]);
      setFormData({ nombre: "", correo: "", telefono: "", contacto: "" });
      setShowForm(false);
    } catch (err) {
      setError("Error al crear proveedor");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      return;
    }
    try {
      await fetchAPI(`${API_BASE_B}/proveedores/${id}`, { method: "DELETE" });
      setProveedores(proveedores.filter(p => p.id !== id));
    } catch (err) {
      setError("Error al eliminar proveedor");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Proveedores</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#8b6f47] text-white px-6 py-2 rounded-lg hover:bg-[#7a5f37] transition font-medium"
        >
          + Nuevo Proveedor
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Nuevo Proveedor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                placeholder="Ej. ACME S.A."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                placeholder="Ej. ventas@acme.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                placeholder="Ej. +56912345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
              <input
                type="text"
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                placeholder="Ej. Gerente de Ventas"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#7a9b76] text-white px-6 py-2 rounded-lg hover:bg-[#6a8b66] transition font-medium"
              >
                Guardar
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
          <p className="text-gray-600">Cargando proveedores...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contacto</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay proveedores registrados
                  </td>
                </tr>
              ) : (
                proveedores.map((proveedor) => (
                  <tr key={proveedor.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatId(proveedor)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{proveedor.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{proveedor.correo}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{proveedor.telefono || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{proveedor.contacto || "—"}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center items-center gap-6">
                        <Link
                          href={`/facturas?proveedorId=${proveedor.id}`}
                          className="text-amber-700 hover:text-amber-900 font-medium hover:underline"
                        >
                          Ver Facturas
                        </Link>
                        <button
                          onClick={() => handleDelete(proveedor.id)}
                          className="text-gray-950 hover:scale-110 transition text-2xl font-bold"
                          title="Eliminar proveedor"
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
