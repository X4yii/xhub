---
title: "Primeros Pasos"
project: "Automata"
category: "Introducción"
categoryOrder: 0
order: 1
---

[ES]
# Primeros Pasos

## 1. Obtención de Autómatas
Existen dos formas de incorporar autómatas en el mundo:
1. **Generación natural (`AutomatonCampGenerator`):** En el Overworld se generan campamentos con autómatas salvajes configurables mediante `campSpawnRarity` (valor por defecto `240`; `0` desactiva la generación).
2. **Comando de operador:** `/automata spawn [nombreSkin]` invoca un autómata vinculado al jugador que ejecuta el comando (requiere nivel OP `2`).

Cada jugador tiene un límite configurable de autómatas activos simultáneos (`maxBotsPerPlayer`, defecto `8`, `0` = ilimitado).

---

## 2. Interfaz X4UI
Al hacer **clic derecho** sobre un autómata propio (o con permiso OP) hasta **10 bloques** de distancia, se abre su panel de control con cuatro pestañas:
- **Overview:** Salud, hambre/saturación, estado (`active` / `downed`), trabajo actual e inventario rápido.
- **Tasks & Logistics:** Selector de trabajo activo, coordenadas de zona (`Pos1` / `Pos2`), cofre de depósito y comportamiento al finalizar (`Follow Owner`, `Stay Put`, `Return & Stay`).
- **Behavior & Squad:** Canal de escuadrón, cooperación de escuadrón, nombre visible, skin por usuario, y banderas de combate/loot (`canPickUpLoot`, `searchLoot`, listas negras).
- **Telemetry:** Estado interno de navegación, objetivo actual y métricas de diagnóstico.

---

## 3. Supervivencia y Estado `Downed`
- Los autómatas consumen comida de su inventario para regenerar salud y mantener saturación.
- Cuando su salud llega a un umbral crítico en combate, entran en estado **`downed`** (incapacitados) en lugar de morir inmediatamente: detienen navegación y minado, limpian aggro hostil cercano y emiten una alerta al `SquadBlackboard` para que un aliado los reanime.
- También reaccionan automáticamente ante **lava** (colocando bloques debajo y buscando tierra seca), **fuego** (buscando agua o sombra), **Creepers/TNT** y **caída al vacío** (uso de Ender Pearl de emergencia si disponen de una).
[/ES]

[EN]
# Getting Started

## 1. Obtaining Automata
Automata can be introduced into a world in two ways:
1. **Natural Generation (`AutomatonCampGenerator`):** Camps with wild automata generate in the Overworld, controlled by `campSpawnRarity` (default `240`; `0` disables generation).
2. **Operator Command:** `/automata spawn [skinName]` spawns an automaton owned by the command sender (requires OP level `2`).

Each player has a configurable active automaton cap (`maxBotsPerPlayer`, default `8`, `0` = unlimited).

---

## 2. X4UI Control Panel
**Right-clicking** an owned automaton (or any automaton with OP) within **10 blocks** opens its control panel with four tabs:
- **Overview:** Health, hunger/saturation, state (`active` / `downed`), current job, and quick inventory access.
- **Tasks & Logistics:** Active job selector, work zone coordinates (`Pos1` / `Pos2`), deposit chest, and completion behavior (`Follow Owner`, `Stay Put`, `Return & Stay`).
- **Behavior & Squad:** Squad channel, squad cooperation toggle, display name, player skin, and combat/loot flags (`canPickUpLoot`, `searchLoot`, blacklists).
- **Telemetry:** Internal navigation state, active target, and diagnostic metrics.

---

## 3. Survival & `Downed` State
- Automata consume food from their inventory to heal and maintain saturation.
- On critical damage, they enter a **`downed`** state instead of dying immediately: navigation and mining stop, nearby hostile aggro is cleared, and a rescue alert is posted to `SquadBlackboard` for allied revival.
- They also react automatically to **lava** (emergency block placement and dry-land pathing), **fire** (water or shade seeking), **Creepers/TNT**, and **void falls** (emergency Ender Pearl if available).
[/EN]

