---
title: "Visión General"
project: "LethalWeaponry"
category: "Introducción"
categoryOrder: 0
---

[ES]
# LethalWeaponry — Guía de Usuario

**Versión:** r1.0b9 | Minecraft Forge 1.12.2

LethalWeaponry añade cuatro tipos de armas especializadas, cada una con mecánicas de combate, habilidades activas y una estación de forja exclusiva.

---

## 1. Lethal Forge (Forja Letal)

Las armas del mod no se fabrican en una mesa de trabajo estándar. Deben forjarse en la **Lethal Forge**.

**Crafteo de la Forja:**
- Fila Superior: `[Vacío]` `[1 Bloque de Hierro]` `[Vacío]`
- Fila Central: `[1 Obsidiana]` `[1 Cubo de Lava]` `[1 Obsidiana]`
- Fila Inferior: `[1 Obsidiana]` `[1 Mesa de Crafteo]` `[1 Obsidiana]`

**Uso:**
La interfaz permite seleccionar el arma (WarHammer, Katana, Scythe, Chain Blade) y el material (Madera, Piedra, Hierro, Oro, Diamante). Requiere palos e hilos dependiendo del arma. Las recetas completas se pueden consultar mediante **Just Enough Items (JEI)**.

---

## 2. WarHammer (Martillo de Guerra)

Arma pesada enfocada en control de masas y daño de área.

### Aturdimiento y Ground Slam
Al atacar a un enemigo mientras caes (golpe crítico), se activan dos efectos simultáneos:
1. **Aturdimiento:** El objetivo principal queda inmovilizado y su IA se suspende.
2. **Ground Slam:** Genera una onda de choque radial que daña y aturde brevemente a todos los enemigos cercanos. El radio y la duración escalan con la altura de la caída.

### Cancelación de Caída
Caer al suelo sosteniendo el WarHammer mientras mantienes presionado **Shift** anula todo el daño de caída y genera un Ground Slam alrededor de ti.

### Skybreaker
Mantener **Shift** + Mirar hacia abajo + **Clic Derecho** te lanza al aire (requiere enfriamiento completo). El daño de caída resultante se cancela automáticamente. Aterrizar con **Shift** genera un Ground Slam masivo.

---

## 3. Katana

Arma rápida que aplica daño por sangrado acumulable e incluye control territorial.

### Sangrado (Bleeding)
Cualquier impacto con la Katana aplica cargas de sangrado al objetivo, infligiendo daño periódico que ignora la armadura. A mayor cantidad de cargas, el daño ocurre con mayor frecuencia.

### Scythe Slash (Onda de Corte)
Los ataques completamente cargados (cooldown al 100%) proyectan una onda horizontal física. Corta a múltiples enemigos frente a ti aplicando el daño completo del arma y las cargas de sangrado correspondientes.

### Blood Pact
Al presionar **Shift** + **Clic Derecho** sobre un enemigo, se establece un vínculo entre el jugador y los objetivos cercanos. El jugador obtendrá velocidad de movimiento y de ataque mientras el pacto esté activo.
- Recibir daño de un enemigo vinculado reduce drásticamente el tiempo restante del pacto.

### Fatality
Golpear a un enemigo vinculado consume el daño total almacenado durante el BloodPact en un único impacto masivo, curando al jugador y finalizando el vínculo de inmediato.

---

## 4. Scythe (Guadaña)

Arma de ejecución enfocada en el corte frontal en área y regeneración de recursos.

### Scythe Slash (Onda de Corte)
Al igual que la Katana, ataques completamente cargados lanzan un proyectil horizontal penetrante. Esta onda destruye inmediatamente vegetación, telarañas y bloques frágiles.

### Esencia y Lentitud
Cada golpe aplica lentitud al enemigo. Eliminar enemigos genera orbes de Esencia que el jugador absorbe para llenar el medidor del arma.

