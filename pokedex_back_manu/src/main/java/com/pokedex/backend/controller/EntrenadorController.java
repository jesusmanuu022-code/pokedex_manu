package com.pokedex.backend.controller;

import com.pokedex.backend.dto.EntrenadorRequest;
import com.pokedex.backend.dto.EntrenadorResponse;
import com.pokedex.backend.service.EntrenadorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/entrenadores")
public class EntrenadorController {

    private final EntrenadorService entrenadorService;

    public EntrenadorController(EntrenadorService entrenadorService) {
        this.entrenadorService = entrenadorService;
    }

    @GetMapping
    public List<EntrenadorResponse> listar() {
        return entrenadorService.listar();
    }

    @PostMapping
    public ResponseEntity<EntrenadorResponse> registrar(@Valid @RequestBody EntrenadorRequest request) {
        EntrenadorResponse response = entrenadorService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
