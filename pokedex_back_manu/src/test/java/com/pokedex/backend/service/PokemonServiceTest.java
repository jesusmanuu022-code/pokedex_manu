package com.pokedex.backend.service;

import com.pokedex.backend.dto.NivelUpdateRequest;
import com.pokedex.backend.dto.PokemonRequest;
import com.pokedex.backend.dto.PokemonResponse;
import com.pokedex.backend.entity.Entrenador;
import com.pokedex.backend.entity.Pokemon;
import com.pokedex.backend.exception.ResourceNotFoundException;
import com.pokedex.backend.repository.EntrenadorRepository;
import com.pokedex.backend.repository.PokemonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PokemonServiceTest {

    @Mock
    private PokemonRepository pokemonRepository;

    @Mock
    private EntrenadorRepository entrenadorRepository;

    @InjectMocks
    private PokemonService pokemonService;

    private Entrenador entrenador;
    private Pokemon pokemon;

    @BeforeEach
    void setUp() {
        entrenador = new Entrenador();
        entrenador.setId(1L);
        entrenador.setNombre("Ash Ketchum");

        pokemon = new Pokemon();
        pokemon.setId(10L);
        pokemon.setNombre("Pikachu");
        pokemon.setTipo("Eléctrico");
        pokemon.setNivel(25);
        pokemon.setFechaCaptura(LocalDate.of(2024, 1, 12));
        pokemon.setEntrenador(entrenador);
    }

    @Test
    void listar_sinFiltro_devuelveTodos() {
        when(pokemonRepository.findAll()).thenReturn(List.of(pokemon));

        List<PokemonResponse> resultado = pokemonService.listar(null);

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getNombre()).isEqualTo("Pikachu");
    }

    @Test
    void listar_conFiltroTipo_delegaEnRepositorio() {
        when(pokemonRepository.findByTipoIgnoreCase("Agua")).thenReturn(List.of());

        List<PokemonResponse> resultado = pokemonService.listar("Agua");

        assertThat(resultado).isEmpty();
        verify(pokemonRepository).findByTipoIgnoreCase("Agua");
    }

    @Test
    void registrar_conEntrenadorExistente_creaPokemon() {
        PokemonRequest request = new PokemonRequest();
        request.setNombre("Bulbasaur");
        request.setTipo("Planta");
        request.setNivel(15);
        request.setEntrenadorId(1L);

        when(entrenadorRepository.findById(1L)).thenReturn(Optional.of(entrenador));
        when(pokemonRepository.save(any(Pokemon.class))).thenAnswer(invocation -> {
            Pokemon p = invocation.getArgument(0);
            p.setId(20L);
            return p;
        });

        PokemonResponse response = pokemonService.registrar(request);

        assertThat(response.getId()).isEqualTo(20L);
        assertThat(response.getNombre()).isEqualTo("Bulbasaur");
        assertThat(response.getEntrenadorNombre()).isEqualTo("Ash Ketchum");
    }

    @Test
    void registrar_conEntrenadorInexistente_lanzaExcepcion() {
        PokemonRequest request = new PokemonRequest();
        request.setNombre("Bulbasaur");
        request.setTipo("Planta");
        request.setNivel(15);
        request.setEntrenadorId(999L);

        when(entrenadorRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> pokemonService.registrar(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    void actualizarNivel_conPokemonExistente_actualizaNivel() {
        NivelUpdateRequest request = new NivelUpdateRequest();
        request.setNivel(26);

        when(pokemonRepository.findById(10L)).thenReturn(Optional.of(pokemon));
        when(pokemonRepository.save(any(Pokemon.class))).thenReturn(pokemon);

        PokemonResponse response = pokemonService.actualizarNivel(10L, request);

        assertThat(response.getNivel()).isEqualTo(26);
    }

    @Test
    void actualizarNivel_conPokemonInexistente_lanzaExcepcion() {
        NivelUpdateRequest request = new NivelUpdateRequest();
        request.setNivel(26);

        when(pokemonRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> pokemonService.actualizarNivel(999L, request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void eliminar_conPokemonExistente_eliminaSinExcepcion() {
        when(pokemonRepository.existsById(10L)).thenReturn(true);

        pokemonService.eliminar(10L);

        verify(pokemonRepository).deleteById(10L);
    }

    @Test
    void eliminar_conPokemonInexistente_lanzaExcepcion() {
        when(pokemonRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> pokemonService.eliminar(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
