---
title: "Mecánicas Técnicas y Configuración"
project: "LethalWeaponry"
category: "Sistemas"
categoryOrder: 2
---

[ES]
# Especificaciones Técnicas y Fórmulas

Detalle de ecuaciones, modificadores de atributos, físicas de impacto y estructura de red de **LethalWeaponry**.

---

## 1. Mecánica de Sangrado (Bleeding)

Se calcula en las entidades usando la Capability `IBleedingCapability`. El nivel del stack de sangrado ($L$) altera tres variables: daño por tick, duración y el intervalo entre ticks.

### Ecuación de Daño por Tick
$$\text{Daño} = \text{damagePerLevel} \times \left(0.5 + 0.25 \times (L - 1)\right)$$

### Duración y Decaimiento
Cuando `ticksUntilDecay` llega a cero, $L$ se reduce en 1 y se reinicia el temporizador:
$$\text{ticksUntilDecay} = \text{baseDuration} \times \max\left(0.4, \; 2.0 - (L - 1) \times 0.3\right)$$

### Intervalo entre Ticks de Daño
Controla la frecuencia con la que se aplica el daño del sangrado:
$$\text{ticksUntilDamage} = \max\left(5, \; \text{configTickInterval} \times \text{multiplier}\right)$$

Donde el multiplicador depende de:
*   **Nivel 1:** $\times 4.0$
*   **Nivel 2:** $\times 2.5$
*   **Nivel 3:** $\times 1.5$
*   **Nivel 4:** $\times 1.0$
*   **Nivel 5+:** $\max\left(0.5, \; 1.0 - (L - 4) \times 0.1\right)$ (mínimo $\times 0.5$ a nivel 9)

---

## 2. Mecánica de Aturdimiento (Stun)

Aplicado bajo la poción `lethalweaponry:stun`.

### Física e IA en Servidor
*   **Atributo:** Modificador en `SharedMonsterAttributes.MOVEMENT_SPEED` de $-100\%$ (Valor: `-1.0D`, Operación: `2`).
*   **Movimiento:** En `LivingUpdateEvent`, anula los vectores de movimiento:
    *   `motionX = 0.0D`, `motionZ = 0.0D`
    *   `motionY = \min(motionY, 0.0D)` (permite caídas de gravedad, anula saltos)
*   **IA de Mobs:** Ejecuta `living.getNavigator().clearPath()` y `living.setAttackTarget(null)`.
*   **Ángulos:** Los ángulos de rotación (`rotationYaw`, `rotationPitch`, etc.) se registran en el NBT y se fuerzan constantemente para evitar desincronización de red.

### Override de Ratón en Cliente
*   `StunMouseHelper` intercepta `mouseXYChange()` para forzar los deltas del ratón a `deltaX = 0` y `deltaY = 0` mientras el aturdimiento esté activo.

---

## 3. Mecánica de Pacto de Sangre (BloodPact)

Registrado en el jugador bajo la Capability `IBloodPactCapability`.

### Modificadores de Atributos según Locura ($M$, 0 a 100)
*   **Velocidad de Movimiento:** $\text{Bufo} = \left(\frac{M}{100.0}\right) \times 0.20$ (Operación: `2`, hasta $+20\%$).
*   **Velocidad de Ataque:** $\text{Bufo} = \left(\frac{M}{100.0}\right) \times 0.50$ (Operación: `2`, hasta $+50\%$).
*   **Rango de Ataque:** $+1.0D$ constante (Operación: `0`).

### Física del Campo de Sangre
*   **Atracción (Objetivos Pactados):**
    $$\Delta v = \text{attractionForce} \times \text{Normalize}(\vec{pos}_{\text{jugador}} - \vec{pos}_{\text{mob}})$$
*   **Repulsión (Enemigos no Pactados dentro del radio $R$):**
    $$\text{fuerza} = \left(\frac{R - \text{dist}}{R}\right) \times \text{repulsionForce}$$
    $$\Delta v_x = \text{fuerza} \times \frac{dx}{\text{dist}}, \quad \Delta v_z = \text{fuerza} \times \frac{dz}{\text{dist}}, \quad v_y = \max(v_y, 0.08D)$$

### Explosión Sanguínea (Burst)
$$\text{Daño Burst} = \frac{\text{accumulatedDamage}}{3.0}$$

---

## 4. Scythe Slash (Onda de Corte)

Proyectil físico (`EntityHitSlash`) generado por la **Scythe** y la **Katana** al atacar con enfriamiento máximo (`>= 0.9F`).

### Detección de Colisiones y Efectos
*   Crea una caja de colisión (`AxisAlignedBB`) frontal que escanea entidades vivas. Aplica daño completo equivalente al daño base del arma portadora.
*   Si el arma generadora es una Katana (`isKatana`), inyecta Sangrado a los objetivos procesados.