### E-Dash y Ejecución
Con el medidor de Esencia lleno, mantener **Shift** + **Clic Derecho** consume toda la esencia para impulsar al jugador hacia adelante, otorgándole inmunidad al daño temporalmente. Si impactas a entidades durante este desplazamiento, todo enemigo que esté por debajo del umbral de ejecución (por defecto 35% de salud) muere instantáneamente. Si están por encima del umbral, reciben daño multiplicado e ignoran resistencia.

---

## 5. Chain Blade (Cuchilla de Cadena)

Arma arrojadiza híbrida diseñada para usarse en pares (Dual Wielding).

### Combate Dual
- **Clic Izquierdo:** Ataque cuerpo a cuerpo y lanzamiento de la cuchilla principal.
- **Clic Derecho:** Lanzamiento de la cuchilla secundaria de forma independiente.
Si ambas están equipadas, el jugador se beneficia de atributos pasivos (mejora de salto, velocidad lateral y protección contra ataques terrestres en el aire) utilizando siempre los valores del mejor material equipado.

### Jump Hit
Mantener **Shift** + **Clic Derecho** con ambas cuchillas equipadas lanza las dos al mismo tiempo. Al enganchar un enemigo, el jugador es impulsado hacia arriba mientras el objetivo es arrastrado ferozmente hacia el suelo, infligiendo daño doble y aturdiéndolo por 1 segundo.

---

## 6. Encantamientos

Exclusivos para las armas de LethalWeaponry:

*   **Devolution (Nivel I-III):** Exclusivo para Katana, WarHammer y Scythe. Reduce los puntos de adaptación de los parásitos SRP y tiene probabilidad de restar puntos pasivamente.
*   **Hemophilia (Nivel I):** Exclusivo para Katana. El sangrado causa daño adicional equivalente a un porcentaje de la salud máxima del enemigo (capado en jefes).
*   **Soul Harvest (Nivel I-III):** Exclusivo para Scythe. Probabilidad de generar orbes curativos al golpear enemigos con el ataque básico.
*   **Severance (Nivel I):** Exclusivo para WarHammer. Los ataques críticos reducen significativamente la armadura del objetivo temporalmente.

---

## 7. Interfaces (HUD & Configuración)

### HUD Editor
El mod cuenta con indicadores en pantalla para los cooldowns de habilidades, pactos de sangre e indicadores de doble empuñadura.
Para reposicionar la interfaz, entra al mundo, presiona la tecla configurada o usa el menú Mod Options y accede al **HUD Editor**. Aquí puedes arrastrar, soltar y ajustar cada panel visual. Mantener **Shift** muestra todos los elementos ocultos temporalmente para facilitar su reubicación.

### Menú de Configuración
Todo el comportamiento lógico del servidor y las preferencias del cliente son accesibles in-game a través de una interfaz rediseñada. Incluye categorías colapsables y barra de búsqueda en tiempo real.
[/ES]

[EN]
# LethalWeaponry — User Guide

**Version:** r1.0b9 | Minecraft Forge 1.12.2

LethalWeaponry adds four specialized weapon types, each with unique combat mechanics, active abilities, and an exclusive forging station.

---

## 1. Lethal Forge

Mod weapons cannot be crafted in a standard crafting table. They must be forged in the **Lethal Forge**.

**Forge Crafting Recipe:**
- Top Row: `[Empty]` `[1 Iron Block]` `[Empty]`
- Middle Row: `[1 Obsidian]` `[1 Lava Bucket]` `[1 Obsidian]`
- Bottom Row: `[1 Obsidian]` `[1 Crafting Table]` `[1 Obsidian]`

**Usage:**
The interface allows you to select the weapon (WarHammer, Katana, Scythe, Chain Blade) and the material (Wood, Stone, Iron, Gold, Diamond). Some weapons require sticks and string. Full recipes can be viewed using **Just Enough Items (JEI)**.

---

## 2. WarHammer

Heavy weapon focused on crowd control and area-of-effect damage.

