# 01 - Pantallas visuales MVP de Arcade Vault

**Estado:** Aprobado
**Depende de:** —
**Fecha:** 2026-08-22

**Objetivo:** Portar las 5 pantallas del mockup de referencia (Biblioteca, Detalle, Reproductor, Auth y Salón de la Fama) a Next.js App Router como componentes React funcionales con navegación real por rutas, sin implementar ninguna lógica de juego real.

## Alcance

**Incluido:**
- Layout compartido: Nav (desktop + panel mobile deslizante) integrado en `app/layout.tsx`.
- Ruta `/` — Biblioteca: hero animado, buscador, chips de filtro por categoría, grid de tarjetas de juego con efecto tilt 3D, covers generados en CSS puro.
- Ruta `/juegos/[id]` — Detalle: info del juego (tags, descripción, stats), leaderboard de 10 filas (oro/plata/bronce en el top 3), botones "Jugar Ahora" / "Volver al Vault".
- Ruta `/juegos/[id]/jugar` — Reproductor: HUD (score, vidas, nivel), arena CRT decorativa con score autoincremental simulado, pausa/reanudar, fin de partida, modal para guardar iniciales.
- Ruta `/auth` — Login/registro mock: tabs "Iniciar sesión"/"Crear cuenta", botón de invitado, sin validación real ni backend.
- Ruta `/salon-de-la-fama` — Leaderboard global: tabs por juego, podio (oro/plata/bronce), tabla completa, fila especial "tu mejor marca" si hay usuario logueado.
- Persistencia mock 100% client-side vía `localStorage`: sesión de usuario (`av_user`) y scores guardados (`av_scores`).
- Datos mock centralizados y tipados en `lib/data.ts` (juegos, categorías, jugadores, generador de leaderboards determinista).
- Diseño responsive igual al mockup, reutilizando los breakpoints ya definidos en `app/globals.css`.

**No incluido:**
- Cualquier lógica de juego real (Bloque Buster, Caída, Serpentina, etc.) — el Reproductor sigue siendo 100% decorativo/placeholder.
- Backend real, API routes, base de datos o autenticación real.
- Tests automatizados (no hay test runner configurado en el proyecto).
- Sonido o efectos de audio.
- Persistencia de scores server-side o sincronizada entre dispositivos.
- Internacionalización — el contenido queda solo en español, igual que el mockup.

## Modelo de datos

`lib/data.ts` (tipado en TypeScript, portado de `references/templates/data.jsx`):
- `type Game = { id: string; title: string; short: string; long: string; cat: string; cover: string; color: string; best: number; plays: string }`
- `type ScoreRow = { rank: number; name: string; score: number; date: string }`
- `const GAMES: Game[]` — los 8 juegos del mockup.
- `const CATS: string[]` — `["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]`.
- `const PLAYERS: string[]` — 18 gamertags mock.
- `function seededScores(seed: number, count?: number): ScoreRow[]` — generador determinista de leaderboards (PRNG lineal congruencial), igual al del mockup.

`lib/session.ts` (nuevo, no existe en el mockup como archivo separado — ahí vivía inline en `app.jsx`):
- Helpers cliente-only sobre `localStorage`: `getUser()`, `setUser(user)`, `clearUser()`, `getScores()`, `addScore(entry)`.
- Tipos: `type User = { name: string } | null`, `type SavedScore = { gameId: string; name: string; score: number; at: string }`.

## Plan de implementación

1. `lib/data.ts` — tipos + datos mock + `seededScores`, portados de `data.jsx`.
2. `lib/session.ts` — helpers de `localStorage` para usuario y scores (con checks de `typeof window`, ya que Next.js renderiza en servidor).
3. `components/Nav.tsx` (Client Component) — barra de navegación sticky + panel mobile, usa `usePathname()` para resaltar la ruta activa, recibe/gestiona el usuario logueado.
4. `app/layout.tsx` — envolver `children` con un contexto de sesión de cliente (o pasar el estado vía un componente cliente wrapper) y montar `<Nav>`, conservando las capas `av-bg`/`av-noise`/`av-root` y fuentes ya configuradas.
5. `components/GameCard.tsx` (Client Component) — tarjeta con efecto tilt 3D (manipulación de `ref.style.transform` en `onMouseMove`/`onMouseLeave`), cover CSS dinámico, badge de mejor puntuación, botón "Jugar".
6. `app/page.tsx` — pantalla Biblioteca: hero, buscador + chips de categoría (estado local), grid de `GameCard` filtrado, estado vacío "NO HAY RESULTADOS".
7. `app/juegos/[id]/page.tsx` — pantalla Detalle: busca el juego por `id` (params dinámicos según convención Next.js 16 — revisar `node_modules/next/dist/docs/01-app` antes de escribir), `notFound()` si no existe; leaderboard vía `seededScores`.
8. `app/juegos/[id]/jugar/page.tsx` (Client Component) — pantalla Reproductor: HUD, arena CRT, `setInterval` de score simulado, pausa/fin/reinicio, modal de guardado que usa `lib/session.ts`.
9. `app/auth/page.tsx` (Client Component) — pantalla Auth: tabs, formulario mock (sin validación real), botón de invitado; al enviar, guarda el usuario vía `lib/session.ts` y redirige a `/`.
10. `app/salon-de-la-fama/page.tsx` (Client Component) — pantalla Salón: tabs por juego, podio + tabla vía `seededScores`, fila "tu mejor marca" si hay usuario logueado.