### Destrucción de Entorno
Escanea todos los bloques dentro del área de efecto de la onda. Si encuentra bloques frágiles (enredaderas, plantas, telarañas) o bloques con dureza equivalente a `0.0F` (instantánea), los destruye automáticamente.

---

## 5. Orbes de Esencia y E-Dash (Scythe)

### Orbes de Esencia (`EntityEssenceOrb`)
Generados en `onLivingDeath` de un objetivo asesinado con la Scythe. Son atraídos hacia el jugador a un radio de 8 bloques, otorgando esencia.

### E-Dash y Ejecución
Impulso direccional `motion = look * 2.0`. Otorga invulnerabilidad absoluta (`ICombatStateCapability`) por una cantidad de ticks configurable según el material.
Si $\text{saludActual} / \text{saludMax} \le \text{executeThreshold}$, aplica daño absoluto ignorando armaduras:
$$\text{Daño Ejecución} = \text{saludMax} \times 10.0$$
De lo contrario, aplica $\text{baseDamage} \times \text{eDashDamageMultiplier}$ e inyecta Sangrado.

---

## 6. Mecánica Chain Blade — Físicas 3D y Jump Hit

### Auto-Aim (Homing)
El proyectil ajusta su vector de dirección en tiempo real hacia el objetivo más centrado en la mira:
$$\vec{d}_{\text{nuevo}} = \text{Normalize}\left(\vec{d}_{\text{actual}} \times (1 - \alpha) + \vec{d}_{\text{target}} \times \alpha\right) \times |\vec{v}_{\text{actual}}|$$
Donde $\alpha = 0.40$ (fuerza de corrección homing).

### Alcance y Retorno
El proyectil retorna automáticamente si:
$$\text{distancia}^2(\text{jugador}, \text{proyectil}) \ge \text{reach}^2$$

### Jump Hit Physics
Al conectar el proyectil principal en un mob:
*   **Impulso del Jugador (Salto de 5 bloques):**
    $$v_y = \sqrt{0.16 \times (1.25 + \text{jumpHeightBonus})}$$
*   **Tracción Descendente del Mob:**
    $$\vec{v}_{\text{mob}} = \text{Normalize}(\vec{pos}_{\text{jugador}} - \vec{pos}_{\text{mob}}) \times 2.0, \quad v_{y,\text{mob}} = -1.5D$$
*   **Daño y Stun:** $\text{Daño} = \text{baseDamage} \times \text{damageMultiplier}$, Stun aplicado tras 20 ticks.

---

## 7. Lethal Forge — Geometría y RayTracing Dinámico

*   **Colisiones:** En el inicio (`static`), se parsean todas las cajas `from`/`to` del JSON `lethal_forge.json` escaladas a coordenadas `[0.0, 1.0]`.
*   **RayTrace:** `collisionRayTrace` itera cada `AxisAlignedBB` individual para devolver la intersección más cercana, permitiendo apuntar a través de los huecos vacíos del bloque.
[/ES]

[EN]
# Technical Specifications and Formulas

Detailed equations, attribute modifiers, impact physics, and network structure for **LethalWeaponry**.

---

## 1. Bleeding Mechanic

Calculated on entities using the `IBleedingCapability` Capability. The bleeding stack level ($L$) alters three variables: damage per tick, duration, and the interval between ticks.

### Damage Per Tick Equation
$$\text{Damage} = \text{damagePerLevel} \times \left(0.5 + 0.25 \times (L - 1)\right)$$

### Duration and Decay
When `ticksUntilDecay` reaches zero, $L$ is reduced by 1 and the timer resets:
$$\text{ticksUntilDecay} = \text{baseDuration} \times \max\left(0.4, \; 2.0 - (L - 1) \times 0.3\right)$$

### Damage Tick Interval
Controls how frequently bleeding damage is applied:
$$\text{ticksUntilDamage} = \max\left(5, \; \text{configTickInterval} \times \text{multiplier}\right)$$

Where the multiplier depends on:
*   **Level 1:** $\times 4.0$
*   **Level 2:** $\times 2.5$
*   **Level 3:** $\times 1.5$
*   **Level 4:** $\times 1.0$
*   **Level 5+:** $\max\left(0.5, \; 1.0 - (L - 4) \times 0.1\right)$ (minimum $\times 0.5$ at level 9)

---

## 2. Stun Mechanic

Applied under the `lethalweaponry:stun` potion effect.

### Server Physics and AI
*   **Attribute:** Modifies `SharedMonsterAttributes.MOVEMENT_SPEED` by $-100\%$ (Value: `-1.0D`, Operation: `2`).
*   **Movement:** In `LivingUpdateEvent`, nullifies movement vectors:
    *   `motionX = 0.0D`, `motionZ = 0.0D`
    *   `motionY = \min(motionY, 0.0D)` (allows gravity falls, nullifies jumping)
