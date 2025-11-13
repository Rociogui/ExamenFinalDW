package com.empresa.b.controller;

import com.empresa.b.model.Factura;
import com.empresa.b.model.Proveedor;
import com.empresa.b.service.FacturaService;
import com.empresa.b.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;
    
    @Autowired
    private ProveedorService proveedorService;

    @GetMapping
    public List<Factura> listar() {
        return facturaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Factura> obtener(@PathVariable Long id) {
        return facturaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Factura crear(@RequestBody Map<String, Object> data) {
        Factura factura = new Factura();
        
        // Obtener proveedor por ID
        Long proveedorId = ((Number) data.get("proveedorId")).longValue();
        Proveedor proveedor = proveedorService.obtenerPorId(proveedorId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        factura.setProveedor(proveedor);
        
        // Generar número único de factura
        String numero = "FAC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        factura.setNumero(numero);
        
        // Calcular total desde los pedidos
        List<Map<String, Object>> pedidosData = (List<Map<String, Object>>) data.get("pedidos");
        if (pedidosData != null && !pedidosData.isEmpty()) {
            double total = pedidosData.stream()
                    .mapToDouble(p -> ((Number) p.getOrDefault("total", 0)).doubleValue())
                    .sum();
            factura.setTotalFactura(total);
        } else {
            factura.setTotalFactura(0.0);
        }
        
        return facturaService.guardar(factura);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        facturaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
