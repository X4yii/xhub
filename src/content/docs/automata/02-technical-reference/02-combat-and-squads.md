---
title: "Combate, Balística y Escuadrones"
project: "Automata"
category: "Referencia Técnica"
categoryOrder: 2
order: 2
---

[ES]
# Combate, Balística y Coordinación de Escuadrón

## Combate Melee y Rango
- **`WeaponCombatProfile`:** Clasifica armas por atributos reales sin hardcodear IDs.
- **`MeleeCombatController`:** Aplica espaciado táctico (retroceso durante cooldown de ataque, avance cuando el golpe está listo) y bloqueo con escudo en mano secundaria.
- **`RangedCombatController` + `BallisticsSolver`:**
  - `computeBowAimAngles(...)` resuelve el tiempo de vuelo `t` mediante iteración de punto fijo (`reqSpeed / speed`) compensando el arrastre de flecha de Minecraft (`0.99` por tick), gravedad (`0.05` por tick) y vector de velocidad del objetivo.
  - `isBowArcClear(...)` verifica trayectoria libre de bloques y fuego amigo antes de soltar la flecha.
- **`ThreatFieldEvaluator` & `AdaptiveThreatAnalyzer`:** Evalúan campos de amenaza, detección de acorralamiento y vectores de escape.

---

## Escuadrones (`SquadRegistry`, `SquadBlackboard` y Separación Aliada)
- **`SquadRegistry`:** Indexa los tableros mediante la clave estructural inmutable `BoardKey(dimensionId, ownerUuid, channel)` (sin concatenación de `String`) y ejecuta evicción de tableros inactivos (`IDLE_EVICT_MS = 300_000`) al superar `PRUNE_THRESHOLD_BOARDS = 64`.
- **`SquadBlackboard`:** Gestiona reservas de bloques con TTL, rotación de turnos de combate y alertas de aliados `downed`.
- **Separación aliada (`0.5` bloques) y no-colisión:**
  - `EntityAutomaton.collideWithEntity` y `applyEntityCollision` omiten empujones físicos entre autómatas aliados vivos (`isAlliedWith`).
  - `AutomatonAIContext.computeAllySeparation(...)` calcula el vector de repulsión horizontal usando el snapshot ya cacheado cuando el espacio libre entre hitboxes es `< allySeparationGap` (`0.5` m).
[/ES]

[EN]
# Combat, Ballistics & Squad Coordination

## Melee & Ranged Combat
- **`WeaponCombatProfile`:** Classifies weapons by actual item stats without hardcoded IDs.
- **`MeleeCombatController`:** Applies cooldown-aware spacing (retreats during attack cooldown, closes in when ready) and offhand shield blocking.
- **`RangedCombatController` + `BallisticsSolver`:**
  - `computeBowAimAngles(...)` solves flight time `t` via fixed-point iteration (`reqSpeed / speed`) compensating Minecraft's per-tick arrow drag (`0.99`), gravity (`0.05`), and target velocity lead.
  - `isBowArcClear(...)` checks block clearance and friendly line-of-fire before releasing shots.
- **`ThreatFieldEvaluator` & `AdaptiveThreatAnalyzer`:** Evaluates local threat fields, cornered detection, and escape vectors.

---

## Squads (`SquadRegistry`, `SquadBlackboard` & Ally Separation)
- **`SquadRegistry`:** Indexes boards with an immutable structural `BoardKey(dimensionId, ownerUuid, channel)` (zero `String` concatenation) and evicts idle boards (`IDLE_EVICT_MS = 300_000`) once `PRUNE_THRESHOLD_BOARDS = 64` is reached.
- **`SquadBlackboard`:** Manages TTL-backed block reservations, combat turn rotation, and `downed` ally alerts.
- **Ally Separation (`0.5` blocks) & No Allied Pushing:**
  - `EntityAutomaton.collideWithEntity` and `applyEntityCollision` skip physical pushing between living allied automata (`isAlliedWith`).
  - `AutomatonAIContext.computeAllySeparation(...)` computes horizontal repulsion from the already-cached entity snapshot whenever free hitbox gap `< allySeparationGap` (`0.5` m).
[/EN]