*   **Mob AI:** Executes `living.getNavigator().clearPath()` and `living.setAttackTarget(null)`.
*   **Angles:** Rotation angles (`rotationYaw`, `rotationPitch`, etc.) are registered in NBT and constantly forced to prevent network desync.

### Client Mouse Override
*   `StunMouseHelper` intercepts `mouseXYChange()` to force mouse deltas to `deltaX = 0` and `deltaY = 0` while stun is active.

---

## 3. BloodPact Mechanic

Registered on the player under the `IBloodPactCapability` Capability.

### Attribute Modifiers based on Madness ($M$, 0 to 100)
*   **Movement Speed:** $\text{Buff} = \left(\frac{M}{100.0}\right) \times 0.20$ (Operation: `2`, up to $+20\%$).
*   **Attack Speed:** $\text{Buff} = \left(\frac{M}{100.0}\right) \times 0.50$ (Operation: `2`, up to $+50\%$).
*   **Attack Range:** $+1.0D$ constant (Operation: `0`).

### Blood Field Physics
*   **Attraction (Pact Targets):**
    $$\Delta v = \text{attractionForce} \times \text{Normalize}(\vec{pos}_{\text{player}} - \vec{pos}_{\text{mob}})$$
*   **Repulsion (Non-Pact Enemies within radius $R$):**
    $$\text{force} = \left(\frac{R - \text{dist}}{R}\right) \times \text{repulsionForce}$$
    $$\Delta v_x = \text{force} \times \frac{dx}{\text{dist}}, \quad \Delta v_z = \text{force} \times \frac{dz}{\text{dist}}, \quad v_y = \max(v_y, 0.08D)$$

### Blood Burst
$$\text{Burst Damage} = \frac{\text{accumulatedDamage}}{3.0}$$

---

## 4. Scythe Slash (Wave Attack)

Physical projectile (`EntityHitSlash`) generated by the **Scythe** and **Katana** when attacking at maximum cooldown (`>= 0.9F`).

### Collision Detection and Effects
*   Creates a frontal collision box (`AxisAlignedBB`) that scans for living entities. Applies full damage equivalent to the base damage of the carrying weapon.
*   If the generating weapon is a Katana (`isKatana`), injects Bleeding to the processed targets.

### Environmental Destruction
Scans all blocks within the wave's area of effect. If it finds fragile blocks (vines, plants, cobwebs) or blocks with a hardness equivalent to `0.0F` (instant), it destroys them automatically.

---

## 5. Essence Orbs & E-Dash (Scythe)

### Essence Orbs (`EntityEssenceOrb`)
Generated on `onLivingDeath` of a target killed with the Scythe. Attracted towards the player within an 8-block radius, granting essence.

### E-Dash and Execution
Directional impulse `motion = look * 2.0`. Grants true invulnerability (`ICombatStateCapability`) for a material-configurable amount of ticks.
If $\text{currentHealth} / \text{maxHealth} \le \text{executeThreshold}$, applies absolute damage ignoring armor:
$$\text{Execution Damage} = \text{maxHealth} \times 10.0$$
Otherwise, applies $\text{baseDamage} \times \text{eDashDamageMultiplier}$ and injects Bleeding.

---

## 6. Chain Blade Mechanic — 3D Physics and Jump Hit

### Auto-Aim (Homing)
The projectile adjusts its direction vector in real time towards the most centered target in the crosshair:
$$\vec{d}_{\text{new}} = \text{Normalize}\left(\vec{d}_{\text{current}} \times (1 - \alpha) + \vec{d}_{\text{target}} \times \alpha\right) \times |\vec{v}_{\text{current}}|$$
Where $\alpha = 0.40$ (homing correction strength).

### Reach and Return
The projectile automatically returns if:
$$\text{distance}^2(\text{player}, \text{projectile}) \ge \text{reach}^2$$

### Jump Hit Physics
Upon connecting the primary projectile to a mob:
*   **Player Impulse (5-block jump):**
    $$v_y = \sqrt{0.16 \times (1.25 + \text{jumpHeightBonus})}$$
*   **Mob Downward Traction:**
    $$\vec{v}_{\text{mob}} = \text{Normalize}(\vec{pos}_{\text{player}} - \vec{pos}_{\text{mob}}) \times 2.0, \quad v_{y,\text{mob}} = -1.5D$$
*   **Damage and Stun:** $\text{Damage} = \text{baseDamage} \times \text{damageMultiplier}$, Stun applied after 20 ticks.

---

## 7. Lethal Forge — Geometry and Dynamic RayTracing

*   **Collisions:** On initialization (`static`), all `from`/`to` boxes from the JSON `lethal_forge.json` are parsed and scaled to coordinates `[0.0, 1.0]`.
*   **RayTrace:** `collisionRayTrace` iterates each individual `AxisAlignedBB` to return the closest intersection, allowing pointing through the empty gaps of the block.
[/EN]
