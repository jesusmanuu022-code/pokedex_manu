package com.pokedex.backend.controller;

import com.pokedex.backend.dto.NivelUpdateRequest;
import com.pokedex.backend.dto.PokemonRequest;
import com.pokedex.backend.dto.PokemonResponse;
import com.pokedex.backend.service.PokemonService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

    private final PokemonService pokemonService;

    public PokemonController(PokemonService pokemonService) {
        this.pokemonService = pokemonService;
    }

    @GetMapping
    public List<PokemonResponse> listar(@RequestParam(required = false) String tipo) {
        return pokemonService.listar(tipo);
    }

    @PostMapping
    public ResponseEntity<PokemonResponse> registrar(@Valid @RequestBody PokemonRequest request) {
        PokemonResponse response = pokemonService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/nivel")
    public PokemonResponse actualizarNivel(@PathVariable Long id,
                                            @Valid @RequestBody NivelUpdateRequest request) {
        return pokemonService.actualizarNivel(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pokemonService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
