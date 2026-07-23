package com.pokedex.backend.service;

import com.pokedex.backend.dto.EntrenadorRequest;
import com.pokedex.backend.dto.EntrenadorResponse;
import com.pokedex.backend.entity.Entrenador;
import com.pokedex.backend.repository.EntrenadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EntrenadorService {

    private final EntrenadorRepository entrenadorRepository;

    public EntrenadorService(EntrenadorRepository entrenadorRepository) {
        this.entrenadorRepository = entrenadorRepository;
    }

    @Transactional(readOnly = true)
    public List<EntrenadorResponse> listar() {
        return entrenadorRepository.findAll().stream().map(this::toResponse).toList();
    }

    public EntrenadorResponse registrar(EntrenadorRequest request) {
        Entrenador entrenador = new Entrenador();
        entrenador.setNombre(request.getNombre());
        entrenador.setCiudad(request.getCiudad());

        return toResponse(entrenadorRepository.save(entrenador));
    }

    private EntrenadorResponse toResponse(Entrenador entrenador) {
        return new EntrenadorResponse(
                entrenador.getId(),
                entrenador.getNombre(),
                entrenador.getCiudad(),
                entrenador.getFechaRegistro(),
                entrenador.getPokemones().size()
        );
    }
}
