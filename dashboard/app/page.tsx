"use client";

import { useState, useEffect } from "react";
import { API_BASE_A, API_BASE_B, fetchAPI } from "@/lib/api";

export default function Home() {
  const [stats, setStats] = useState({
    clientes: 0,
    pedidos: 0,
    proveedores: 0,
    facturas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarStats();
  }, []);

  const cargarStats = async () => {
    try {
      setLoading(true);
      const [clientes, pedidos, proveedores, facturas] = await Promise.all([
        fetchAPI(`${API_BASE_A}/clientes`),
        fetchAPI(`${API_BASE_A}/pedidos`),
        fetchAPI(`${API_BASE_B}/proveedores`),
        fetchAPI(`${API_BASE_B}/facturas`),
      ]);

      setStats({
        clientes: Array.isArray(clientes) ? clientes.length : 0,
        pedidos: Array.isArray(pedidos) ? pedidos.length : 0,
        proveedores: Array.isArray(proveedores) ? proveedores.length : 0,
        facturas: Array.isArray(facturas) ? facturas.length : 0,
      });
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card: Clientes */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clientes</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {loading ? "..." : stats.clientes}
              </p>
            </div>
            <span className="text-4xl">👥</span>
          </div>
        </div>

        {/* Card: Pedidos */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Pedidos</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {loading ? "..." : stats.pedidos}
              </p>
            </div>
            <span className="text-4xl">📦</span>
          </div>
        </div>

        {/* Card: Proveedores */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Proveedores</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {loading ? "..." : stats.proveedores}
              </p>
            </div>
            <span className="text-4xl">🏢</span>
          </div>
        </div>

        {/* Card: Facturas */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Facturas</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {loading ? "..." : stats.facturas}
              </p>
            </div>
            <span className="text-4xl">📄</span>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido a MULTISERVICIOS S.A.</h2>
        <p className="text-gray-600 mb-4">
          Este panel le permite gestionar de manera centralizada:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li><strong>Clientes y Pedidos:</strong> Registre y consulte sus clientes, así como los pedidos asociados con cálculos automáticos de totales.</li>
          <li><strong>Proveedores y Facturas:</strong> Administre proveedores y genere facturas con trazabilidad completa.</li>
          <li><strong>Integración Centralizada:</strong> Todos los datos están sincronizados entre los módulos de manera automática.</li>
        </ul>
        <p className="text-gray-600 mt-4">
          Use el menú lateral para navegar entre las diferentes secciones del sistema.
        </p>
      </div>
    </div>
  );
}
