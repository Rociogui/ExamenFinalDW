package com.empresa.c.util;

import java.util.List;
import java.util.UUID;

public class MetodosCompartidos {

    // Método para generar un código único por tipo de entidad
    public static String generarCodigoUnico(String tipoEntidad) {
        return tipoEntidad.toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    // Método para calcular total
    public static double calcularTotal(List<Double> precios) {
        return precios.stream().mapToDouble(Double::doubleValue).sum();
    }

    // Método para calcular total con IVA (21% por defecto)
    public static double calcularTotalConIVA(double subtotal) {
        return calcularTotalConIVA(subtotal, 0.21);
    }

    // Método para calcular total con IVA personalizado
    public static double calcularTotalConIVA(double subtotal, double tasaIVA) {
        return subtotal * (1 + tasaIVA);
    }

    // Método para aplicar descuento porcentual
    public static double aplicarDescuento(double total, double porcentajeDescuento) {
        return total * (1 - (porcentajeDescuento / 100.0));
    }

    // Método para calcular total con IVA y descuento
    public static double calcularTotalConIVAyDescuento(double subtotal, double porcentajeDescuento) {
        return calcularTotalConIVAyDescuento(subtotal, porcentajeDescuento, 0.21);
    }

    // Método para calcular total con IVA personalizado y descuento
    public static double calcularTotalConIVAyDescuento(double subtotal, double porcentajeDescuento, double tasaIVA) {
        double conDescuento = aplicarDescuento(subtotal, porcentajeDescuento);
        return calcularTotalConIVA(conDescuento, tasaIVA);
    }

    // Ejemplo de integración circular: invoca endpoint de A o B
    public static void notificarRegistro(String urlEndpoint) {
        try {
            var connection = new java.net.URL(urlEndpoint).openConnection();
            connection.getInputStream().close();
            System.out.println("Notificación enviada correctamente a: " + urlEndpoint);
        } catch (Exception e) {
            System.err.println("Error al notificar: " + e.getMessage());
        }
    }
}
