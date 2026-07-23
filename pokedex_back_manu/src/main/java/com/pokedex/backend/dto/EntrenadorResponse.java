package com.pokedex.backend.dto;

import java.time.LocalDate;

public class EntrenadorResponse {

    private Long id;
    private String nombre;
    private String ciudad;
    private LocalDate fechaRegistro;
    private int totalPokemon;

    public EntrenadorResponse() {
    }

    public EntrenadorResponse(Long id, String nombre, String ciudad, LocalDate fechaRegistro, int totalPokemon) {
        this.id = id;
        this.nombre = nombre;
        this.ciudad = ciudad;
        this.fechaRegistro = fechaRegistro;
        this.totalPokemon = totalPokemon;
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

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public int getTotalPokemon() {
        return totalPokemon;
    }

    public void setTotalPokemon(int totalPokemon) {
        this.totalPokemon = totalPokemon;
    }
}
