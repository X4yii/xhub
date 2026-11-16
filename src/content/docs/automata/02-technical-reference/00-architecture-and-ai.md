---
title: "Arquitectura e IA"
project: "Automata"
category: "Referencia Técnica"
categoryOrder: 2
order: 0
---

[ES]
# Arquitectura, `AutomatonBrain` y Supervivencia

## Ciclo de Tick (`EntityAutomaton` + `AutomatonBrain`)
1. `EntityAutomaton.onLivingUpdate()` actualiza nado (`swimAnimation`), inmunidad SRP (`SrpCompat.enforceTickImmunity`), recogida de ítems escalonada por `BudgetedTickScheduler` (`base = 4` ticks), hambre/curación y carga de chunks (`AutomatonChunkLoader`).
2. `AutomatonBrain.tick()`:
   - Evalúa disponibilidad del dueño (`OwnerAvailability`).
   - Hace polling de rutas asíncronas pendientes (`context.pollPendingPath()`).
   - Ejecuta limpieza periódica del `SquadBlackboard` (`BLACKBOARD_PRUNE_INTERVAL = 100`) y gestión de inventario (`INVENTORY_MANAGE_INTERVAL_TICKS = 20`), ambos escalados por MSPT.
   - Ejecuta rescates de 20 Hz (`TacticalUtilityController.tryEmergencyPearlRescue`, `tryDrinkConsumable`, `SurvivalEvaluator.tickVoidRescue20Hz`, `tickLavaEscape20Hz`).
   - Evalúa `UtilityBrainArbiter` cada `2–3` ticks (o `0` si hay peligro inmediato).

---

## `UtilityBrainArbiter` y Supervivencia
- `UtilityBrainArbiter.selectBestBehavior(UtilityState, BrainBehavior)` arbitra entre `SURVIVAL`, `REVIVE_ALLY`, `SELF_DEFENSE`, `LOOT`, `LOGISTICS` y `ACTIVE_JOB` aplicando histéresis de compromiso y backoff ante fallos (`OVERRIDE_FAILURE_THRESHOLD = 3`, `OVERRIDE_BACKOFF_TICKS = 60`).
- `SurvivalEvaluator` detecta lava, fuego, explosivos (`ExplosiveHazardDetector`: Creepers, TNT, consumibles de curación/cura de mods) y aliados `downed` reutilizando `ctx.getNearbyLivingEntities(...)` sin consultas duplicadas al mundo.
- `AutomatonAIContext` cachea snapshots de entidades vivas por tick y radio, además de la referencia local a `SquadBlackboard`.
[/ES]

[EN]
# Architecture, `AutomatonBrain` & Survival

## Tick Lifecycle (`EntityAutomaton` + `AutomatonBrain`)
1. `EntityAutomaton.onLivingUpdate()` steps swim animation, enforces SRP immunity (`SrpCompat.enforceTickImmunity`), runs phase-budgeted item pickup (`BudgetedTickScheduler`, `base = 4` ticks), ticks hunger/healing, and updates `AutomatonChunkLoader`.
2. `AutomatonBrain.tick()`:
   - Checks `OwnerAvailability`.
   - Polls pending async paths (`context.pollPendingPath()`).
   - Runs MSPT-scaled `SquadBlackboard.pruneExpired(...)` (`base = 100`) and `InventoryManagerService.tickInventoryManagement(...)` (`base = 20`).
   - Executes 20 Hz emergency checks (`tryEmergencyPearlRescue`, `tryDrinkConsumable`, `tickVoidRescue20Hz`, `tickLavaEscape20Hz`).
   - Evaluates `UtilityBrainArbiter` every `2–3` ticks (or `0` on immediate hazard).

---

## `UtilityBrainArbiter` & Survival
- `UtilityBrainArbiter.selectBestBehavior(UtilityState, BrainBehavior)` arbitrates across `SURVIVAL`, `REVIVE_ALLY`, `SELF_DEFENSE`, `LOOT`, `LOGISTICS`, and `ACTIVE_JOB` using commitment hysteresis and failure backoff (`OVERRIDE_FAILURE_THRESHOLD = 3`, `OVERRIDE_BACKOFF_TICKS = 60`).
- `SurvivalEvaluator` handles lava, fire, explosives (`ExplosiveHazardDetector`), and `downed` ally revival by reusing `ctx.getNearbyLivingEntities(...)` rather than issuing redundant `getEntitiesWithinAABB` calls.
- `AutomatonAIContext` caches per-tick entity snapshots and the local `SquadBlackboard` reference.
[/EN]

