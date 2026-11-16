---
title: "Rendimiento y FakePlayerService"
project: "Automata"
category: "Referencia Técnica"
categoryOrder: 2
order: 3
---

[ES]
# Rendimiento, MSPT Throttling y `FakePlayerService`

## `BudgetedTickScheduler` (Distribución y MSPT)
- **Distribución de fase:** `shouldRun(worldTime, entityId, interval)` usa mezcla hash de `entityId` (`0x9E3779B9`) para evitar que todos los autómatas ejecuten tareas periódicas en el mismo tick.
- **Throttling adaptativo por MSPT:** `getServerMspt(MinecraftServer)` promedia `server.tickTimeArray` (cacheado por `tickCounter`) y `scaleInterval(base, mspt)` escala intervalos no críticos cuando `adaptiveTpsThrottling = true`:
  - `< 35 mspt`: `1×`
  - `35–50 mspt`: `2×`
  - `50–75 mspt`: `3×`
  - `>= 75 mspt`: `4×`

---

## Cachés en `AutomataConfig`
- `isBlockBlacklisted(Block)` utiliza `ConcurrentHashMap<Block, Boolean>` (lookup por identidad de singleton `Block`) y `isBlockIdBlacklisted(ResourceLocation)` usa `Set<ResourceLocation>`, evitando `ResourceLocation.toString()` durante el escaneo de 4096 bloques por sección.

---

## `FakePlayerService` (Seguridad en Servidor Dedicado)
- Envuelve interacciones tipo jugador (ataques, uso de ítems, consumo de comida) mediante `executeWithGuard(...)` para bloquear reentrancia y capturar excepciones.
- `consumeFoodLikePlayer(...)` sincroniza hambre y saturación usando `FoodStats.writeNBT` / `readNBT` en lugar de `FoodStats.setFoodSaturationLevel(float)` (que es `@SideOnly(Side.CLIENT)` en 1.12.2 y causaría `NoSuchMethodError` en servidor dedicado).
[/ES]

[EN]
# Performance, MSPT Throttling & `FakePlayerService`

## `BudgetedTickScheduler` (Phase Spreading & MSPT)
- **Phase Spreading:** `shouldRun(worldTime, entityId, interval)` mixes `entityId` (`0x9E3779B9`) so periodic tasks distribute evenly across ticks.
- **Adaptive MSPT Throttling:** `getServerMspt(MinecraftServer)` averages `server.tickTimeArray` (cached per `tickCounter`), and `scaleInterval(base, mspt)` scales non-critical intervals when `adaptiveTpsThrottling = true`:
  - `< 35 mspt`: `1×`
  - `35–50 mspt`: `2×`
  - `50–75 mspt`: `3×`
  - `>= 75 mspt`: `4×`

---

## `AutomataConfig` Caches
- `isBlockBlacklisted(Block)` uses a `ConcurrentHashMap<Block, Boolean>` keyed by `Block` singleton identity, while `isBlockIdBlacklisted(ResourceLocation)` uses `Set<ResourceLocation>`, eliminating `ResourceLocation.toString()` allocations during 4096-block section scans.

---

## `FakePlayerService` (Dedicated Server Safety)
- Guards player-emulated actions (attacks, item usage, food consumption) with `executeWithGuard(...)` to prevent reentrancy and isolate exceptions.
- `consumeFoodLikePlayer(...)` synchronizes hunger and saturation via `FoodStats.writeNBT` / `readNBT` instead of `FoodStats.setFoodSaturationLevel(float)` (which is `@SideOnly(Side.CLIENT)` in 1.12.2 and throws `NoSuchMethodError` on dedicated servers).
[/EN]

