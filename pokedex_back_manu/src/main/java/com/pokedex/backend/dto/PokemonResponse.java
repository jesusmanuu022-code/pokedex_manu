package com.pokedex.backend.dto;

import java.time.LocalDate;

public class PokemonResponse {

    private Long id;
    private String nombre;
    private String tipo;
    private Integer nivel;
    private LocalDate fechaCaptura;
    private Long entrenadorId;
    private String entrenadorNombre;

    public PokemonResponse() {
    }

    public PokemonResponse(Long id, String nombre, String tipo, Integer nivel,
                            LocalDate fechaCaptura, Long entrenadorId, String entrenadorNombre) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.nivel = nivel;
        this.fechaCaptura = fechaCaptura;
        this.entrenadorId = entrenadorId;
        this.entrenadorNombre = entrenadorNombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getNivel() {
        return nivel;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }

    public LocalDate getFechaCaptura() {
        return fechaCaptura;
    }

    public void setFechaCaptura(LocalDate fechaCaptura) {
        this.fechaCaptura = fechaCaptura;
    }

    public Long getEntrenadorId() {
        return entrenadorId;
    }

    public void setEntrenadorId(Long entrenadorId) {
        this.entrenadorId = entrenadorId;
    }

    public String getEntrenadorNombre() {
        return entrenadorNombre;
    }

    public void setEntrenadorNombre(String entrenadorNombre) {
        this.entrenadorNombre = entrenadorNombre;
    }
}
