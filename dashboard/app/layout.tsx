import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MULTISERVICIOS S.A. - Panel de Control",
  description: "Panel administrativo para gestión de clientes, pedidos, proveedores y facturas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold">MULTISERVICIOS S.A.</h1>
              <p className="text-blue-100 mt-1">Panel de Control - Gestión de Pedidos y Facturas</p>
            </div>
          </header>

          <div className="flex flex-1">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white shadow-md">
              <nav className="p-6 space-y-2">
                <Link href="/" className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">
                  📊 Inicio
                </Link>
                
                <div className="mt-6">
                  <h3 className="px-4 py-2 text-sm font-bold text-gray-400 uppercase">Clientes y Pedidos</h3>
                  <Link href="/clientes" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    👥 Clientes
                  </Link>
                  <Link href="/pedidos" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    📦 Pedidos
                  </Link>
                </div>

                <div className="mt-6">
                  <h3 className="px-4 py-2 text-sm font-bold text-gray-400 uppercase">Proveedores y Facturas</h3>
                  <Link href="/proveedores" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    🏢 Proveedores
                  </Link>
                  <Link href="/facturas" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    📄 Facturas
                  </Link>
                </div>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>

          {/* Footer */}
          <footer className="bg-gray-800 text-gray-300 text-center py-4 mt-auto">
            <p>© 2025 MULTISERVICIOS S.A. - Todos los derechos reservados</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
