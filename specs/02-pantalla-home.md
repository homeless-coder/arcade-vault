# 02 - Pantalla Home (landing)

**Estado:** Implementado
**Depende de:** SPEC 01
**Fecha:** 2026-08-22

**Objetivo:** Portar la pantalla Home del mockup de referencia (`references/templates/home-about/home-about/home.jsx`) como la nueva ruta raíz `/`, moviendo la Biblioteca actual a `/biblioteca` y actualizando la navegación y los enlaces internos en consecuencia.

## Alcance

**Incluido:**
- Nueva ruta `/` — Home: hero animado con siluetas pixel flotantes decorativas, sección "¿POR QUÉ ARCADE VAULT?" (4 tarjetas de feature), sección "JUEGOS DISPONIBLES AHORA" (preview de hasta 6 juegos reales desde `lib/data.ts`), sección de stats (3 bloques), sección "ACTIVIDAD EN VIVO" (últimas puntuaciones + top jugadores, con datos decorativos estáticos igual que el mockup), sección de precios con plan único gratuito + FAQ, y CTA final.
- La Biblioteca actual (contenido de `app/page.tsx`) se mueve a la nueva ruta `/biblioteca`, sin cambios funcionales — mismo buscador, chips de categoría, grid de `GameCard` y estado vacío.
- Actualización de `components/Nav.tsx`: se agrega el link "Inicio" apuntando a `/`, el link "Biblioteca" pasa a apuntar a `/biblioteca`, y se ajusta la lógica de resaltado activo (`isActive`) para que `/` resalte "Inicio" y `/biblioteca` + `/juegos/*` resalten "Biblioteca".
- Actualización de todos los enlaces/redirecciones internas que hoy asumen que `/` es la Biblioteca, para que apunten a `/biblioteca`: `app/auth/page.tsx` (login y registro mock), `app/salon-de-la-fama/page.tsx` (botón inferior), `app/juegos/[id]/page.tsx` (botón "Volver al Vault"), `components/GamePlayer.tsx` (botón de salida).
- Estilos de la pantalla Home portados a `app/globals.css` (mismo archivo ya usado por el resto del sitio, sin archivo CSS separado), incluyendo las clases del mockup (`home-hero`, `home-silos`, `feature-grid`, `mini-rail`, `home-stats`, `activity-grid`, `pricing-grid`, `home-final`, etc.) y los íconos SVG pixel-art embebidos (siluetas flotantes, íconos de features).
- Aplicar `/frontend-design` como guía de dirección visual durante la implementación, manteniendo el lenguaje visual pixel/neón ya establecido por el mockup y por `app/globals.css`.

**No incluido:**
- La pantalla "Acerca de" (`about.jsx` del mismo template) — queda para un spec futuro, junto con su link en el Nav.
- Cualquier fuente de datos real para "actividad en vivo" (últimas puntuaciones de otros jugadores, top jugadores globales) — se portan como arrays estáticos igual que en el mockup, no hay backend ni eventos en tiempo real en este proyecto.
- Cambios al sistema de precios/planes real — la sección de precios es puramente informativa/decorativa, sin lógica de pago.
- Tests automatizados (no hay test runner configurado en el proyecto).
- Cambios a `lib/session.ts`, `lib/data.ts` (más allá de reutilizar `GAMES` existente) o a la lógica de autenticación/scores.

## Modelo de datos

No se introduce ningún modelo de datos nuevo. La sección "JUEGOS DISPONIBLES AHORA" reutiliza `GAMES` de `lib/data.ts` (tomando los primeros 6). Las secciones "ACTIVIDAD EN VIVO" (últimas puntuaciones, top jugadores) y "STATS" usan los mismos arrays estáticos hardcodeados del mockup (`home.jsx`), sin tipos ni archivo de datos propio, ya que son contenido decorativo sin respaldo en `lib/`.

## Plan de implementación

1. Crear `app/biblioteca/page.tsx` con el contenido actual de `app/page.tsx` (buscador, chips, grid, estado vacío), sin cambios de lógica.
2. Reemplazar `app/page.tsx` con la nueva pantalla Home, portando la estructura de `home.jsx`: hero + siluetas SVG, sección features, sección preview de juegos (usando `GAMES.slice(0, 6)` de `lib/data.ts` y navegando a `/juegos/[id]` con `next/link` o `useRouter`), sección stats, sección actividad en vivo, sección precios + FAQ, CTA final. Extraer subcomponentes cuando el archivo crezca demasiado (p. ej. una tarjeta de preview de juego), siguiendo la convención de `components/GameCard.tsx` ya existente.
3. Portar a `app/globals.css` las reglas CSS del mockup (`references/templates/home-about/home-about/styles.css`) correspondientes a las clases usadas por la nueva pantalla Home (prefijo `home-*`, `feature-*`, `mini-*`, `activity-*`, `pricing-*`, `stat-*`, `final-*`), revisando que no colisionen con clases ya existentes de la Biblioteca/Detalle/Reproductor/Auth/Salón.
4. Actualizar `components/Nav.tsx`: agregar link "Inicio" → `/`, cambiar el link "Biblioteca" → `/biblioteca`, y ajustar `isActive` para distinguir Home (`pathname === "/"`) de Biblioteca (`pathname === "/biblioteca" || pathname.startsWith("/juegos")`). Replicar el cambio en el panel mobile.
5. Actualizar las redirecciones/enlaces que apuntaban a `/` esperando la Biblioteca, para que apunten a `/biblioteca`: `app/auth/page.tsx` (dos `router.push("/")`), `app/salon-de-la-fama/page.tsx` (botón inferior), `app/juegos/[id]/page.tsx` (botón "Volver al Vault"), `components/GamePlayer.tsx` (botón de salida).
6. Verificar manualmente en el navegador: `/` muestra el Home completo con todas sus secciones y animaciones de reveal al hacer scroll, `/biblioteca` sigue funcionando igual que antes, la navegación (desktop y mobile) resalta correctamente "Inicio" vs "Biblioteca", y los botones que antes llevaban a la Biblioteca ahora llevan a `/biblioteca`.

