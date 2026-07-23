import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Pokemon } from '../models/pokemon.model';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/pokemon`;

  const mockPokemon: Pokemon = {
    id: 1,
    nombre: 'Pikachu',
    tipo: 'Eléctrico',
    nivel: 25,
    fechaCaptura: '2024-01-12',
    entrenadorId: 1,
    entrenadorNombre: 'Ash Ketchum',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería cargar la lista de pokemon y actualizar el signal', () => {
    service.cargar();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockPokemon]);

    expect(service.pokemones()).toEqual([mockPokemon]);
    expect(service.loading()).toBeFalse();
  });

  it('debería incluir el parámetro tipo al filtrar', () => {
    service.setFiltroTipo('Agua');

    const req = httpMock.expectOne((r) => r.url === baseUrl && r.params.get('tipo') === 'Agua');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('debería filtrar por nombre en pokemonesFiltrados', () => {
    service.cargar();
    httpMock.expectOne(baseUrl).flush([mockPokemon, { ...mockPokemon, id: 2, nombre: 'Bulbasaur' }]);

    service.setBusqueda('pika');

    expect(service.pokemonesFiltrados().length).toBe(1);
    expect(service.pokemonesFiltrados()[0].nombre).toBe('Pikachu');
  });

  it('debería propagar el mensaje de error del backend al registrar', () => {
    let mensajeError = '';

    service
      .registrar({ nombre: '', tipo: '', nivel: 1, fechaCaptura: null, entrenadorId: 1 })
      .subscribe({
        error: (err) => (mensajeError = err.message),
      });

    const req = httpMock.expectOne(baseUrl);
    req.flush(
      {
        status: 400,
        error: 'Solicitud inválida',
        message: 'Uno o más campos no cumplen con las validaciones requeridas',
        details: ['nombre: El nombre del Pokémon es obligatorio'],
      },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(mensajeError).toContain('El nombre del Pokémon es obligatorio');
    expect(service.error()).toContain('El nombre del Pokémon es obligatorio');
  });

  it('debería recargar la lista tras eliminar un pokemon', () => {
    service.eliminar(1).subscribe();

    const deleteReq = httpMock.expectOne(`${baseUrl}/1`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    const getReq = httpMock.expectOne(baseUrl);
    expect(getReq.request.method).toBe('GET');
    getReq.flush([]);
  });
});
