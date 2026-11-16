---
title: "API y Rendimiento"
project: "Automata"
category: "Técnico"
categoryOrder: 2
order: 1
---

[ES]
# API para Addons y Arquitectura de Rendimiento

## `AutomataAPI` (Addons)
Los mods externos pueden registrar trabajos propios escuchando `AutomataJobRegisterEvent` y registrando un `JobDescriptor` mediante `AutomataAPI`, usando la interfaz pública `IAutomatonContext` sin acoplarse a internos del mod.

## Arquitectura de rendimiento (`50+` autómatas / `20+` squads)
- **`WorldCacheManager`:** Almacena secciones 16×16×16 en `Long2ObjectOpenHashMap` y `Long2ObjectLinkedOpenHashMap` (FastUtil) sin boxing de `Long`.
- **`AutomataConfig`:** Caché de blacklist de bloques indexado por instancia `Block` (`ConcurrentHashMap`) y `ResourceLocation`, evitando conversiones `toString()`.
- **`SquadRegistry`:** Claves estructurales `BoardKey` sin concatenación de `String`, caché local por contexto y evicción de boards inactivos.
- **`BudgetedTickScheduler`:** Distribución de fase por `entityId` + escalado dinámico por MSPT del servidor.
[/ES]

[EN]
# Addon API & Performance Architecture

## `AutomataAPI` (Addons)
External mods can register custom jobs by listening to `AutomataJobRegisterEvent` and registering a `JobDescriptor` through `AutomataAPI`, interacting via the public `IAutomatonContext` interface.

## Performance Architecture (`50+` Automata / `20+` Squads)
- **`WorldCacheManager`:** Stores 16×16×16 sections in FastUtil `Long2ObjectOpenHashMap` and `Long2ObjectLinkedOpenHashMap` with zero `Long` boxing.
- **`AutomataConfig`:** Identity-backed `ConcurrentHashMap<Block, Boolean>` and `ResourceLocation` blacklist caches avoiding per-block `toString()` calls.
- **`SquadRegistry`:** Structural `BoardKey` keys with zero `String` concatenation, per-context board caching, and idle board eviction.
- **`BudgetedTickScheduler`:** Entity-ID phase spreading plus dynamic MSPT scaling.
[/EN]

