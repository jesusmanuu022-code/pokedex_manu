# Pokédex — Prueba Técnica

Aplicación full-stack para registrar, consultar y administrar Pokémon. Toda la información se almacena en PostgreSQL (no consume la API oficial de Pokémon).

## Stack

| Capa       | Tecnología              |
|------------|--------------------------|
| Backend    | Java 17 + Spring Boot 3.5.16 |
| Base de datos | PostgreSQL 18 |
| Frontend   | Angular 17 (standalone components + Signals) |
| Migraciones | Flyway |

> **Nota sobre versiones:** Spring Initializr (start.spring.io) ya sólo genera proyectos con Spring Boot 4.x. Como la prueba pide explícitamente Spring Boot 3, el `pom.xml` se construyó a mano fijando `spring-boot-starter-parent` en `3.5.16`, la última versión estable de la línea 3.x disponible en Maven Central.

## Estructura del repositorio

```
pokedex_manu/
├── pokedex_back_manu/      # API REST (Spring Boot)
├── pokedex_front_manu/     # SPA (Angular)
├── pokedex.postman_collection.json
└── README.md
```

## Requisitos previos

- **Java 17** (Eclipse Temurin recomendado)
- **PostgreSQL 18** corriendo localmente (o accesible por red)
- **Node.js 18+** y **npm**
- Angular CLI 17 (se puede usar via `npx @angular/cli@17` sin instalación global)
- Maven no es obligatorio: el backend incluye Maven Wrapper (`mvnw` / `mvnw.cmd`)

## 1. Base de datos

Crea un rol y una base de datos dedicados para la app (ajusta la contraseña si lo deseas):

```sql
-- Conéctate como superusuario (psql -U postgres)
CREATE ROLE pokedex_user LOGIN PASSWORD 'pokedex_pass';
CREATE DATABASE pokedex_db OWNER pokedex_user;
GRANT ALL PRIVILEGES ON DATABASE pokedex_db TO pokedex_user;
```

Estas credenciales coinciden con los valores por defecto de `application.yml`. Si usas otras, expórtalas como variables de entorno antes de levantar el backend (ver sección 2).

## 2. Backend

```bash
cd pokedex_back_manu

# Variables de entorno (opcionales — estos son los valores por defecto)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=pokedex_db
export DB_USER=pokedex_user
export DB_PASSWORD=pokedex_pass
export SERVER_PORT=8080
export CORS_ALLOWED_ORIGINS=http://localhost:4200

# Levantar la app (compila, corre las migraciones Flyway automáticamente y arranca)
./mvnw spring-boot:run
```

En Windows (cmd/PowerShell) usa `mvnw.cmd spring-boot:run` y define las variables con `set` o `$env:`.

Al iniciar, Flyway ejecuta automáticamente:
- `V1__init_schema.sql` — crea las tablas `entrenador` y `pokemon`
- `V2__seed_data.sql` — inserta 3 entrenadores y 15 Pokémon de ejemplo

La API queda disponible en `http://localhost:8080/api`.

### Verificación rápida con curl

```bash
curl http://localhost:8080/api/pokemon
curl "http://localhost:8080/api/pokemon?tipo=Agua"
curl -X POST http://localhost:8080/api/pokemon -H "Content-Type: application/json" \
  -d '{"nombre":"Eevee","tipo":"Normal","nivel":10,"fechaCaptura":"2024-07-01","entrenadorId":1}'
curl -X PATCH http://localhost:8080/api/pokemon/1/nivel -H "Content-Type: application/json" -d '{"nivel":30}'
curl -X DELETE http://localhost:8080/api/pokemon/1
```

### Tests del backend (JUnit 5 + Mockito)

```bash
cd pokedex_back_manu
./mvnw test
```

Incluye tests de servicio (`PokemonServiceTest`) y de controller (`PokemonControllerTest`, con `MockMvc`) cubriendo el CRUD y las validaciones (400/404).

## 3. Frontend

```bash
cd pokedex_front_manu
npm install
npm start   # equivalente a: ng serve
```

La app queda disponible en `http://localhost:4200` y consume el backend en `http://localhost:8080/api` (configurado en `src/environments/environment.ts`).

### Tests del frontend (Jasmine + Karma)

```bash
cd pokedex_front_manu
npm test -- --watch=false
```

> Karma necesita un navegador Chromium instalado. Si no tienes Google Chrome, puedes usar Microsoft Edge (Chromium) definiendo la variable `CHROME_BIN` antes de correr los tests, por ejemplo en Windows:
> ```
> set CHROME_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
> ```

## Funcionalidades implementadas

**Backend**
- CRUD de Pokémon: listar (con filtro `?tipo=`), registrar, editar nivel (`PATCH`), eliminar
- CRUD básico de Entrenador: listar y registrar
- Validaciones Bean Validation (`@NotBlank`, `@NotNull`, `@Min`/`@Max`) sobre nombre, tipo y nivel
- `@RestControllerAdvice` con mensajes de error claros y códigos HTTP correctos (400 validación, 404 no encontrado)
- CORS habilitado para `http://localhost:4200`
- Arquitectura en capas: `controller` / `service` / `repository` / `dto` / `entity`, sin exponer entidades JPA en la API

**Frontend**
- Listado de Pokémon en tarjetas, consumiendo la API real
- Formulario reactivo para registrar Pokémon (nombre, tipo, nivel, fecha de captura, entrenador)
- Botón "+1 Nivel" para subir de nivel
- Eliminar con diálogo de confirmación
- Filtro por tipo (dropdown)
- Búsqueda por nombre en vivo
- Ordenar por nivel (ascendente/descendente)
- Barra visual de nivel/progreso
- Mensaje "No hay Pokémon registrados" cuando la lista o el filtro no arrojan resultados
- Mensajes de error del backend mostrados en la UI
- Estado manejado con Angular Signals

## Colección de Postman

Importa [`pokedex.postman_collection.json`](./pokedex.postman_collection.json) en Postman. Incluye, por cada endpoint, un ejemplo de request válido y uno o más ejemplos inválidos que disparan los mensajes de error (400/404).

## Decisión técnica: Flyway vs Liquibase

Se eligió **Flyway** sobre Liquibase por ser la opción más simple para un schema pequeño (2 tablas) en una prueba de un día: usa SQL plano en vez de un DSL propio, requiere menos configuración en Spring Boot y es más rápido de auditar en revisión de código. Liquibase aporta rollback declarativo y diffing automático, capacidades que no se justifican para el alcance de este proyecto.
