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
