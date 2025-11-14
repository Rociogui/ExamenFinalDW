package com.empresa.a.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descripcion;
    private Double total;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ElementCollection
    @CollectionTable(name = "pedido_productos", joinColumns = @JoinColumn(name = "pedido_id"))
    private List<Producto> productos;

    public Pedido() {}

    // Constructor con parámetros (opcional)
    public Pedido(String descripcion, Double total, Cliente cliente) {
        this.descripcion = descripcion;
        this.total = total;
        this.cliente = cliente;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public List<Producto> getProductos() {
        return productos;
    }

    public void setProductos(List<Producto> productos) {
        this.productos = productos;
    }
}