### Stun & Ground Slam
Attacking an enemy while falling (critical hit) triggers two simultaneous effects:
1. **Stun:** The primary target is immobilized and its AI is suspended.
2. **Ground Slam:** Generates a radial shockwave that damages and briefly stuns all nearby enemies. The radius and duration scale with fall height.

### Fall Damage Cancellation
Landing while holding the WarHammer and pressing **Shift** negates all fall damage and generates a Ground Slam around you.

### Skybreaker
Holding **Shift** + Look down + **Right Click** launches you into the air (requires full cooldown). The resulting fall damage is automatically canceled. Landing with **Shift** held generates a massive Ground Slam.

---

## 3. Katana

Fast weapon that applies stacking bleeding damage and territorial control.

### Bleeding
Any impact with the Katana applies bleeding stacks to the target, dealing periodic damage that ignores armor. More stacks result in faster damage ticks.

### Scythe Slash (Wave Attack)
Fully charged attacks (100% cooldown) project a physical horizontal wave. It slashes multiple enemies in front of you, dealing full weapon damage and applying bleeding stacks.

### Blood Pact
Pressing **Shift** + **Right Click** on an enemy establishes a link between the player and nearby targets. The player will gain movement speed and attack speed while the pact is active.
- Increases movement and attack speed.
- Taking damage from a linked enemy drastically reduces the remaining pact time.

### Fatality
Hitting a linked enemy consumes the total damage stored during the BloodPact into a single massive strike, healing the player and ending the link immediately.

---

## 4. Scythe

Execution weapon focused on frontal area slashing and resource regeneration.

### Scythe Slash (Wave Attack)
Like the Katana, fully charged attacks launch a piercing horizontal projectile. This wave instantly destroys vegetation, cobwebs, and fragile blocks.

### Essence & Slowness
Every hit applies slowness to the enemy. Killing enemies drops Essence Orbs that the player absorbs to fill the weapon's meter.

### E-Dash and Execution
With a full Essence meter, holding **Shift** + **Right Click** consumes all essence to dash forward, granting temporary damage immunity.
If you impact entities during this dash: any enemy below the execution threshold (default 35% health) is instantly killed. If above the threshold, they receive multiplied damage that ignores armor resistance.

---

## 5. Chain Blade

Hybrid throwable weapon designed for Dual Wielding.

### Dual Combat
- **Left Click:** Melee attack and throws the primary blade.
- **Right Click:** Throws the secondary (off-hand) blade independently.
When dual wielding, the player gains passive attributes (jump boost, lateral speed, and aerial immunity against grounded attacks), always using the highest values from the equipped materials.

### Jump Hit
Holding **Shift** + **Right Click** with both blades equipped throws both simultaneously. Grappling an enemy launches the player upwards while dragging the target violently to the ground, dealing double damage and stunning them for 1 second.

---

## 6. Enchantments

Exclusive to LethalWeaponry weapons:

*   **Devolution (Level I-III):** Exclusive to Katana, WarHammer, and Scythe. Reduces SRP parasite adaptation points and has a chance to subtract points passively.
*   **Hemophilia (Level I):** Exclusive to Katana. Bleeding deals bonus damage equal to a percentage of the enemy's max health (capped on bosses).
*   **Soul Harvest (Level I-III):** Exclusive to Scythe. Chance to generate healing orbs when striking enemies with basic attacks.
*   **Severance (Level I):** Exclusive to WarHammer. Critical attacks significantly reduce the target's armor temporarily.

---

## 7. Interfaces (HUD & Config)

### HUD Editor
The mod features on-screen indicators for ability cooldowns, blood pacts, and dual wield status.
To reposition the HUD, enter the world, press the configured key or use the Mod Options menu to open the **HUD Editor**. You can drag, drop, and snap each visual panel. Holding **Shift** reveals all hidden elements for easy repositioning.

### Configuration Menu
All server logic and client preferences are accessible in-game via a redesigned interface featuring collapsible categories and a real-time search bar.
[/EN]
