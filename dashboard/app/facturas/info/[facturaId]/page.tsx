"use client";

import { useState, useEffect } from "react";
import { API_BASE_B, fetchAPI } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Proveedor {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  contacto: string;
}

interface Factura {
  id: number;
  numero: string;
  totalFactura: number;
  proveedor: Proveedor;
}

export default function FacturaDetailPage() {
  const params = useParams();
  const facturaId = params.facturaId as string;

  const [factura, setFactura] = useState<Factura | null>(null);
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const facturaData = await fetchAPI(`${API_BASE_B}/facturas/${facturaId}`);
      setFactura(facturaData);

      if (facturaData.proveedor) {
        setProveedor(facturaData.proveedor);
      }
      setError("");
    } catch (err) {
      setError("Error al cargar la factura");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatProveedorId = (): string => {
    if (!factura || !factura.proveedor) return "—";
    return String(factura.proveedor.id).padStart(3, "0");
  };

  const formatFacturaId = (): string => {
    if (!factura) return "—";
    return String(factura.id).padStart(3, "0");
  };

  const calcularSubtotal = (): number => {
    if (!factura) return 0;
    // El total incluye IVA, entonces: total = subtotal + (subtotal * 0.12)
    // total = subtotal * 1.12
    // subtotal = total / 1.12
    return factura.totalFactura / 1.12;
  };

  const calcularIVA = (): number => {
    const subtotal = calcularSubtotal();
    return subtotal * 0.12; // 12% IVA
  };

  const calcularTotal = (): number => {
    if (!factura) return 0;
    return factura.totalFactura; // El total ya incluye el IVA
  };

  const formatearPrecio = (precio: number): string => {
    return precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Cargando factura...</p>
      </div>
    );
  }

  if (error || !factura) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || "Factura no encontrada"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-blue-600 pb-4">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">FACTURA</h1>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-semibold">Nº FACTURA</p>
              <p className="text-gray-900 font-bold text-lg">{factura.numero}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">PROVEEDOR ID</p>
              <p className="text-gray-900 font-bold text-lg">{formatProveedorId()}</p>
            </div>
          </div>
        </div>

        {/* Proveedor Info */}
        {proveedor && (
          <div className="mb-8 p-4 bg-blue-50 rounded border-l-4 border-blue-600">
            <h2 className="text-lg font-bold text-blue-600 mb-3">PROVEEDOR</h2>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="font-semibold text-gray-700">NOMBRE</span>
                <span className="text-gray-900">{proveedor.nombre}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-semibold text-gray-700">CORREO</span>
                <span className="text-gray-900">{proveedor.correo}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-semibold text-gray-700">TELÉFONO</span>
                <span className="text-gray-900">{proveedor.telefono || "—"}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-semibold text-gray-700">CONTACTO</span>
                <span className="text-gray-900">{proveedor.contacto || "—"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Resumen Financiero */}
        <div className="mb-8 p-6 bg-purple-50 rounded border-l-4 border-purple-600 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold">SUBTOTAL</p>
              <p className="text-gray-900 font-bold text-xl">
                Q.{formatearPrecio(calcularSubtotal())}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">IVA (12%)</p>
              <p className="text-gray-900 font-bold text-xl">
                Q.{formatearPrecio(calcularIVA())}
              </p>
            </div>
          </div>
          <div className="border-t-2 border-purple-300 pt-3">
            <p className="text-gray-600 font-semibold">TOTAL FACTURA</p>
            <p className="text-purple-600 font-bold text-2xl">
              Q.{formatearPrecio(calcularTotal())}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/facturas"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Volver a Facturas
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
