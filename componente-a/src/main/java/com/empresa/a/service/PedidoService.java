package com.empresa.a.service;

import com.empresa.a.model.Pedido;
import com.empresa.a.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.empresa.c.Utils;

@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public List<Pedido> obtenerTodos() {
         return pedidoRepository.findAll(); 
         }
             public Optional<Pedido> obtenerPorId(Long id) {
        return pedidoRepository.findById(id);
    }
    public Pedido guardar(Pedido pedido) {
        if (pedido.getTotal() == null) {
            pedido.setTotal(0.0);
        }
                pedido.setDescripcion(Utils.generarCodigoUnico("PEDIDO"));
                        return pedidoRepository.save(pedido);
    }
    public void eliminar(Long id) {
         pedidoRepository.deleteById(id); 
         }
}