## Criterios de aceptación

- [ ] `/` muestra la Biblioteca con hero, buscador funcional (filtra por texto) y chips de categoría funcionales.
- [ ] Cada tarjeta de juego tiene efecto tilt al mover el mouse y navega a `/juegos/[id]` al hacer click (o en el botón "Jugar").
- [ ] `/juegos/[id]` muestra la info correcta del juego según el `id` y un leaderboard de 10 filas con estilos oro/plata/bronce en el top 3.
- [ ] El botón "Jugar Ahora" navega a `/juegos/[id]/jugar`; "Volver al Vault" navega a `/`.
- [ ] `/juegos/[id]/jugar` muestra el HUD con un score que sube automáticamente, y los botones de pausa/fin/salir funcionan.
- [ ] Al terminar la partida se puede guardar el score con iniciales editables, y queda persistido en `localStorage` (`av_scores`).
- [ ] `/auth` permite alternar entre tabs "Iniciar sesión"/"Crear cuenta", loguearse con cualquier texto (mock) o como invitado, y redirige a `/`.
- [ ] Tras loguearse, el Nav muestra el nombre del usuario y permite cerrar sesión.
- [ ] `/salon-de-la-fama` permite cambiar entre juegos (tabs), muestra podio + tabla, y una fila especial si hay usuario logueado.
- [ ] El panel de navegación mobile (hamburguesa) abre y cierra correctamente en pantallas menores a 840px.
- [ ] Todas las rutas usan las clases ya existentes de `app/globals.css`, visualmente equivalentes al mockup `Arcade Vault.html`.

## Decisiones tomadas y descartadas

- **Estilos:** se reutiliza `app/globals.css` tal cual (ya portado desde `styles.css`), sin migrar a Tailwind v4 — preserva el diseño exacto del mockup sin trabajo adicional fuera de alcance.
- **Persistencia:** `localStorage` puro en cliente, sin API routes ni backend — coherente con "solo la parte visual, sin ningún juego real".
- **Rutas:** `/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/auth`, `/salon-de-la-fama` reemplazan el hash-routing (`location.hash`) del mockup, para usar el App Router de forma idiomática.
- **Reproductor:** se mantiene el score autoincremental simulado con `setInterval`, igual que en el mockup — el usuario confirmó explícitamente no implementar ningún juego real.
- **Estructura de carpetas:** `lib/` para datos y helpers, `components/` en la raíz para piezas compartidas (Nav, GameCard) — se descartó co-ubicar todo en carpetas privadas de `app/` para mantener la convención más simple.
- **Arquitectura de componentes:** la mayoría de pantallas serán Client Components (`"use client"`) dado el uso extensivo de hooks (`useState`, `useEffect`, refs para el tilt) — no se plantea optimización a Server Components en este MVP visual.

## Riesgos identificados

- Next.js 16 / React 19 tienen convenciones distintas a las conocidas por defecto (ver `AGENTS.md`) — antes de escribir cada pantalla en `/spec-impl` hay que revisar `node_modules/next/dist/docs/01-app` para la forma correcta de `params` en rutas dinámicas, `LayoutProps`, etc.
- El efecto tilt 3D en `GameCard` manipula el DOM directamente vía `ref` — debe implementarse con cuidado como Client Component para evitar mismatches de hidratación.
- `localStorage` no existe durante el renderizado en servidor — los helpers de `lib/session.ts` deben protegerse con checks de `typeof window` o ejecutarse solo dentro de efectos/handlers de cliente.
