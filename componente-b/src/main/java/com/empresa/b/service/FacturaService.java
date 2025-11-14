package com.empresa.b.service;

import com.empresa.b.model.Factura;
import com.empresa.b.repository.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;

    public List<Factura> obtenerTodas() {
        return facturaRepository.findAll();
    }

    public Optional<Factura> obtenerPorId(Long id) {
        return facturaRepository.findById(id);
    }

    public Factura guardar(Factura factura) {
        if (factura.getTotalFactura() == null) factura.setTotalFactura(0.0);
        if (factura.getNumero() == null) {
            factura.setNumero("FAC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        return facturaRepository.save(factura);
    }

    public void eliminar(Long id) {
        facturaRepository.deleteById(id);
    }
}
