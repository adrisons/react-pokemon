# Optimizaciones de Performance

Documento de referencia para los cambios de rendimiento introducidos en la app.  
Cada sección explica **qué se hizo**, **por qué funciona** y **cómo verificarlo**.

---

## 1. Code Splitting con `React.lazy` + `Suspense`

### Qué se cambió

`src/app/router.tsx` — Las páginas `PokemonListPage` y `PokemonDetailPage` se cargan ahora con importación dinámica:

```tsx
const PokemonListPage   = lazy(() => import("@features/pokemon-list/pages/PokemonListPage"));
const PokemonDetailPage = lazy(() => import("@features/pokemon-detail/pages/PokemonDetailPage"));

function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>…</Routes>
    </Suspense>
  );
}
```

### Fundamento teórico

Sin code splitting, Webpack/Vite empaqueta **toda** la aplicación en un único archivo JS.
El navegador tiene que descargar, parsear y ejecutar ese archivo antes de mostrar cualquier cosa.

Con `React.lazy()`, Vite corta el bundle en **chunks independientes** que se cargan
*a demanda* cuando el usuario navega a esa ruta. `<Suspense>` gestiona el estado intermedio
mientras el chunk llega: muestra el `fallback` y monta el componente real en cuanto está listo.

La ganancia es principalmente en **Time to Interactive (TTI)** de la ruta inicial:
solo se descarga el código que se necesita en ese momento.

### Resultado en producción (`pnpm build`)

| Chunk                    | Tamaño raw | Tamaño gzip |
|--------------------------|-----------|-------------|
| `index-*.js` (vendor)    | 221.6 kB  | 71.4 kB     |
| `PokemonListPage-*.js`   |   8.4 kB  |  3.2 kB     |
| `PokemonDetailPage-*.js` |   3.2 kB  |  1.2 kB     |
| `statColors-*.js`        |  35.4 kB  | 12.0 kB     |

El bundle vendor sigue siendo el mayor porque incluye React, React Router y el resto
de dependencias compartidas, que solo se descargan una vez y van a caché del navegador.
Las páginas suman menos de 12 kB gzip combinadas.

> **Antes**: 1 solo archivo. El navegador debía procesarlo entero antes de arrancar.  
> **Ahora**: el chunk vendor se descarga una vez; cada página llega solo cuando se visita.

---

## 2. Caché HTTP en memoria

### Qué se cambió

Nuevo módulo `src/core/api/httpCache.ts`, integrado en `httpClient.ts`:

```ts
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  { ttlMs = 5 * 60 * 1000 } = {}
): Promise<T>
```

Todas las llamadas `get(url)` pasan ahora por este caché, lo que afecta a:

- `getPokemonList` — lista paginada
- `getPokemonDetail` — detalle de cada Pokémon
- `getAbilityDescription` — descripción de habilidades (una petición por habilidad)

### Fundamento teórico

La PokeAPI es una API de solo lectura cuyos datos cambian muy raramente.
Sin caché, **cada visita** a la misma página dispara peticiones de red idénticas.

El caché implementado tiene tres propiedades:

1. **TTL (Time To Live) de 5 minutos**: la respuesta se reutiliza durante ese tiempo;
   pasado ese tiempo, la siguiente petición refresca el dato. El valor es configurable
   por llamada si algún endpoint requiriera otro comportamiento.

2. **Deduplicación de peticiones en vuelo** (*stampede protection*): si dos componentes
   piden el mismo recurso al mismo tiempo (caso habitual al renderizar la grid de tarjetas),
   solo se lanza **una** petición real y ambos comparten la misma promesa. Sin esto,
   20 tarjetas en pantalla dispararían 20 peticiones simultáneas al mismo endpoint.

3. **Invalidación en error**: si la petición falla, la entrada no se cachea. La próxima
   llamada intentará de nuevo en lugar de devolver un error indefinidamente.

> **Antes**: cada render o navegación al mismo Pokémon hacía una petición de red.  
> **Ahora**: la primera visita paga el coste de red; el resto lee desde memoria.

---

## 3. Carga diferida y decodificación asíncrona de imágenes

### Qué se cambió

Se añadieron dos atributos HTML estándar a las imágenes de Pokémon:

