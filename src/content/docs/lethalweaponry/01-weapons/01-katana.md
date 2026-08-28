---
title: "Katana"
project: "LethalWeaponry"
category: "Armas"
categoryOrder: 1
---

[EN]
## Bleeding
- **Application:** Every successful hit applies Bleeding stacks up to a cap.
- **Effect:** Deals periodic magic damage (ignores armor) and spawns blood particles. Higher stacks tick faster but decay sooner.

## Blood Pact
- **Activation:** `Right-Click` an enemy to link them. HUD displays a radial timer (max 100s).
- **Duration:** Fully charged hits (+90%) add 2s. Taking damage from linked enemies subtracts 10s (4s for SRP).
- **Madness:** Charges by 10 points per hit on linked enemies.
- **Blood Burst:** Every 10s, accumulated damage detonates automatically, damaging linked enemies and slightly healing the player.
- **Fatality:** `Right-Click` a linked enemy to consume accumulated damage and end the pact.
  - **Madness >= 60:** Deals 1.5x accumulated damage, heals 50% of damage dealt, applies "Torn", and grants a Forward Dash with temporary I-Frames.
  - **Madness < 60:** Deals standard damage. The weapon suffers a cooldown penalty (temporary disarm).

## Hitscan Slash
- **Effect:** Fully charged attacks (100%) unleash an instantaneous frontal directional sweep.
- Deals 100% base damage and applies Bleeding to all targets. Destroys fragile vegetation instantly without server lag.
- **SRP Compatibility:** All Katana damage (hits, sweeps, bleeding) ignores SRP adaptations by default (configurable).
[/EN]

[ES]
## Sangrado
- **Aplicación:** Cada golpe exitoso aplica acumulaciones de Sangrado.
- **Efecto:** Daño mágico periódico (ignora armadura). A mayor acumulación, más rápidos son los ticks de daño pero decaen antes.

## Blood Pact
- **Activación:** `Clic Derecho` en un enemigo para vincularlo. El HUD muestra un temporizador (máx 100s).
- **Duración:** Ataques cargados (+90%) suman 2s. Recibir daño del enemigo restará 10s (4s para SRP).
- **Locura:** Carga 10 puntos por cada golpe al enemigo vinculado.
- **Blood Burst:** Cada 10s, el daño acumulado explota causando daño en área a vinculados y curando al jugador.
- **Fatality:** `Clic Derecho` sobre un enemigo vinculado para consumir el daño acumulado y terminar el pacto.
  - **Locura >= 60:** Daño x1.5, curación del 50%, aplica "Torn", y otorga un Dash frontal con I-Frames (Resistencia 4).
  - **Locura < 60:** Daño estándar. El arma sufre un cooldown de castigo (desarme temporal).

## Hitscan Slash
- **Efecto:** Ataques cargados al 100% desatan un barrido frontal direccional instantáneo.
- Inflige daño base y Sangrado en área. Destruye vegetación frágil instantáneamente sin latencia de red.
- **Compatibilidad SRP:** Todo el daño de Katana ignora pasivamente las adaptaciones SRP por defecto.
[/ES]
