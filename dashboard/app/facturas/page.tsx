"use client";

import { useState, useEffect } from "react";
import { API_BASE_A, API_BASE_B, fetchAPI } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Proveedor {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
}

interface Pedido {
  id: number;
  clienteId: number;
  total: number;
}

interface PedidoReferencia {
  pedidoId: number;
  total: number;
}

interface Producto {
  producto: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

interface Factura {
  id: number;
  numero: string;
  proveedorId?: number;
  proveedor?: Proveedor;
  pedidos?: PedidoReferencia[];
  totalFactura: number;
}

export default function FacturasPage() {
  const searchParams = useSearchParams();
  const proveedorIdParam = searchParams.get("proveedorId");

  // Lista de computadoras disponibles
  const computadoras = [
    { id: 1, marca: "ASUS", ram: "8GB RAM", precio: 3599 },
    { id: 2, marca: "VICTUS", ram: "16GB RAM", precio: 8599 },
    { id: 3, marca: "ASUS", ram: "16GB RAM", precio: 9649 },
    { id: 4, marca: "VICTUS", ram: "16GB RAM", precio: 7899 },
    { id: 5, marca: "VICTUS", ram: "8GB RAM", precio: 5799 },
    { id: 6, marca: "ACER", ram: "16GB RAM", precio: 9299 },
    { id: 7, marca: "ASUS", ram: "16GB RAM", precio: 6849 },
    { id: 8, marca: "ASUS", ram: "12GB RAM", precio: 4229 },
  ];

  const formatearPrecio = (precio: number): string => {
    return precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [pedidosDisponibles, setPedidosDisponibles] = useState<Pedido[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    proveedorId: proveedorIdParam ? parseInt(proveedorIdParam) : 0,
    productos: [{ producto: "", precioUnitario: 0, cantidad: 1, subtotal: 0 }],
    nit: "",
    tipoIdentificacion: "", // "NIT" o "C/F"
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const formatProveedorId = (proveedorId: number): string => {
    const sortedProveedores = [...proveedores].sort((a, b) => a.id - b.id);
    const index = sortedProveedores.findIndex(p => p.id === proveedorId);
    return String(index + 1).padStart(3, "0");
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [proveedoresData, pedidosData, facturasData] = await Promise.all([
        fetchAPI(`${API_BASE_B}/proveedores`),
        fetchAPI(`${API_BASE_A}/pedidos`),
        fetchAPI(`${API_BASE_B}/facturas`),
      ]);
      setProveedores(proveedoresData);
      setPedidosDisponibles(pedidosData);
      setFacturas(facturasData);
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
    
    if (field === "producto") {
      // Cuando se selecciona una computadora, autocompletar precio
      const computadoraSeleccionada = computadoras.find(c => c.id === parseInt(value));
      if (computadoraSeleccionada) {
        newProductos[index] = {
          ...newProductos[index],
          producto: `${computadoraSeleccionada.marca} - ${computadoraSeleccionada.ram}`,
          precioUnitario: computadoraSeleccionada.precio,
          subtotal: computadoraSeleccionada.precio * newProductos[index].cantidad
        };
      }
    } else {
      newProductos[index] = { ...newProductos[index], [field]: value };
      
      // Calcular subtotal automáticamente
      if (field === "precioUnitario" || field === "cantidad") {
        const precioUnitario = field === "precioUnitario" ? parseFloat(value) || 0 : newProductos[index].precioUnitario;
        const cantidad = field === "cantidad" ? parseInt(value) || 0 : newProductos[index].cantidad;
        newProductos[index].subtotal = precioUnitario * cantidad;
      }
    }
    
    setFormData({ ...formData, productos: newProductos });
  };

  const addProducto = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { producto: "", precioUnitario: 0, cantidad: 1, subtotal: 0 }],
    });
  };

  const removeProducto = (index: number) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter((_: any, i: number) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.proveedorId === 0) {
        setError("Debe seleccionar un proveedor");
        return;
      }

      // Calcular total de todos los productos
      const totalFactura = formData.productos.reduce((sum, prod) => sum + prod.subtotal, 0);

      const payload = {
        proveedorId: formData.proveedorId,
        pedidos: [], // Ya no usamos pedidos
        totalFactura: totalFactura,
      };

      const response = await fetchAPI(`${API_BASE_B}/facturas`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setFacturas([...facturas, response]);
      setFormData({
        proveedorId: proveedorIdParam ? parseInt(proveedorIdParam) : 0,
        productos: [{ producto: "", precioUnitario: 0, cantidad: 1, subtotal: 0 }],
        nit: "",
        tipoIdentificacion: "",
      });
      setShowForm(false);
    } catch (err) {
      setError("Error al crear factura");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta factura?")) {
      return;
    }
    try {
      await fetchAPI(`${API_BASE_B}/facturas/${id}`, { method: "DELETE" });
      setFacturas(facturas.filter(f => f.id !== id));
    } catch (err) {
      setError("Error al eliminar factura");
      console.error(err);
    }
  };

  const calcularTotal = (productos: Producto[]) => {
    return productos.reduce((sum, p) => sum + (p.subtotal || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Facturas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#9b7a5a] text-white px-6 py-2 rounded-lg hover:bg-[#8b6a4a] transition font-medium"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <select
                value={formData.proveedorId}
                onChange={(e) => setFormData({ ...formData, proveedorId: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                required
              >
                <option value={0}>Seleccionar proveedor...</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre} ({proveedor.correo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Productos</label>
              <div className="space-y-3">
                {formData.productos.map((producto, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <select
                      value={producto.producto ? computadoras.find(c => `${c.marca} - ${c.ram}` === producto.producto)?.id || "" : ""}
                      onChange={(e) => handleProductoChange(index, "producto", e.target.value)}
                      className="col-span-5 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                    >
                      <option value="">Seleccionar producto...</option>
                      {computadoras.map((comp) => (
                        <option key={comp.id} value={comp.id}>
                          {comp.marca} - {comp.ram} - Q.{formatearPrecio(comp.precio)}
                        </option>
                      ))}
                    </select>
                    <div className="col-span-2 px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 font-medium text-gray-900">
                      Q.{formatearPrecio(producto.precioUnitario)}
                    </div>
                    <input
                      type="number"
                      value={producto.cantidad}
                      onChange={(e) => handleProductoChange(index, "cantidad", e.target.value)}
                      placeholder="1"
                      min="1"
                      className="col-span-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                    />
                    <div className="col-span-2 px-3 py-2 border-2 border-gray-300 rounded-lg bg-[#ecdfcd] font-bold text-gray-900">
                      Q.{formatearPrecio(producto.subtotal)}
                    </div>
                    {formData.productos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProducto(index)}
                        className="col-span-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-center"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2">
                <button
                  type="button"
                  onClick={addProducto}
                  className="text-[#7a9b76] hover:text-[#6a8b66] font-medium bg-[#ecdfcd] px-4 py-1 rounded"
                >
                  + Agregar Item
                </button>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Marca | Precio Unitario | Cantidad | Subtotal</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIT</label>
                <input
                  type="text"
                  value={formData.nit}
                  onChange={(e) => setFormData({ ...formData, nit: e.target.value, tipoIdentificacion: e.target.value ? "NIT" : "" })}
                  disabled={formData.tipoIdentificacion === "C/F"}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Ej. 1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">C/F</label>
                <select
                  value={formData.tipoIdentificacion === "C/F" ? "C/F" : ""}
                  onChange={(e) => setFormData({ ...formData, tipoIdentificacion: e.target.value, nit: e.target.value ? "" : formData.nit })}
                  disabled={formData.nit !== ""}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccionar...</option>
                  <option value="C/F">C/F</option>
                </select>
              </div>
            </div>

            <div className="bg-[#ecdfcd] p-4 rounded-lg border-2 border-[#9b7a5a]">
              <p className="text-sm font-medium text-gray-700">
                Total Factura: <span className="text-lg font-bold text-[#9b7a5a]">Q.{formatearPrecio(calcularTotal(formData.productos))}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#7a9b76] text-white px-6 py-2 rounded-lg hover:bg-[#6a8b66] transition font-medium"
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Proveedor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay facturas registradas
                  </td>
                </tr>
              ) : (
                facturas.map((factura) => (
                  <tr key={factura.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{String(factura.id).padStart(3, "0")}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{factura.numero || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{factura.proveedor?.nombre || "—"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-700">
                      Q.{formatearPrecio(factura.totalFactura || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center items-center gap-6">
                        <Link
                          href={`/facturas/info/${factura.id}`}
                          className="text-amber-700 hover:text-amber-900 font-medium hover:underline"
                        >
                          Ver Detalle
                        </Link>
                        <button
                          onClick={() => handleDelete(factura.id)}
                          className="text-gray-950 hover:scale-110 transition text-2xl font-bold"
                          title="Eliminar factura"
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
