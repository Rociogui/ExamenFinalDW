package com.empresa.b.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "proveedor_id")
    @JsonIgnoreProperties("facturas")
    private Proveedor proveedor;
}
