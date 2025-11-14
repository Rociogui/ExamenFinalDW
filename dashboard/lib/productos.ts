// Catálogo de computadoras
export const PRODUCTOS_CATALOGO = [
  { id: 1, nombre: "ASUS", modelo: "VIVOBOOK E1504GA-WS36", ram: "8GB RAM", precio: 3599.00, categoria: "Computadoras" },
  { id: 2, nombre: "VICTUS", modelo: "15-FB3093DX RYZEN 7 7435HS", ram: "16GB RAM", precio: 8599.00, categoria: "Computadoras" },
  { id: 3, nombre: "ASUS", modelo: "TUF A17TNT-A16 RYZEN 7-7735HS", ram: "16GB RAM", precio: 9649.00, categoria: "Computadoras" },
  { id: 4, nombre: "VICTUS", modelo: "15-FA2701WM I5-13420H", ram: "16GB RAM", precio: 7899.00, categoria: "Computadoras" },
  { id: 5, nombre: "VICTUS", modelo: "15-FB2063DX RYZEN 5 7535HS", ram: "8GB RAM", precio: 5799.00, categoria: "Computadoras" },
  { id: 6, nombre: "ACER", modelo: "NITRO V15 ANV15-51-93PU I9-13900H", ram: "16GB RAM", precio: 9299.00, categoria: "Computadoras" },
  { id: 7, nombre: "ASUS", modelo: "VIVOBOOK F1605VA-AB74 I7-13650", ram: "16GB RAM", precio: 6849.00, categoria: "Computadoras" },
  { id: 8, nombre: "ASUS", modelo: "VIVOBOOK 14A4V I5-1334U", ram: "12GB RAM", precio: 4229.00, categoria: "Computadoras" },
];

export function formatearPrecio(precio: number): string {
  return `Q.${precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function obtenerNombreCompleto(producto: any): string {
  return `${producto.nombre} - ${producto.ram} - ${formatearPrecio(producto.precio)}`;
}

export function obtenerProductoPorId(id: number) {
  return PRODUCTOS_CATALOGO.find((p) => p.id === id);
}

export function obtenerProductosPorCategoria(categoria: string) {
  return PRODUCTOS_CATALOGO.filter((p) => p.categoria === categoria);
}

export function obtenerCategorias() {
  return Array.from(new Set(PRODUCTOS_CATALOGO.map((p) => p.categoria)));
}
