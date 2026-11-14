---
title: "Referencia de Configuración"
project: "LethalWeaponry"
category: "Sistemas"
categoryOrder: 2
order: 2
---

[ES]
# Referencia de Configuración: LethalWeaponry

Los archivos de configuración JSON se encuentran en:

```text
config/lethalweaponry/
```

También pueden editarse en tiempo real dentro del juego usando el menú de configuración construido sobre **X4UI** (con buscador instantáneo y sincronización automática servidor-cliente).

---

## Archivos de Configuración

| Archivo | Ámbito | Propósito |
| :--- | :--- | :--- |
| `items.json` | Balance | Estadísticas de armas (daño, velocidad, durabilidad) y valores base de habilidades. |
| `server.json` | Servidor | Toggles de mecánicas y multiplicadores globales. |
| `client.json` | Cliente | Partículas, idioma y advertencias de la interfaz. |
| `enchants.json` | Balance | Configuraciones de encantamientos exclusivos (daño, probabilidad, curación). |
| `hud.json` | Cliente | Posición dinámica de los elementos del HUD guardados por el Editor visual. |
| `compat.json` | Compatibilidad | Soporte dinámico para variantes y forks de *BetterCombat* (añadido en `r1.0b10`). |

---

## `items.json`

Contiene las propiedades de cada material (`WOOD`, `STONE`, `IRON`, `GOLD`, `DIAMOND`) organizadas por arma.

### Propiedades Comunes Base
*   **`baseDamage`** *(float)*: Daño base de ataque.
*   **`attackSpeed`** *(float)*: Velocidad de ataque.
*   **`durability`** *(int)*: Durabilidad máxima.
*   **`skillCooldownSeconds`** *(float)*: Cooldown principal en segundos.

### Propiedades Específicas
Las armas tienen subcategorías específicas (ej. `warhammer.abilities`, `katana.bleeding`, `scythe.scythe`, `chainblade.chainblade`) que controlan duración de efectos, radios de ataque, límites de esencia (`maxEssence`, `essencePerKill`, `essencePerHit`), fuerza de tracción y daño escalable de cada habilidad.

---

## `enchants.json`

Controla el balance numérico de los cuatro encantamientos del mod:

*   **`devolutionChance`** *(float)*: Probabilidad (`0.0` a `1.0`) de restar puntos de adaptación pasivamente.
*   **`devolutionPointsL1/L2/L3/L4`** *(int)*: Puntos de adaptación deducidos por nivel.
*   **`hemophiliaDamagePercent`** *(float)*: Porcentaje de vida máxima infligida como daño adicional por sangrado.
*   **`hemophiliaBossModifier`** *(float)*: Limitador de daño para entidades jefes.
*   **`soulHarvestChanceL1/L2/L3`** *(float)*: Probabilidad de generación de orbes curativos por nivel.
*   **`soulHarvestMinHeal` / `soulHarvestMaxHeal`** *(float)*: Porcentaje mínimo y máximo de curación.
*   **`severanceDuration`** *(float)*: Tiempo en segundos de la reducción de armadura (escala en niveles I-III).

---

## `server.json`

Opciones lógicas y multiplicadores del servidor.

### `warhammer`
*   **`stunDurationMultiplier`** *(float, defecto: 1.0)*: Multiplicador de duración del aturdimiento.
*   **`enableAOE`** / **`enableStun`** *(boolean)*: Toggles de mecánicas principales.

### `katana`
*   **`bleedingDamageMultiplier`** / **`bleedingDurationMultiplier`** *(float)*: Ajustan el sangrado.
*   **`bloodPactRangeMultiplier`** / **`bloodPactDrainMultiplier`** *(float)*: Ajustan el alcance y robo de vida.
*   **`enableBleeding`** / **`enableBloodPact`** *(boolean)*: Toggles de mecánicas.
*   **`enableSRPBypass`** *(boolean)*: Omite adaptaciones SRP si está activo.

### `chainblade`
*   **`chainBladeEnableJumpHit`** *(boolean)*: Habilita el ataque en salto doble.

---

## `client.json`

### `aoeParticles` y `combatVisuals`
Permiten deshabilitar (`false`) o modificar la cantidad y densidad (`Multiplier`, por defecto `2.0` en AOE desde `r1.0b10`) de las partículas de Ground Slam, hilos de sangre y salpicaduras para optimizar rendimiento.

### `ui`
*   **`showDevWarning`** *(boolean)*: Habilita alertas emergentes experimentales.
*   **`showGuideButton`** *(boolean)*: Muestra el botón de guía en el menú principal.
*   **`language`** *(string)*: Idioma de la interfaz gráfica del mod (`"es"` o `"en"`).

---

## `hud.json` y `compat.json`

