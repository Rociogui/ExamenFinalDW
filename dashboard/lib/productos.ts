// Catálogo de productos basado en multiproductosgt.com
export const PRODUCTOS_CATALOGO = [
  // Limpieza
  { id: 1, nombre: "Desinfectante Multiusos 1L", precio: 25.00, categoria: "Limpieza" },
  { id: 2, nombre: "Cloro Blanqueador 1L", precio: 15.00, categoria: "Limpieza" },
  { id: 3, nombre: "Jabón Líquido 1L", precio: 20.00, categoria: "Limpieza" },
  { id: 4, nombre: "Detergente en Polvo 1kg", precio: 18.00, categoria: "Limpieza" },
  { id: 5, nombre: "Limpiador de Pisos 1L", precio: 22.00, categoria: "Limpieza" },

  // Higiene Personal
  { id: 6, nombre: "Jabón de Baño 100g", precio: 5.00, categoria: "Higiene Personal" },
  { id: 7, nombre: "Champú 400ml", precio: 18.00, categoria: "Higiene Personal" },
  { id: 8, nombre: "Acondicionador 400ml", precio: 18.00, categoria: "Higiene Personal" },
  { id: 9, nombre: "Pasta Dental 75ml", precio: 8.00, categoria: "Higiene Personal" },
  { id: 10, nombre: "Desodorante Spray 250ml", precio: 12.00, categoria: "Higiene Personal" },

  // Papel y Cartón
  { id: 11, nombre: "Papel Higiénico 4 rollos", precio: 10.00, categoria: "Papel" },
  { id: 12, nombre: "Servilletas 100 hojas", precio: 5.00, categoria: "Papel" },
  { id: 13, nombre: "Papel Toalla 2 rollos", precio: 8.00, categoria: "Papel" },
  { id: 14, nombre: "Pañales Desechables Talla M (30 piezas)", precio: 45.00, categoria: "Papel" },

  // Electrodomésticos y Accesorios
  { id: 15, nombre: "Escoba de Fibra", precio: 15.00, categoria: "Accesorios" },
  { id: 16, nombre: "Recogedor de Basura", precio: 12.00, categoria: "Accesorios" },
  { id: 17, nombre: "Trapo de Limpieza 5 piezas", precio: 10.00, categoria: "Accesorios" },
  { id: 18, nombre: "Guantes de Látex (par)", precio: 8.00, categoria: "Accesorios" },
  { id: 19, nombre: "Bolsas de Basura 30 unidades", precio: 20.00, categoria: "Accesorios" },
];

export function obtenerProductoPorId(id: number) {
  return PRODUCTOS_CATALOGO.find((p) => p.id === id);
}

export function obtenerProductosPorCategoria(categoria: string) {
  return PRODUCTOS_CATALOGO.filter((p) => p.categoria === categoria);
}

export function obtenerCategorias() {
  return Array.from(new Set(PRODUCTOS_CATALOGO.map((p) => p.categoria)));
}
