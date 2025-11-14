"use client";

import { useState, useEffect } from "react";
import { API_BASE_A, fetchAPI } from "@/lib/api";
import Link from "next/link";

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", correo: "" });

  // Función para formatear ID secuencial como "001", "002", etc
  const formatId = (cliente: Cliente): string => {
    // Encuentra el índice del cliente en la lista ordenada
    const index = clientes.findIndex(c => c.id === cliente.id);
    return String(index + 1).padStart(3, "0");
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI(`${API_BASE_A}/clientes`);
      // Ordenar por ID ascendente
      const sortedData = data.sort((a: Cliente, b: Cliente) => a.id - b.id);
      setClientes(sortedData);
      setError("");
    } catch (err) {
      setError("Error al cargar clientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchAPI(`${API_BASE_A}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setClientes([...clientes, response]);
      setFormData({ nombre: "", correo: "" });
      setShowForm(false);
      setError("");
    } catch (err) {
      setError("Error al crear cliente");
      console.error(err);
    }
  };

  const eliminarCliente = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      return;
    }
    try {
      await fetchAPI(`${API_BASE_A}/clientes/${id}`, {
        method: "DELETE",
      });
      setClientes(clientes.filter((c) => c.id !== id));
      setError("");
    } catch (err) {
      setError("Error al eliminar cliente");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <button
          onClick={() => {
            setFormData({ nombre: "", correo: "" });
            setShowForm(!showForm);
          }}
          className="bg-[#604a33] text-white px-6 py-2 rounded-lg hover:bg-[#4a3a28] transition font-medium"
        >
          + Nuevo Cliente
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Nuevo Cliente</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Ej. juan@example.com"
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
                onClick={() => {
                  setShowForm(false);
                  setFormData({ nombre: "", correo: "" });
                }}
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
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-mono font-semibold">{formatId(cliente)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{cliente.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cliente.correo}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center items-center gap-6">
                        <Link
                          href={`/clientes/pedidos/${cliente.id}`}
                          className="text-amber-700 hover:text-amber-900 font-medium"
                        >
                          Ver Pedidos
                        </Link>
                        <button
                          onClick={() => eliminarCliente(cliente.id)}
                          className="text-gray-950 hover:scale-110 transition text-2xl font-bold"
                          title="Eliminar cliente"
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
