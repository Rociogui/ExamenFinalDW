package com.empresa.a.controller;

import com.empresa.a.model.Pedido;
import com.empresa.a.model.Cliente;
import com.empresa.a.model.Producto;
import com.empresa.a.service.PedidoService;
import com.empresa.a.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.empresa.c.util.MetodosCompartidos;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;
    
    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedido(@PathVariable Long id) {
        return pedidoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pedido registrarPedido(@RequestBody Map<String, Object> data) {
        Pedido pedido = new Pedido();
        
        // Obtener cliente por ID
        Long clienteId = ((Number) data.get("clienteId")).longValue();
        Cliente cliente = clienteService.obtenerPorId(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        pedido.setCliente(cliente);
        
        // Asignar productos
        List<Map<String, Object>> productosData = (List<Map<String, Object>>) data.get("productos");
        if (productosData != null && !productosData.isEmpty()) {
            List<Producto> productos = productosData.stream()
                    .map(p -> new Producto(
                            (String) p.get("nombre"),
                            ((Number) p.get("precio")).doubleValue()
                    ))
                    .toList();
            pedido.setProductos(productos);
            
            // Calcular total: suma de (precio * cantidad)
            double total = productosData.stream()
                    .mapToDouble(p -> {
                        double precio = ((Number) p.get("precio")).doubleValue();
                        double cantidad = ((Number) p.getOrDefault("cantidad", 1)).doubleValue();
                        return precio * cantidad;
                    })
                    .sum();
            pedido.setTotal(total);
        }
        
        // Generar código único
        String codigo = MetodosCompartidos.generarCodigoUnico("PEDIDO");
        pedido.setDescripcion("Pedido generado con código: " + codigo);
        
        Pedido nuevoPedido = pedidoService.guardar(pedido);
        MetodosCompartidos.notificarRegistro("http://localhost:8081/api/facturas");
        return nuevoPedido;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        pedidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
