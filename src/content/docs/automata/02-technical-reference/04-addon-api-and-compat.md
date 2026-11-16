---
title: "API para Addons y Compatibilidad"
project: "Automata"
category: "Referencia Técnica"
categoryOrder: 2
order: 4
---

[ES]
# API para Addons y Compatibilidad

## `AutomataAPI` y Registro de Trabajos
Los mods externos pueden registrar trabajos personalizados sin depender de clases internas:
1. Suscribirse a `AutomataJobRegisterEvent` en `MinecraftForge.EVENT_BUS`.
2. Registrar un `JobDescriptor` en `AutomatonJobRegistry` con identificador `ResourceLocation` único, fábrica de `IAutomatonJob` y metadatos de interfaz.
3. Implementar `IAutomatonJob` operando exclusivamente sobre `IAutomatonContext`.

### Eventos Públicos (`com.x4yi.automata.api.event`)
- `BotAttackEvent(automaton, world, target)`
- `BotBreakBlockEvent(automaton, world, pos, state)`
- `BotPickupEvent(automaton, itemEntity, stack)`
- `PathCellClassifyEvent(world, pos, state, cellType)`

---

## Integraciones
- **`SrpCompat` (Scape and Run: Parasites):** Previene la infección COTH tanto en autómatas activos como en estado `downed` mediante `enforceTickImmunity(EntityAutomaton)` y actualización segura de listas de inmunidad.
- **`HwylaAutomataPlugin` (Waila / Hwyla):** Expone información de estado, trabajo y escuadrón en el HUD de entidad.
- **`SpartanWeaponryCompat` `[WIP]`:** Lectura experimental de NBT de munición/ballesta cargada (`AmmoUsed`, `isCrossbowLoaded`) y bonificadores de alcance; soporte muy incompleto en `v1.0.0`.
[/ES]

[EN]
# Addon API & Compatibility

## `AutomataAPI` & Job Registration
External mods can register custom jobs without coupling to internal classes:
1. Subscribe to `AutomataJobRegisterEvent` on `MinecraftForge.EVENT_BUS`.
2. Register a `JobDescriptor` in `AutomatonJobRegistry` with a unique `ResourceLocation` ID, `IAutomatonJob` factory, and UI metadata.
3. Implement `IAutomatonJob` against the public `IAutomatonContext` interface.

### Public Events (`com.x4yi.automata.api.event`)
- `BotAttackEvent(automaton, world, target)`
- `BotBreakBlockEvent(automaton, world, pos, state)`
- `BotPickupEvent(automaton, itemEntity, stack)`
- `PathCellClassifyEvent(world, pos, state, cellType)`

---

## Integrations
- **`SrpCompat` (Scape and Run: Parasites):** Prevents COTH infection on both living and `downed` automata via `enforceTickImmunity(EntityAutomaton)` and safe immunity-list updates.
- **`HwylaAutomataPlugin` (Waila / Hwyla):** Exposes automaton state, active job, and squad info to the entity HUD.
- **`SpartanWeaponryCompat` `[WIP]`:** Experimental NBT checks for throwing ammo/loaded crossbows (`AmmoUsed`, `isCrossbowLoaded`) and reach bonuses; very incomplete in `v1.0.0`.
[/EN]