- **`hud.json`:** Generado automáticamente al usar el **HUD Editor** dentro del juego. Almacena las coordenadas `X` e `Y` de los paneles (`cooldowns`, `crosshair_cooldowns` y `blood_pact`).
- **`compat.json`:** Define las reglas de integración dinámica con mods de combate de terceros como variantes de *BetterCombat*.
[/ES]

[EN]
# Configuration Reference: LethalWeaponry

JSON configuration files are located in:

```text
config/lethalweaponry/
```

All settings can also be edited in-game in real time through the **X4UI** configuration menu (featuring instant search and automatic server-to-client synchronization).

---

## Configuration Files

| File | Scope | Purpose |
| :--- | :--- | :--- |
| `items.json` | Balance | Weapon statistics (damage, attack speed, durability) and base skill parameters. |
| `server.json` | Server | Mechanics toggles and global multipliers. |
| `client.json` | Client | Particle limits, language, and UI alerts. |
| `enchants.json` | Balance | Exclusive enchantment configurations (damage, chances, healing caps). |
| `hud.json` | Client | Dynamic HUD element positions saved by the visual HUD Editor. |
| `compat.json` | Compatibility | Dynamic compatibility settings for *BetterCombat* variants and forks (added in `r1.0b10`). |

---

## `items.json`

Contains properties for each material tier (`WOOD`, `STONE`, `IRON`, `GOLD`, `DIAMOND`) organized by weapon.

### Common Base Properties
*   **`baseDamage`** *(float)*: Base attack damage.
*   **`attackSpeed`** *(float)*: Base attack speed.
*   **`durability`** *(int)*: Maximum durability.
*   **`skillCooldownSeconds`** *(float)*: Primary skill cooldown in seconds.

### Specific Properties
Weapons feature specific subcategories (e.g., `warhammer.abilities`, `katana.bleeding`, `scythe.scythe`, `chainblade.chainblade`) that control effect durations, attack radiuses, essence limits (`maxEssence`, `essencePerKill`, `essencePerHit`), pull forces, and scalable damage for each ability.

---

## `enchants.json`

Controls the numerical balance of the mod's four exclusive enchantments:

*   **`devolutionChance`** *(float)*: Probability (`0.0` to `1.0`) to subtract adaptation points passively.
*   **`devolutionPointsL1/L2/L3/L4`** *(int)*: Adaptation points deducted per level.
*   **`hemophiliaDamagePercent`** *(float)*: Percentage of max health dealt as bonus bleeding damage.
*   **`hemophiliaBossModifier`** *(float)*: Damage limiter applied to boss entities.
*   **`soulHarvestChanceL1/L2/L3`** *(float)*: Healing orb spawn probability per level.
*   **`soulHarvestMinHeal` / `soulHarvestMaxHeal`** *(float)*: Minimum and maximum healing percentage limits.
*   **`severanceDuration`** *(float)*: Duration in seconds for the armor reduction effect (scales across Levels I–III).

---

## `server.json`

Server-side logical toggles and multipliers.

### `warhammer`
*   **`stunDurationMultiplier`** *(float, default: 1.0)*: Stun duration multiplier.
*   **`enableAOE`** / **`enableStun`** *(boolean)*: Core mechanics toggles.

### `katana`
*   **`bleedingDamageMultiplier`** / **`bleedingDurationMultiplier`** *(float)*: Adjusts bleed impact.
*   **`bloodPactRangeMultiplier`** / **`bloodPactDrainMultiplier`** *(float)*: Adjusts tether range and lifesteal.
*   **`enableBleeding`** / **`enableBloodPact`** *(boolean)*: Mechanics toggles.
*   **`enableSRPBypass`** *(boolean)*: Bypasses Scape and Run Parasite adaptations if enabled.

### `chainblade`
*   **`chainBladeEnableJumpHit`** *(boolean)*: Enables the dual jump attack.

---

## `client.json`

### `aoeParticles` and `combatVisuals`
Allows disabling (`false`) or modifying the quantity and density (`Multiplier`, defaulting to `2.0` for AoE since `r1.0b10`) of Ground Slam particles, blood tethers, and bleed splashes to optimize performance.

### `ui`
*   **`showDevWarning`** *(boolean)*: Enables experimental warning popups.
*   **`showGuideButton`** *(boolean)*: Displays the guide button on the main menu.
*   **`language`** *(string)*: Mod GUI language (`"en"` or `"es"`).

---

## `hud.json` & `compat.json`

- **`hud.json`:** Automatically generated when using the in-game **HUD Editor**. Stores absolute `X` and `Y` coordinates of the three main panels (`cooldowns`, `crosshair_cooldowns`, and `blood_pact`).
- **`compat.json`:** Configures dynamic compatibility hooks for third-party combat mods such as *BetterCombat* forks.
[/EN]