## Criterios de aceptación

- [*] `/` muestra la pantalla Home completa: hero con siluetas flotantes y CTAs, sección de features, preview de juegos reales (de `lib/data.ts`), stats, actividad en vivo, precios + FAQ, y CTA final.
- [*] Las animaciones de "reveal" al hacer scroll funcionan en las secciones del Home, igual que en el mockup.
- [*] El CTA "EXPLORAR JUEGOS" del hero y el botón "VER TODOS LOS JUEGOS" navegan a `/biblioteca`; el CTA "CREAR CUENTA" navega a `/auth`; "VER SALÓN" navega a `/salon-de-la-fama`; el CTA final navega a `/biblioteca`.
- [*] Cada tarjeta de la sección "JUEGOS DISPONIBLES AHORA" navega a `/juegos/[id]` del juego correspondiente.
- [*] `/biblioteca` conserva exactamente el comportamiento actual (buscador, chips de categoría, grid, estado vacío).
- [*] El Nav muestra "Inicio" y "Biblioteca" como links separados; "Inicio" se resalta como activo solo en `/`, y "Biblioteca" se resalta como activo en `/biblioteca` y en `/juegos/*`.
- [*] El panel mobile del Nav refleja los mismos dos links y el mismo resaltado.
- [*] Los botones "Volver al Vault" (detalle de juego), el botón de salida del Reproductor, el botón inferior del Salón de la Fama, y las redirecciones tras login/registro/invitado en `/auth`, navegan todos a `/biblioteca` (ya no a `/`).
- [*] El diseño visual del Home es consistente en pixel/neón con el resto del sitio (mismas fuentes, paleta y componentes base ya definidos en `app/globals.css`).

## Decisiones tomadas y descartadas

- **Ruta del Home:** el Home pasa a ser la ruta raíz `/`, y la Biblioteca (antes en `/`) se mueve a `/biblioteca` — decisión del usuario, coherente con el `nav.jsx` del mockup (Inicio, Biblioteca, Salón, Acerca de) y con el patrón landing + catálogo separado.
- **Datos de "actividad en vivo" y stats:** se portan como arrays estáticos hardcodeados igual que en el mockup, sin inventar una fuente de datos real — no existe en el proyecto un sistema de eventos globales ni de puntuaciones de otros jugadores, solo `lib/session.ts` con el usuario/scores locales del navegador actual.
- **Preview de juegos:** a diferencia de "actividad en vivo", sí se conecta a datos reales (`GAMES` de `lib/data.ts`) porque el catálogo de juegos ya existe como fuente de verdad en el proyecto — no tiene sentido duplicarlo como mock.
- **Sección de precios:** se incluye tal cual el mockup (plan único gratuito + FAQ), por ser contenido puramente informativo sin lógica de pago real, coherente con el resto del sitio ("sin backend real").
- **Estilos:** se agregan a `app/globals.css` (mismo archivo compartido por todo el sitio) en vez de crear una hoja de estilos separada para el Home, siguiendo la convención ya establecida en el spec 01.
- **About fuera de alcance:** se deja explícitamente para un spec futuro, junto con su link correspondiente en el Nav — evita mezclar dos pantallas distintas en un mismo spec.

## Riesgos identificados

- Mover la Biblioteca de `/` a `/biblioteca` rompe cualquier enlace o redirección existente que asuma que `/` es el catálogo — el paso 5 del plan de implementación debe cubrir todos los puntos identificados (`auth`, `salon-de-la-fama`, `juegos/[id]`, `GamePlayer`) para no dejar ninguno apuntando al lugar incorrecto.
- Las clases CSS portadas desde `styles.css` del mockup pueden colisionar en nombre con clases ya existentes en `app/globals.css` (ambos archivos vienen del mismo mockup general, pero fueron portados en momentos distintos) — revisar antes de pegar el bloque completo.
- Next.js 16 / React 19 tienen convenciones distintas a las conocidas por defecto (ver `AGENTS.md`) — revisar `node_modules/next/dist/docs/01-app` para la forma correcta de manejar `IntersectionObserver` dentro de un Client Component sin problemas de hidratación.