```html
<!-- PokemonCard (grid de la lista) -->
<img loading="lazy" decoding="async" src={pokemon.imageUrl} … />

<!-- PokemonPicture (hero del detalle) -->
<img loading="lazy" decoding="async" src={imageUrl} … />

<!-- Loading (spinner) -->
<img decoding="async" src={pokeball} … />
```

### Fundamento teórico

#### `loading="lazy"`

Por defecto el navegador descarga **todas** las imágenes del DOM en cuanto las encuentra,
estén o no en el viewport. Con `loading="lazy"`, el navegador pospone la descarga hasta
que la imagen se acerca al viewport (normalmente a ~200 px de distancia).

En la grid de Pokémon esto es especialmente relevante: hay hasta 20 tarjetas por página
y muchas pueden estar fuera de pantalla al cargar. Aplazar esas descargas reduce el
consumo de ancho de banda inicial y libera conexiones HTTP para recursos más urgentes.

No se aplica `loading="lazy"` al spinner de `Loading` porque aparece siempre en el centro
de la pantalla y debe mostrarse inmediatamente.

#### `decoding="async"`

La decodificación de imágenes (de binario comprimido a píxeles en memoria) ocurre en el
hilo principal por defecto. Con `decoding="async"`, el navegador puede moverla a un hilo
secundario, evitando que bloquee el compositing y reduciendo los *jank* visuales durante
el scroll o las animaciones.

> **Antes**: todas las imágenes se descargaban y decodificaban en el momento de renderizado.  
> **Ahora**: las imágenes fuera de viewport se descargan al acercarse; la decodificación
> no bloquea el hilo principal.

---

## 4. Bundle analysis

### Qué se configuró

`vite.config.ts`:
```ts
build: {
  sourcemap: true  // genera archivos .map junto a cada chunk
}
```

`package.json`:
```json
"analyze": "source-map-explorer 'dist/assets/*.js' --no-border-checks"
```

### Cómo ejecutarlo

```bash
pnpm build          # genera dist/ con sourcemaps
pnpm build:analyze  # abre el análisis en el navegador
```

### Qué hace y para qué sirve

`source-map-explorer` lee los sourcemaps del bundle y muestra un **treemap interactivo**:
cada módulo ocupa un área proporcional a sus bytes en el bundle final. Permite identificar:

- Dependencias más pesadas (p.ej. librerías incluidas sin tree-shaking).
- Código duplicado entre chunks.
- Archivos propios más grandes de lo esperado.

#### Nota sobre las advertencias en la primera ejecución

Al correr `pnpm build:analyze` por primera vez (antes de añadir `--no-border-checks`) se producía:

```
Your source map refers to generated column Infinity on line N, but the source only contains X column(s).
[ELIFECYCLE] Command failed with exit code 1.
```

Este es un comportamiento conocido de `source-map-explorer 2.5.x` con los sourcemaps
que genera Rollup/Vite: algunas entradas del mapa contienen `column: Infinity` como
marcador de fin de línea. La herramienta lo trata como error fatal por defecto.

El flag `--no-border-checks` desactiva esa validación estricta sin perder funcionalidad;
el análisis de tamaños sigue siendo completamente correcto.

---

## Resumen

| Optimización              | Métrica principal afectada        | Mecanismo             |
|---------------------------|-----------------------------------|-----------------------|
| Code splitting            | TTI (Time to Interactive)         | Carga diferida de JS  |
| Caché HTTP con TTL        | Latencia percibida, peticiones red | Memoria + dedup       |
| `loading="lazy"`          | LCP (Largest Contentful Paint)    | Descarga diferida     |
| `decoding="async"`        | Smoothness / jank                 | Hilo secundario       |
| Sourcemaps + analyze      | Observabilidad del bundle         | Herramienta de análisis |

### Próximas optimizaciones sugeridas

- **`rollup-plugin-visualizer`**: alternativa a `source-map-explorer` nativa de Vite, sin problemas de compatibilidad con sourcemaps.
- **WebP para assets locales** (`pokeball.png`, `pokemon-logo.png`): usando `vite-imagetools` se pueden convertir en build y servir con `<picture>` + fallback PNG.
- **Preload del chunk vendor**: añadir `<link rel="modulepreload">` en `index.html` para que el bundle principal se prefetche mientras el usuario lee la página.
- **`staleWhileRevalidate` en el caché HTTP**: devolver el dato cacheado inmediatamente y refrescarlo en background, eliminando el TTL rígido.
