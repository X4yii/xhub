---
title: "Visión General"
project: "Automata"
category: "Introducción"
categoryOrder: 0
order: 0
---

[ES]
# Automata v1.0.0 — Visión General

**Automata** implementa agentes autónomos tipo jugador para **Minecraft 1.12.2** sobre **CleanroomMC**. Cada entidad `EntityAutomaton` opera con inventario propio, equipamiento automático, navegación tridimensional asíncrona, evaluación de supervivencia, combate táctico y coordinación por escuadrones.

---

## Requisitos del Entorno

| Componente | Requisito | Notas |
| :--- | :--- | :--- |
| **Minecraft** | `1.12.2` | — |
| **Mod Loader** | CleanroomMC `0.6.X` / `0.7.X` | Compilado con bytecode Java 21 (`major 65`) |
| **Java** | `21+` | Compatible con Java 21 (`0.6.X`) y Java 25 (`0.7.X`) |
| **Dependencia obligatoria** | `x4ui` **`r1.0b6`** | `required-after:x4ui@[r1.0b6]` |

### Integraciones Opcionales
- **Hwyla / Waila:** Tooltip de estado, trabajo activo y canal de escuadrón al apuntar a un autómata.
- **HEI / JEI:** Consulta de recetas (como `Comida con alas`).
- **Scape and Run: Parasites (SRP):** Inmunidad frente a infección COTH en autómatas vivos y en estado `downed`.
- **Spartan Weaponry `[WIP]`:** Integración experimental incompleta para armas arrojadizas, ballestas y alcance.

---

## Matriz de Estado de Funciones (`v1.0.0`)

| Sistema / Trabajo | Estado | Descripción breve |
| :--- | :--- | :--- |
| **Defend / CrazyDefend / Roam** | Estable | Combate melee/arco parabólico, patrulla de zona y chunk loading |
| **Excavation / Idle** | Estable | Excavación por caja `Pos1`–`Pos2` y seguimiento/espera |
| **Squads (`SquadBlackboard`)** | Estable | Reserva de bloques, turnos de combate, rescate `downed` y separación `0.5` m |
| **AutomaStaff & X4UI** | Estable | HUD de 4 modos, selección `Pos1`–`Pos2`, cofres y paneles X4UI |
| **Comida con alas** | Estable | Espada (`9` daño / `1.6` vel. / `3200` dur.) y despido seguro |
| **Pathfinding 3D & Nado** | Estable | A\* asíncrono en FastUtil, parkour 1–4 bloques, nado vertical y orilla |
| **Throttling por MSPT** | Estable | Escalado automático de tareas secundarias bajo carga de modpacks |
| **Mine (`MinerJob`)** | `[WIP]` | Minado de vetas expuestas cercanas; sujeto a cambios |
| **Lumberjack (`LumberjackJob`)** | `[WIP]` | Tala y replantado en espiral; sujeto a cambios |
| **Farmer (`FarmerJob`)** | `[WIP]` | Labrado por filas y siembra intercalada; sujeto a cambios |
| **Pillar / Bridge / Break-through** | `[WIP]` | Modificación de terreno en pathfinding fuera de zonas |
| **Spartan Weaponry Compat** | `[WIP]` | Soporte muy incompleto |
| **Courier (`CourierJob`)** | `[En diseño]` | **Desactivado** en `v1.0.0` (sin mecánica activa) |
[/ES]

[EN]
# Automata v1.0.0 — Overview

**Automata** implements autonomous player-like agents for **Minecraft 1.12.2** on **CleanroomMC**. Each `EntityAutomaton` operates with its own inventory, automatic equipment selection, asynchronous 3D navigation, survival evaluation, tactical combat, and squad coordination.

---

## Environment Requirements

| Component | Requirement | Notes |
| :--- | :--- | :--- |
| **Minecraft** | `1.12.2` | — |
| **Mod Loader** | CleanroomMC `0.6.X` / `0.7.X` | Compiled to Java 21 bytecode (`major 65`) |
| **Java** | `21+` | Compatible with Java 21 (`0.6.X`) and Java 25 (`0.7.X`) |
| **Required Dependency** | `x4ui` **`r1.0b6`** | `required-after:x4ui@[r1.0b6]` |

### Optional Integrations
- **Hwyla / Waila:** Displays status, active job, and squad channel when looking at an automaton.
- **HEI / JEI:** Recipe lookup (including `Comida con alas`).
- **Scape and Run: Parasites (SRP):** COTH infection immunity for both living and `downed` automata.
- **Spartan Weaponry `[WIP]`:** Incomplete experimental integration for throwing weapons, crossbows, and reach.

---

## Feature Status Matrix (`v1.0.0`)

| System / Job | Status | Summary |
| :--- | :--- | :--- |
| **Defend / CrazyDefend / Roam** | Stable | Melee/parabolic bow combat, zone patrol, and chunk loading |
| **Excavation / Idle** | Stable | `Pos1`–`Pos2` box clearing and follow/hold behavior |
| **Squads (`SquadBlackboard`)** | Stable | Block reservation, combat turns, `downed` rescue, and `0.5` m separation |
| **AutomaStaff & X4UI** | Stable | 4-mode HUD, `Pos1`–`Pos2` selection, chest binding, and X4UI panels |
| **Comida con alas** | Stable | Sword (`9` dmg / `1.6` spd / `3200` dur.) and safe dismissal |
| **3D Pathfinding & Swimming** | Stable | Async FastUtil A\*, 1–4 block parkour, vertical swim-up, and shore exit |
| **MSPT Throttling** | Stable | Automatic scaling of non-critical intervals under modpack load |
| **Mine (`MinerJob`)** | `[WIP]` | Nearby exposed ore vein mining; subject to change |
| **Lumberjack (`LumberjackJob`)** | `[WIP]` | Tree felling and spiral sapling replanting; subject to change |
| **Farmer (`FarmerJob`)** | `[WIP]` | Row-aligned tilling and interleaved planting; subject to change |
| **Pillar / Bridge / Break-through** | `[WIP]` | Terrain modification during pathfinding outside work zones |
| **Spartan Weaponry Compat** | `[WIP]` | Very incomplete support |
| **Courier (`CourierJob`)** | `[In Design]` | **Disabled** in `v1.0.0` (no active mechanic) |
[/EN]
