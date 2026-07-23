import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { PokemonListComponent } from './pokemon-list.component';

describe('PokemonListComponent', () => {
  let fixture: ComponentFixture<PokemonListComponent>;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/pokemon`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería mostrar el mensaje "No hay Pokémon registrados" cuando la lista está vacía', () => {
    fixture.detectChanges();
    httpMock.expectOne(baseUrl).flush([]);
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('No hay Pokémon registrados');
  });

  it('debería renderizar una tarjeta por cada pokemon recibido', () => {
    fixture.detectChanges();
    httpMock.expectOne(baseUrl).flush([
      { id: 1, nombre: 'Pikachu', tipo: 'Eléctrico', nivel: 25, fechaCaptura: '2024-01-12', entrenadorId: 1, entrenadorNombre: 'Ash Ketchum' },
      { id: 2, nombre: 'Squirtle', tipo: 'Agua', nivel: 20, fechaCaptura: '2024-01-20', entrenadorId: 2, entrenadorNombre: 'Misty Waterflower' },
    ]);
    fixture.detectChanges();

    const tarjetas = (fixture.nativeElement as HTMLElement).querySelectorAll('.tarjeta');
    expect(tarjetas.length).toBe(2);
  });

  it('debería pedir confirmación antes de eliminar', () => {
    fixture.detectChanges();
    httpMock.expectOne(baseUrl).flush([
      { id: 1, nombre: 'Pikachu', tipo: 'Eléctrico', nivel: 25, fechaCaptura: '2024-01-12', entrenadorId: 1, entrenadorNombre: 'Ash Ketchum' },
    ]);
    fixture.detectChanges();

    fixture.componentInstance.pedirConfirmacionEliminar(fixture.componentInstance.pokemonService.pokemones()[0]);

    expect(fixture.componentInstance.dialogoVisible).toBeTrue();
    httpMock.expectNone(`${baseUrl}/1`);
  });
});
