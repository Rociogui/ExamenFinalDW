package com.empresa.b.controller;

import com.empresa.b.model.Proveedor;
import com.empresa.b.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "http://localhost:3000")
public class ProveedorController {

    private static final Logger logger = LoggerFactory.getLogger(ProveedorController.class);

    @Autowired
    private ProveedorService proveedorService;

    @GetMapping
    public List<Proveedor> listar() {
        logger.info("GET /api/proveedores - Listando proveedores");
        return proveedorService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> obtener(@PathVariable Long id) {
        logger.info("GET /api/proveedores/{} - Obteniendo proveedor", id);
        return proveedorService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Proveedor proveedor) {
        logger.info("POST /api/proveedores - Creando proveedor: {}", proveedor.getNombre());
        try {
            logger.debug("Proveedor recibido: nombre={}, correo={}, telefono={}", 
                proveedor.getNombre(), proveedor.getCorreo(), proveedor.getTelefono());
            
            Proveedor guardado = proveedorService.guardar(proveedor);
            logger.info("Proveedor guardado exitosamente con ID: {}", guardado.getId());
            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            logger.error("Error al guardar proveedor", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        logger.info("DELETE /api/proveedores/{} - Eliminando proveedor", id);
        proveedorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
