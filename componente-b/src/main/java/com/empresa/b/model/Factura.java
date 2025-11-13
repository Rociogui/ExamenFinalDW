package com.empresa.b.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

@Data
@Entity
@Table(name = "facturas")
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private Double totalFactura;

    @ManyToOne
    @JoinColumn(name = "proveedor_id")
    @JsonManagedReference
    private Proveedor proveedor;

}
