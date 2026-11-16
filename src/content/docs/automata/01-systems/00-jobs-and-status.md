---
title: "Trabajos y Estado [WIP]"
project: "Automata"
category: "Sistemas"
categoryOrder: 1
order: 0
---

[ES]
# Trabajos y Estado de Mecánicas (`v1.0.0`)

## Trabajos estables
- **`Defend` (`automata:defend`):** Protege al dueño o posición asignada con combate cuerpo a cuerpo o arco parabólico (compensación de gravedad, arrastre y movimiento del objetivo).
- **`Crazy Defend` (`automata:crazy_defend`):** Persecución agresiva y fuego concentrado sobre amenazas.
- **`Roam` (`automata:roam`):** Patrulla su zona asignada, mantiene sus chunks activos y combate enemigos.
- **`Excavation` (`automata:excavation`):** Excava cajas `Pos1`–`Pos2` de arriba hacia abajo.
- **`Idle / Follow` (`automata:idle`):** Permanece en espera o sigue al dueño.

## Mecánicas `[WIP]` (en desarrollo / incompletas)
- **`Mine` (`MinerJob`) `[WIP]`:** Detección y minado de vetas expuestas cercanas.
- **`Lumberjack` (`LumberjackJob`) `[WIP]`:** Tala de árboles y replantado en espiral.
- **`Farmer` (`FarmerJob`) `[WIP]`:** Labrado por filas, siembra intercalada y cosecha.
- **`Pillar / Bridge` `[WIP]`:** Colocación de pilares y puentes con `sneak` durante el pathfinding (`allowTerrainModificationInPathing`).
- **`Break-through` `[WIP]`:** Apertura de bloques obstáculo fuera de zonas de trabajo durante el pathfinding.
- **Compatibilidad `Spartan Weaponry` `[WIP]`:** Implementación muy incompleta (soporte básico experimental).

## En diseño (desactivado en `v1.0.0`)
- **`Courier` (`CourierJob`) `[En diseño]`:** **Sin mecánica activa por ahora.** El trabajo permanece registrado como marcador mientras se diseña su sistema logístico.
[/ES]

[EN]
# Jobs & Feature Status (`v1.0.0`)

## Stable Jobs
- **`Defend` (`automata:defend`):** Guards the owner or assigned post using melee spacing or parabolic bow aiming (gravity, drag, and target lead compensation).
- **`Crazy Defend` (`automata:crazy_defend`):** Aggressive pursuit and focused fire against threats.
- **`Roam` (`automata:roam`):** Patrols an assigned zone, keeps its chunks loaded, and engages enemies.
- **`Excavation` (`automata:excavation`):** Clears `Pos1`–`Pos2` boxes top-to-bottom.
- **`Idle / Follow` (`automata:idle`):** Holds position or follows its owner.

## `[WIP]` Mechanics (In Development / Incomplete)
- **`Mine` (`MinerJob`) `[WIP]`:** Nearby exposed ore detection and vein mining.
- **`Lumberjack` (`LumberjackJob`) `[WIP]`:** Tree felling and spiral sapling replanting.
- **`Farmer` (`FarmerJob`) `[WIP]`:** Row-aligned tilling, interleaved planting, and harvesting.
- **`Pillar / Bridge` `[WIP]`:** Scaffolding pillar-up and sneak-bridging during pathfinding (`allowTerrainModificationInPathing`).
- **`Break-through` `[WIP]`:** Digging through blocking terrain outside work zones during pathfinding.
- **`Spartan Weaponry` Compatibility `[WIP]`:** Very incomplete experimental integration.

## In Design (Disabled in `v1.0.0`)
- **`Courier` (`CourierJob`) `[In Design]`:** **No active mechanic yet.** Remains registered as a placeholder while its logistics design is finalized.
[/EN]

