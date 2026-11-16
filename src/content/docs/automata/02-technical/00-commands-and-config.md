---
title: "Comandos y Configuración"
project: "Automata"
category: "Técnico"
categoryOrder: 2
order: 0
---

[ES]
# Comandos y Configuración

## Comandos
- `/automata spawn [nombreSkin]` — Invoca un autómata vinculado a ti (opcionalmente con skin de jugador). Requiere OP nivel 2.
- `/automata reload` — Recarga el catálogo de minerales (`ModdedOreCatalog`). Requiere OP nivel 2.
- **Teletransporte por chat:** `.nombreBot tp me` o `.nombreBot tp <jugador>` (con autocompletado Tab).
- **Selectores:** Los comandos admiten tokens `@a` / `@a[...]` extendidos para incluir autómatas.

## Opciones clave (`config/automata.cfg` y GUI In-Game)
- `maxPathfindingThreads` (defecto `4`): Hilos concurrentes para A\* asíncrono.
- `adaptiveTpsThrottling` (defecto `true`): Escala automáticamente tareas no críticas cuando el MSPT del servidor supera `35 / 50 / 75 ms`.
- `allySeparationGap` (defecto `0.5`): Distancia mínima libre (en bloques) entre autómatas aliados.
- `allowTerrainModificationInPathing` `[WIP]` (defecto `true`): Habilita pillar, bridge y break-through fuera de zonas de trabajo.
- `maxBotsPerPlayer` (defecto `8`), `chunkLoadRadius` (defecto `1`), `ignoreAnimals`, `ignoreCalmNeutrals`.
[/ES]

[EN]
# Commands & Configuration

## Commands
- `/automata spawn [skinName]` — Spawns an owned automaton (with optional player skin). Requires OP level 2.
- `/automata reload` — Reloads `ModdedOreCatalog` configuration. Requires OP level 2.
- **Chat Teleport:** `.botname tp me` or `.botname tp <player>` (with Tab completion).
- **Selectors:** Commands support extended `@a` / `@a[...]` targeting for automata.

## Key Options (`config/automata.cfg` & In-Game GUI)
- `maxPathfindingThreads` (default `4`): Worker threads for async A\* pathfinding.
- `adaptiveTpsThrottling` (default `true`): Scales non-critical intervals when server MSPT exceeds `35 / 50 / 75 ms`.
- `allySeparationGap` (default `0.5`): Minimum free gap (blocks) kept between allied automata.
- `allowTerrainModificationInPathing` `[WIP]` (default `true`): Enables pillar, bridge, and break-through outside work zones.
- `maxBotsPerPlayer` (default `8`), `chunkLoadRadius` (default `1`), `ignoreAnimals`, `ignoreCalmNeutrals`.
[/EN]

