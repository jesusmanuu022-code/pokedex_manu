package com.pokedex.backend.repository;

import com.pokedex.backend.entity.Pokemon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PokemonRepository extends JpaRepository<Pokemon, Long> {

    List<Pokemon> findByTipoIgnoreCase(String tipo);
}
