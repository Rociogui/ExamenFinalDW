package com.empresa.b.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "proveedores")
public class Proveedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String correo;

    private String telefono;

    @Column(nullable = false)
    private String contacto;
}
