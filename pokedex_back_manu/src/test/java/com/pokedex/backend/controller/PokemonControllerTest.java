package com.pokedex.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pokedex.backend.dto.NivelUpdateRequest;
import com.pokedex.backend.dto.PokemonRequest;
import com.pokedex.backend.dto.PokemonResponse;
import com.pokedex.backend.exception.ResourceNotFoundException;
import com.pokedex.backend.service.PokemonService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PokemonController.class)
class PokemonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PokemonService pokemonService;

    @Test
    void listar_devuelveOkConLista() throws Exception {
        PokemonResponse response = new PokemonResponse(1L, "Pikachu", "Eléctrico", 25,
                LocalDate.of(2024, 1, 12), 1L, "Ash Ketchum");
        when(pokemonService.listar(null)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/pokemon"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Pikachu"));
    }

    @Test
    void registrar_conDatosValidos_devuelveCreated() throws Exception {
        PokemonRequest request = new PokemonRequest();
        request.setNombre("Bulbasaur");
        request.setTipo("Planta");
        request.setNivel(15);
        request.setEntrenadorId(1L);

        PokemonResponse response = new PokemonResponse(2L, "Bulbasaur", "Planta", 15, null, 1L, "Ash Ketchum");
        when(pokemonService.registrar(any())).thenReturn(response);

        mockMvc.perform(post("/api/pokemon")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Bulbasaur"));
    }

    @Test
    void registrar_sinNombreTipoNivel_devuelveBadRequest() throws Exception {
        PokemonRequest request = new PokemonRequest();
        request.setEntrenadorId(1L);

        mockMvc.perform(post("/api/pokemon")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.details").isArray());
    }

    @Test
    void actualizarNivel_conPokemonInexistente_devuelveNotFound() throws Exception {
        NivelUpdateRequest request = new NivelUpdateRequest();
        request.setNivel(30);

        when(pokemonService.actualizarNivel(eq(999L), any()))
                .thenThrow(new ResourceNotFoundException("No existe un Pokémon con id 999"));

        mockMvc.perform(patch("/api/pokemon/999/nivel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void eliminar_conPokemonExistente_devuelveNoContent() throws Exception {
        mockMvc.perform(delete("/api/pokemon/1"))
                .andExpect(status().isNoContent());
    }
}
