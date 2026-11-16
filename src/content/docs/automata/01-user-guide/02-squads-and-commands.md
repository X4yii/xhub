---
title: "Escuadrones, Comandos y Config"
project: "Automata"
category: "Guía de Usuario"
categoryOrder: 1
order: 2
---

[ES]
# Escuadrones, Comandos y Configuración

## Escuadrones (`Squads`)
Desde la pestaña **Behavior & Squad** de la interfaz X4UI se puede asignar un **canal de escuadrón** y activar la **cooperación**:
- **Separación aliada:** Los autómatas aliados no se empujan físicamente entre sí y mantienen una separación suave de **0.5 bloques** (configurable con `allySeparationGap`).
- **Rescate de aliados:** Cuando un miembro entra en estado `downed`, el resto del escuadrón recibe la alerta y coordina a un único rescatista para evitar duplicados.
- **Turnos y reservas:** Rotación de turnos de combate cuerpo a cuerpo y reserva compartida de bloques de trabajo.

---

## Comandos y Chat
| Comando / Sintaxis | Permiso | Función |
| :--- | :--- | :--- |
| `/automata spawn [nombreSkin]` | OP nivel `2` | Invoca un autómata vinculado al jugador |
| `/automata reload` | OP nivel `2` | Recarga la configuración de `ModdedOreCatalog` |
| `.nombreBot tp me` | Dueño / OP | Teletransporta el autómata hacia ti (con Tab-complete) |
| `.nombreBot tp <jugador>` | Dueño / OP | Teletransporta el autómata hacia otro jugador |
| `@a` / `@a[...]` | Comandos vanilla | Selectores extendidos para incluir autómatas |

---

## Configuración (`GuiAutomataConfigScreen` / `automata.cfg`)
Accesible desde el menú de Mods de Forge/Cleanroom:
- `maxPathfindingThreads` (`4`): Hilos concurrentes para pathfinding A\* asíncrono.
- `adaptiveTpsThrottling` (`true`): Reduce frecuencia de tareas no críticas cuando el MSPT del servidor supera `35 / 50 / 75 ms`.
- `allySeparationGap` (`0.5`): Espacio libre mínimo en bloques entre autómatas aliados.
- `maxBotsPerPlayer` (`8`), `chunkLoadRadius` (`1`), `campSpawnRarity` (`240`).
- `allowTerrainModificationInPathing` `[WIP]` (`true`): Habilita pillar, bridge y break-through fuera de zonas de trabajo.
- `ignoreAnimals` (`true`), `ignoreCalmNeutrals` (`true`), `preventAutomatonCropTrampling` (`true`).
[/ES]

[EN]
# Squads, Commands & Configuration

## Squads
From the **Behavior & Squad** tab in X4UI, players can assign a **squad channel** and toggle **squad cooperation**:
- **Ally Separation:** Allied automata ignore physical pushing against each other and maintain a **0.5-block** soft gap (configurable via `allySeparationGap`).
- **Ally Rescue:** When a member enters the `downed` state, the squad blackboard alerts allies and assigns a single reviver to avoid duplicate attempts.
- **Turns & Reservations:** Melee combat turn rotation and shared work-block reservations.

---

## Commands & Chat
| Command / Syntax | Permission | Function |
| :--- | :--- | :--- |
| `/automata spawn [skinName]` | OP level `2` | Spawns an automaton owned by the sender |
| `/automata reload` | OP level `2` | Reloads `ModdedOreCatalog` configuration |
| `.botname tp me` | Owner / OP | Teleports the automaton to you (with Tab-completion) |
| `.botname tp <player>` | Owner / OP | Teleports the automaton to another player |
| `@a` / `@a[...]` | Vanilla commands | Extended selectors supporting automata |

---

## Configuration (`GuiAutomataConfigScreen` / `automata.cfg`)
Accessible from the Forge/Cleanroom Mods menu:
- `maxPathfindingThreads` (`4`): Concurrent worker threads for async A\* pathfinding.
- `adaptiveTpsThrottling` (`true`): Scales non-critical intervals when server MSPT exceeds `35 / 50 / 75 ms`.
- `allySeparationGap` (`0.5`): Minimum free gap in blocks between allied automata.
- `maxBotsPerPlayer` (`8`), `chunkLoadRadius` (`1`), `campSpawnRarity` (`240`).
- `allowTerrainModificationInPathing` `[WIP]` (`true`): Enables pillar, bridge, and break-through outside work zones.
- `ignoreAnimals` (`true`), `ignoreCalmNeutrals` (`true`), `preventAutomatonCropTrampling` (`true`).
[/EN]

