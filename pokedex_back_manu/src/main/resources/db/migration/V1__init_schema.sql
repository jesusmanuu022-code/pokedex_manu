CREATE TABLE entrenador (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100),
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE pokemon (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    nivel INTEGER NOT NULL CHECK (nivel >= 1 AND nivel <= 100),
    fecha_captura DATE,
    entrenador_id BIGINT NOT NULL REFERENCES entrenador(id) ON DELETE CASCADE
);

CREATE INDEX idx_pokemon_tipo ON pokemon(tipo);
CREATE INDEX idx_pokemon_entrenador ON pokemon(entrenador_id);
