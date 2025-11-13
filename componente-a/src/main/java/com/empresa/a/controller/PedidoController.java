package com.empresa.a.controller;

import com.empresa.a.model.Pedido;
import com.empresa.a.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.empresa.c.util.MetodosCompartidos;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

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
    public Pedido registrarPedido(@RequestBody Pedido pedido) {

            String codigo = MetodosCompartidos.generarCodigoUnico("pedido");
pedido.setDescripcion("Pedido generado con código: " + codigo);
        Pedido nuevoPedido = pedidoService.guardar(pedido);
MetodosCompartidos.notificarRegistro("http://localhost:8081/api/facturas"); // ejemplo circular
return nuevoPedido;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        pedidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
