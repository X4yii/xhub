---
title: "Visión General"
project: "Automata"
category: "Introducción"
categoryOrder: 0
order: 0
---

[ES]
# Automata v1.0.0 — Visión General

**Automata** añade agentes autónomos tipo jugador para **Minecraft 1.12.2 (CleanroomMC)** con navegación 3D asíncrona, combate táctico, supervivencia reactiva y coordinación por escuadrones.

## Requisitos
- **Minecraft:** `1.12.2`
- **Loader:** CleanroomMC `0.6.X` (Java 21) o `0.7.X` (Java 25)
- **Java:** `21+`
- **Dependencia obligatoria:** `x4ui` **`r1.0b6`** (`required-after:x4ui@[r1.0b6]`)
- **Integraciones opcionales:** Hwyla / Waila, HEI / JEI, Spartan Weaponry `[WIP]` Scape and Run: Parasites.

## Sistemas principales
1. **Pathfinding A\* 3D asíncrono:** Corre fuera del `Server thread` sobre secciones cacheadas en memoria primitiva (`WorldCacheManager`).
2. **IA de utilidad con histéresis:** Prioriza supervivencia crítica (lava, fuego, explosivos, poca vida, reanimación de aliados) sobre combate y trabajos.
3. **Escuadrones y separación aliada:** Los autómatas aliados no se empujan físicamente entre sí y mantienen una separación suave de **0.5 bloques**.
4. **Throttling adaptativo por MSPT:** Si un modpack pesado degrada el tick del servidor (`>= 35 mspt`), escala automáticamente las tareas secundarias.
[/ES]

[EN]
# Automata v1.0.0 — Overview

**Automata** adds autonomous player-like agents for **Minecraft 1.12.2 (CleanroomMC)** featuring asynchronous 3D navigation, tactical combat, reactive survival, and squad coordination.

## Requirements
- **Minecraft:** `1.12.2`
- **Mod Loader:** CleanroomMC `0.6.X` (Java 21) or `0.7.X` (Java 25)
- **Java:** `21+`
- **Required Dependency:** `x4ui` **`r1.0b6`** (`required-after:x4ui@[r1.0b6]`)
- **Optional Integrations:** Hwyla / Waila, HEI / JEI, Spartan Weaponry `[WIP]` Scape and Run: Parasites.

## Core Systems
1. **Asynchronous 3D A\* Pathfinding:** Executes off the `Server thread` over primitive-backed cached world sections (`WorldCacheManager`).
2. **Hybrid Utility AI with Hysteresis:** Prioritizes critical survival (lava, fire, explosives, low health, ally revival) over combat and tasks.
3. **Squads & Ally Separation:** Allied automata ignore physical pushing against each other and maintain a **0.5-block** soft separation gap.
4. **Adaptive MSPT Throttling:** Automatically scales non-critical intervals when a heavy modpack increases server tick time (`>= 35 mspt`).
[/EN]