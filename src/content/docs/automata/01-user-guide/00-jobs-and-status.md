---
title: "Trabajos y Mecánicas [WIP]"
project: "Automata"
category: "Guía de Usuario"
categoryOrder: 1
order: 0
---

[ES]
# Trabajos y Estado de Mecánicas

## Trabajos Estables

### `Defend` (`automata:defend`)
- Protege al dueño o la posición asignada.
- Selecciona automáticamente arma cuerpo a cuerpo, escudo en mano secundaria o arco según el perfil del equipo y la distancia al objetivo.
- En combate a distancia calcula tiro parabólico con compensación de gravedad, arrastre y velocidad del objetivo, verificando línea de tiro libre de aliados.

### `Crazy Defend` (`automata:crazy_defend`)
- Variante ofensiva de `Defend` con persecución agresiva y fuego concentrado sobre amenazas dentro del radio de combate.

### `Roam` (`automata:roam`)
- Patrulla dentro de la zona marcada (`Pos1`–`Pos2`), mantiene sus chunks cargados y combate automáticamente a cualquier enemigo que entre en el área.

### `Excavation` (`automata:excavation`)
- Excava el volumen delimitado por `Pos1`–`Pos2` de arriba hacia abajo. Al finalizar ejecuta el comportamiento configurado (`Follow Owner`, `Stay Put` o `Return & Stay`).

### `Idle / Follow` (`automata:idle`)
- Mantiene la posición o sigue al dueño a distancia segura según el `TaskCompletionBehavior` activo.

---

## Mecánicas `[WIP]` (En Desarrollo)

> Las siguientes funciones están presentes como implementaciones tempranas. Pueden presentar comportamientos incompletos o cambios en futuras versiones.

- **`Mine` (`MinerJob`) `[WIP]`:** Detecta y mina vetas de mineral expuestas cercanas (incluyendo minerales de mods registrados en `ModdedOreCatalog`). Ignora cajas `Pos1`–`Pos2` y sigue al dueño.
- **`Lumberjack` (`LumberjackJob`) `[WIP]`:** Tala troncos dentro de la zona y replanta brotes en patrón espiral.
- **`Farmer` (`FarmerJob`) `[WIP]`:** Ara tierra alineada por filas, siembra semillas intercaladas y cosecha cultivos maduros.
- **`Pillar / Bridge` `[WIP]`:** Colocación de bloques bajo los pies para subir y puentes con `sneak` en bordes durante el pathfinding (`allowTerrainModificationInPathing`).
- **`Break-through` `[WIP]`:** Rotura de bloques obstáculo fuera de zonas de trabajo cuando no existe ruta libre.
- **Compatibilidad `Spartan Weaponry` `[WIP]`:** Soporte muy incompleto para alcance extendido, ballestas y armas arrojadizas.

---

## En Diseño (Desactivado en `v1.0.0`)

- **`Courier` (`CourierJob`) `[En diseño]`:** **No tiene mecánica activa en `v1.0.0`.** El trabajo permanece registrado como marcador en la interfaz mientras se diseña su sistema definitivo de transporte entre cofres.
[/ES]

[EN]
# Jobs & Feature Status

## Stable Jobs

### `Defend` (`automata:defend`)
- Guards its owner or assigned post.
- Automatically selects melee weapons, offhand shields, or bows based on equipment profile and target distance.
- Ranged combat computes parabolic bow trajectories with gravity, drag, and target lead compensation, checking line-of-fire for allies.

### `Crazy Defend` (`automata:crazy_defend`)
- Offensive variant of `Defend` featuring aggressive pursuit and focused fire on threats.

### `Roam` (`automata:roam`)
- Patrols the assigned `Pos1`–`Pos2` zone, keeps its chunks loaded, and engages hostiles entering the perimeter.

### `Excavation` (`automata:excavation`)
- Clears the `Pos1`–`Pos2` volume top-to-bottom. Upon completion, runs the configured `TaskCompletionBehavior` (`Follow Owner`, `Stay Put`, or `Return & Stay`).

### `Idle / Follow` (`automata:idle`)
- Holds position or follows its owner depending on the active `TaskCompletionBehavior`.

---

## `[WIP]` Mechanics (In Development)

> The following features are included as early implementations and may be incomplete or change in future releases.

- **`Mine` (`MinerJob`) `[WIP]`:** Detects and mines nearby exposed ore veins (including modded ores in `ModdedOreCatalog`). Ignores `Pos1`–`Pos2` bounds and prefers following its owner.
- **`Lumberjack` (`LumberjackJob`) `[WIP]`:** Fells trees and replants saplings in a spiral pattern.
- **`Farmer` (`FarmerJob`) `[WIP]`:** Row-aligned tilling, interleaved seed planting, and mature crop harvesting.
- **`Pillar / Bridge` `[WIP]`:** Pillar-up scaffolding and sneak-bridging across gaps during pathfinding (`allowTerrainModificationInPathing`).
- **`Break-through` `[WIP]`:** Breaking blocking terrain outside work zones when no clear path exists.
- **`Spartan Weaponry` Compatibility `[WIP]`:** Very incomplete experimental support for reach, crossbows, and throwing weapons.

---

## In Design (Disabled in `v1.0.0`)

- **`Courier` (`CourierJob`) `[In Design]`:** **No active mechanic in `v1.0.0`.** Remains registered as a UI placeholder while its chest-to-chest logistics design is finalized.
[/EN]

