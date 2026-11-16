---
title: "Navegación 3D y Movimiento"
project: "Automata"
category: "Referencia Técnica"
categoryOrder: 2
order: 1
---

[ES]
# Navegación 3D, `WorldCacheManager` y Movimiento

## `AutomatonPathfinder` (A\* 3D Asíncrono)
- Ejecutado en `PathfindingExecutor` (`ThreadPoolExecutor` daemon `Automata-Pathfinder-*`, `MAX_QUEUED_PATHS = 64`, hilos configurables vía `maxPathfindingThreads`).
- Estructuras primitivas sin boxing:
  - `PackedPos`: empaquetado de coordenadas `(x, y, z)` y claves de sección en `long`.
  - `PrimitiveMinHeap` y `PrimitiveNodeTable`: cola de prioridad y tabla hash abierta sobre arreglos primitivos.
  - `DIAG_PARKOUR_OFFSETS`: constante estática para saltos diagonales de parkour (1–4 bloques).
- **Nado vertical y salida a orilla:** `expandCardinalAndVertical` incluye nodos `(cx, cy + 1, cz)` y `(cx, cy - 1, cz)` cuando el autómata está en `BlockCellType.WATER`, permitiendo ascender por columnas de agua 1×1 y salir a bloques secos adyacentes.

---

## `WorldCacheManager`
- Mantiene un `DimensionSectionCache` por dimensión con `Long2ObjectLinkedOpenHashMap<CacheEntry>` (evicción LRU O(1), límite `MAX_SECTIONS_PER_DIMENSION = 16384`).
- Cada sección 16×16×16 (`4096` bytes de `BlockCellType`) se copia en `SnapshotView` usando `Long2ObjectOpenHashMap<byte[]>` de FastUtil, eliminando por completo el boxing de `Long` en `getCellType(x, y, z)`.
- Invalidación reactiva ante eventos de bloque, chunk y explosiones, más refresco periódico (`SECTION_REFRESH_INTERVAL_TICKS = 30`, escalado por MSPT).

---

## `HumanMovementController`, `BlockPlacementService` y `TerrainBreaker`
- Traduce los waypoints (`PathNodeAction`: `WALK`, `STEP_UP`, `SPRINT_JUMP`, `SWIM`, `PILLAR_UP`, `BRIDGE`, `BREAK_THROUGH`) a controles `moveForward`/`moveStrafing`, saltos en borde, centrado horizontal antes de pillar y `sneak` en puentes.
- `MiningProgressController` difiere el minado si el autómata está en el aire fuera de agua/escalera para evitar penalizaciones de velocidad de rotura.
[/ES]

[EN]
# 3D Navigation, `WorldCacheManager` & Movement

## `AutomatonPathfinder` (Async 3D A\*)
- Runs inside `PathfindingExecutor` (`Automata-Pathfinder-*` daemon `ThreadPoolExecutor`, `MAX_QUEUED_PATHS = 64`, threads configured via `maxPathfindingThreads`).
- Zero-boxing primitive data structures:
  - `PackedPos`: packs `(x, y, z)` block and section coordinates into `long`.
  - `PrimitiveMinHeap` & `PrimitiveNodeTable`: primitive array-backed priority queue and open-addressing node table.
  - `DIAG_PARKOUR_OFFSETS`: static constant for diagonal parkour jumps (1–4 blocks).
- **Vertical Swimming & Shore Exit:** `expandCardinalAndVertical` expands `(cx, cy + 1, cz)` and `(cx, cy - 1, cz)` inside `BlockCellType.WATER`, enabling ascent through 1×1 underwater shafts onto dry shores.

---

## `WorldCacheManager`
- Maintains a per-dimension `DimensionSectionCache` backed by `Long2ObjectLinkedOpenHashMap<CacheEntry>` (O(1) LRU eviction, `MAX_SECTIONS_PER_DIMENSION = 16384`).
- Each 16×16×16 section (`4096` `BlockCellType` bytes) is snapshotted into `SnapshotView` using FastUtil `Long2ObjectOpenHashMap<byte[]>`, eliminating `Long` boxing in `getCellType(x, y, z)`.
- Reactive invalidation on block, chunk, and explosion events, plus MSPT-scaled periodic refresh (`SECTION_REFRESH_INTERVAL_TICKS = 30`).

---

## `HumanMovementController`, `BlockPlacementService` & `TerrainBreaker`
- Converts waypoints (`PathNodeAction`: `WALK`, `STEP_UP`, `SPRINT_JUMP`, `SWIM`, `PILLAR_UP`, `BRIDGE`, `BREAK_THROUGH`) into `moveForward`/`moveStrafing`, edge step-jumps, horizontal centering before pillar-up, and sneak-bridging.
- `MiningProgressController` defers block breaking while airborne outside water/ladders to avoid mining speed penalties.
[/EN]

