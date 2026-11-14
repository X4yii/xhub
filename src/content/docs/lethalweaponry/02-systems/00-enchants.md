---
title: "Encantamientos"
project: "LethalWeaponry"
category: "Sistemas"
categoryOrder: 2
order: 0
---

[ES]
# Encantamientos Exclusivos

## Devolution

**Compatibilidad:** Todas las Armas  
**Niveles:** I, II, III, IV

Al golpear un parásito de *Scape and Run: Parasites (SRP)*, hay una **probabilidad del 25%** de reducir sus puntos de adaptación.
- **Reducción por nivel:** Nv1 (`-5`), Nv2 (`-7`), Nv3 (`-10`), Nv4 (`-15`).

---

## Hemophilia

**Compatibilidad:** Exclusivo para Katana  
**Niveles:** I, II, III

Mejora el efecto de Sangrado aplicado por la Katana.
- Aumenta el daño de sangrado basado en un porcentaje de la vida máxima del objetivo (5% de Vida Máxima por nivel).
- El daño se reduce automáticamente al atacar jefes (`hemophiliaBossModifier`).

---

## Soul Harvest

**Compatibilidad:** Todas las Armas  
**Niveles:** I, II, III

Al matar a un enemigo, hay una probabilidad (`15%`, `25%`, `35%` según nivel) de soltar un Orbe de Curación.
- El orbe restaura salud al jugador basada en la vida máxima del enemigo derrotado (`soulHarvestMinHeal` a `soulHarvestMaxHeal`).

---

## Severance

**Compatibilidad:** Todas las Armas Cuerpo a Cuerpo (excepto proyectiles)  
**Niveles:** I, II, III

Asestar un Golpe Crítico aplica el efecto **Severed** por una duración configurable (`severanceDuration`, 3 segundos por defecto).
- El efecto Severed reduce drásticamente la armadura del objetivo escalando con el nivel (I-III), permitiendo infligir daño masivo en los golpes subsecuentes.
- En el **WarHammer**, el ataque en área (*Ground Slam*) también propaga el efecto *Severance* completo si el arma está encantada.
[/ES]

[EN]
# Exclusive Enchantments

## Devolution

**Compatibility:** All Weapons  
**Levels:** I, II, III, IV

When hitting a *Scape and Run: Parasites (SRP)* enemy, there is a **25% chance** to reduce its adaptation points.
- **Reduction per level:** Lv1 (`-5`), Lv2 (`-7`), Lv3 (`-10`), Lv4 (`-15`).

---

## Hemophilia

**Compatibility:** Only Katana  
**Levels:** I, II, III

Enhances the Bleeding effect applied by the Katana.
- Increases Bleeding damage based on the maximum health of the target (5% of Max HP per level).
- Damage is capped when attacking bosses (`hemophiliaBossModifier`).

---

## Soul Harvest

**Compatibility:** All Weapons  
**Levels:** I, II, III

Killing an enemy has a chance (`15%`, `25%`, `35%` based on level) to drop a Healing Orb.
- The orb restores health to the player based on the maximum health of the defeated enemy (`soulHarvestMinHeal` to `soulHarvestMaxHeal`).

---

## Severance

**Compatibility:** All Melee Weapons (excluding projectiles)  
**Levels:** I, II, III

Landing a Critical Hit applies the **Severed** effect for a configurable duration (`severanceDuration`, 3 seconds by default).
- The Severed effect drastically reduces the target's armor scaling across Levels I–III, allowing subsequent hits to deal massive damage.
- On the **WarHammer**, the AoE *Ground Slam* also applies full *Severance* to nearby targets if enchanted.
[/EN]
