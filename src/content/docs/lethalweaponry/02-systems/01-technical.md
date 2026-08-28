---
title: "Mecánicas Técnicas y Configuración"
project: "LethalWeaponry"
category: "Sistemas"
categoryOrder: 2
---

[ES]
## Especificaciones Técnicas y Fórmulas

Detalle de ecuaciones, modificadores de atributos, físicas de impacto y estructura de red de **LethalWeaponry**.

### 1. Mecánica de Sangrado (Bleeding)
Se calcula en las entidades usando la Capability `IBleedingCapability`. El nivel del stack de sangrado ($L$) altera tres variables: daño por tick, duración y el intervalo entre ticks.

*   **Daño por Tick**: `Damage = damagePerLevel * (0.5 + 0.25 * (L - 1))`
*   **Duración y Decaimiento**: Cuando `ticksUntilDecay` llega a cero, $L$ se reduce en 1 y se reinicia el temporizador.
*   **Intervalo entre Ticks**: Controla la frecuencia con la que se aplica el daño del sangrado, disminuyendo a medida que el nivel $L$ aumenta.

### 2. Mecánica de Aturdimiento (Stun)
Aplicado bajo la poción `lethalweaponry:stun`.

*   **IA de Mobs**: Ejecuta `living.getNavigator().clearPath()` y `living.setAttackTarget(null)`. Pierden la capacidad de moverse.
*   **Override de Ratón en Cliente**: `StunMouseHelper` intercepta el input del jugador para bloquear la rotación de la cámara.

### 3. Mecánica de Pacto de Sangre (BloodPact)
Registrado en el jugador bajo la Capability `IBloodPactCapability`.
Otorga bufos proporcionales al nivel de **Locura (Madness)** (0 a 100):
*   **Velocidad de Movimiento:** Hasta +20%.
*   **Velocidad de Ataque:** Hasta +50%.

### 4. Orbes de Esencia y E-Dash (Scythe)
Generados al matar entidades (`EntityEssenceOrb`).
*   **E-Dash (Ejecución):** Impulso direccional. Si `saludActual / saludMax <= executeThreshold`, aplica daño absoluto ignorando armaduras.

### 5. Mecánica Chain Blade — Físicas 3D
*   **Auto-Aim (Homing):** El proyectil ajusta su vector de dirección en tiempo real hacia el objetivo más centrado en la mira.
*   **Alcance y Retorno:** El proyectil retorna automáticamente si la distancia supera la propiedad `reach` de su material.

---

## Referencia de Configuración

Los archivos de configuración se encuentran en `config/lethalweaponry/` y se pueden editar a través de la interfaz gráfica in-game del mod.

| Archivo | Ámbito | Propósito |
| --- | --- | --- |
| `items.json` | Balance | Estadísticas de armas (daño, velocidad, durabilidad) y valores base de habilidades. |
| `server.json` | Servidor | Toggles de mecánicas y multiplicadores globales. |
| `client.json` | Cliente | Partículas, idioma y advertencias de la interfaz. |
| `enchants.json` | Balance | Configuraciones de encantamientos exclusivos (daño, probabilidad, curación). |
| `hud.json` | Cliente | Posición dinámica de los elementos del HUD guardados por el Editor visual. |

La sincronización entre cliente y servidor es automática e imperceptible.
[/ES]

[EN]
## Technical Mechanics & Formulas

Detail of equations, attribute modifiers, impact physics, and network structure of **LethalWeaponry**.

### 1. Bleeding Mechanic
Calculated on entities using the `IBleedingCapability`. The bleeding stack level ($L$) alters three variables: damage per tick, duration, and tick interval.

*   **Damage per Tick**: `Damage = damagePerLevel * (0.5 + 0.25 * (L - 1))`
*   **Duration and Decay**: When `ticksUntilDecay` reaches zero, $L$ is reduced by 1 and the timer resets.
*   **Tick Interval**: Controls the frequency of the bleeding damage, decreasing as the level $L$ increases.

### 2. Stun Mechanic
Applied under the `lethalweaponry:stun` potion.

*   **Mob AI**: Executes `living.getNavigator().clearPath()` and `living.setAttackTarget(null)`. They lose the ability to move.
*   **Client Mouse Override**: `StunMouseHelper` intercepts player input to lock camera rotation.

### 3. BloodPact Mechanic
Registered on the player under the `IBloodPactCapability`.
Grants buffs proportional to the **Madness** level (0 to 100):
*   **Movement Speed:** Up to +20%.
*   **Attack Speed:** Up to +50%.

### 4. Essence Orbs and E-Dash (Scythe)
Generated upon killing entities (`EntityEssenceOrb`).
*   **E-Dash (Execution):** Directional impulse. If `currentHealth / maxHealth <= executeThreshold`, applies absolute damage ignoring armor.

### 5. Chain Blade Mechanic — 3D Physics
*   **Auto-Aim (Homing):** The projectile adjusts its direction vector in real time toward the target closest to the crosshair.
*   **Reach and Return:** The projectile automatically returns if the distance exceeds its material's `reach` property.

---

## Configuration Reference

Configuration files are located in `config/lethalweaponry/` and can be edited via the in-game graphical interface.

| File | Scope | Purpose |
| --- | --- | --- |
| `items.json` | Balance | Weapon statistics (damage, speed, durability) and base skill values. |
| `server.json` | Server | Mechanic toggles and global multipliers. |
| `client.json` | Client | Particles, language, and interface warnings. |
| `enchants.json` | Balance | Exclusive enchantment configurations (damage, chance, healing). |
| `hud.json` | Client | Dynamic position of HUD elements saved by the Visual Editor. |

Client-server synchronization is automatic and seamless.
[/EN]
