package com.pokedex.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class EntrenadorRequest {

    @NotBlank(message = "El nombre del entrenador es obligatorio")
    private String nombre;

    private String ciudad;

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
}
