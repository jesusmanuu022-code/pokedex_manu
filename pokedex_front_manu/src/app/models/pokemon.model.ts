export interface Pokemon {
  id: number;
  nombre: string;
  tipo: string;
  nivel: number;
  fechaCaptura: string | null;
  entrenadorId: number;
  entrenadorNombre: string;
}

export interface PokemonRequest {
  nombre: string;
  tipo: string;
  nivel: number;
  fechaCaptura: string | null;
  entrenadorId: number;
}

export interface NivelUpdateRequest {
  nivel: number;
}
