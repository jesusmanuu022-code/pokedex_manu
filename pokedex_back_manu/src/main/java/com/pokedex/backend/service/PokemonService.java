package com.pokedex.backend.service;

import com.pokedex.backend.dto.NivelUpdateRequest;
import com.pokedex.backend.dto.PokemonRequest;
import com.pokedex.backend.dto.PokemonResponse;
import com.pokedex.backend.entity.Entrenador;
import com.pokedex.backend.entity.Pokemon;
import com.pokedex.backend.exception.ResourceNotFoundException;
import com.pokedex.backend.repository.EntrenadorRepository;
import com.pokedex.backend.repository.PokemonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PokemonService {

    private final PokemonRepository pokemonRepository;
    private final EntrenadorRepository entrenadorRepository;

    public PokemonService(PokemonRepository pokemonRepository, EntrenadorRepository entrenadorRepository) {
        this.pokemonRepository = pokemonRepository;
        this.entrenadorRepository = entrenadorRepository;
    }

    @Transactional(readOnly = true)
    public List<PokemonResponse> listar(String tipo) {
        List<Pokemon> pokemones = (tipo == null || tipo.isBlank())
                ? pokemonRepository.findAll()
                : pokemonRepository.findByTipoIgnoreCase(tipo);

        return pokemones.stream().map(this::toResponse).toList();
    }

    public PokemonResponse registrar(PokemonRequest request) {
        Entrenador entrenador = entrenadorRepository.findById(request.getEntrenadorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existe un entrenador con id " + request.getEntrenadorId()));

        Pokemon pokemon = new Pokemon();
        pokemon.setNombre(request.getNombre());
        pokemon.setTipo(request.getTipo());
        pokemon.setNivel(request.getNivel());
        pokemon.setFechaCaptura(request.getFechaCaptura());
        pokemon.setEntrenador(entrenador);

        return toResponse(pokemonRepository.save(pokemon));
    }

    public PokemonResponse actualizarNivel(Long id, NivelUpdateRequest request) {
        Pokemon pokemon = pokemonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe un Pokémon con id " + id));

        pokemon.setNivel(request.getNivel());
        return toResponse(pokemonRepository.save(pokemon));
    }

    public void eliminar(Long id) {
        if (!pokemonRepository.existsById(id)) {
            throw new ResourceNotFoundException("No existe un Pokémon con id " + id);
        }
        pokemonRepository.deleteById(id);
    }

    private PokemonResponse toResponse(Pokemon pokemon) {
        return new PokemonResponse(
                pokemon.getId(),
                pokemon.getNombre(),
                pokemon.getTipo(),
                pokemon.getNivel(),
                pokemon.getFechaCaptura(),
                pokemon.getEntrenador().getId(),
                pokemon.getEntrenador().getNombre()
        );
    }
}
