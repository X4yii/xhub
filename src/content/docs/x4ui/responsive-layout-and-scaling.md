---
title: "Responsive Layout & Scaling"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 4
---

[ES]
# 04 - Diseño Responsivo y Posicionamiento Relativo (GUI Scale 1x a 4x)

Este documento establece el estándar oficial de diseño responsivo de X4UI, diseñado para que toda interfaz conserve legibilidad, alineación y accesibilidad bajo cualquier resolución y factor de escala (`GUI Scale` 1, 2, 3, 4 y Auto) en Forge 1.12.2 y CleanroomMC.

---

## 1. El Problema del Escalado en Minecraft

Minecraft calcula las dimensiones lógicas de la pantalla (`ScaledResolution`) dividiendo la resolución real en píxeles de la ventana entre el factor de escala:

$$\text{scaledWidth} = \left\lfloor \frac{\text{displayWidth}}{\text{scaleFactor}} \right\rfloor, \quad \text{scaledHeight} = \left\lfloor \frac{\text{displayHeight}}{\text{scaleFactor}} \right\rfloor$$

Una ventana en `1920x1080` pasa de `960x540` en Scale 2 a `480x270` en Scale 4. Cualquier interfaz basada en coordenadas `(X, Y)` o anchos fijos superiores al área lógica se recorta o superpone.

---

## 2. Los Cuatro Pilares del Estándar Responsivo X4UI

### Pilar 1: Dimensionamiento Porcentual en `GuiComponent`

`GuiComponent` resuelve dimensiones y posiciones relativas al padre mediante API fluida (`-1.0f` desactiva el cálculo porcentual):

```java
card.withPercentWidth(1.0f);         // 100% del ancho disponible del padre
colLeft.withPercentWidth(0.5f);      // 50% del ancho disponible
modal.withPercentSize(0.8f, 0.6f);   // 80% ancho, 60% alto
badge.withPercentPosition(0.5f, 0.1f);
```

### Pilar 2: `FlexLayout`, Alineación (`FlexAlign`) y Primitivas de `GuiPanel`

Los contenedores se construyen mediante las primitivas semánticas de `GuiPanel` y `GuiBaseScreen` en lugar de calcular coordenadas manuales:

```java
// Ventana modal centrada con atenuación de fondo (dimBackground)
GuiPanel window = createCenteredWindow(420, 300);

// Fila de encabezado con título a la izquierda y cierre a la derecha
GuiPanel header = GuiPanel.row(8);
header.addChild(new GuiLabel(0, 0, "Panel de Control", 0xFFFFFFFF));
header.addChild(GuiPanel.spacer());
header.addChild(new GuiButton(0, 0, 20, 20, "X", this::closeScreen));

// Tarjeta temática con padding y altura automática (hugContent)
GuiPanel section = GuiPanel.card(10, 6);
```

- **Alineación (`FlexAlign`):** `START`, `CENTER`, `END` y `STRETCH` en eje transversal (`setAlignItems`) y eje principal (`setJustifyContent`), complementados con `GuiPanel.spacer()`.
- **Solver Elástico (`flexGrow` / `flexShrink` y Cotas `min`/`max`):** Los hijos pueden declarar `withFlexGrow(float)`, `withFlexShrink(float)`, `withMinSize(w, h)` y `withMaxSize(w, h)`. `FlexLayout` utiliza un algoritmo *water-filling* sobre `baseWidth`/`baseHeight` para repartir espacio libre o comprimir desbordamientos respetando límites sin deriva acumulativa frame a frame.
- **Control `hugContent`:** Por defecto `FlexLayout` es **no destructivo** (`hugContent = false`) y respeta el tamaño asignado al padre. Activar `.withHugContent(true)` hace que el contenedor ajuste su tamaño a la suma de sus hijos visibles.
- **Regla de bucle en `VERTICAL` + `hugContent(true)`:** Si la altura del contenedor depende de sus hijos, los hijos deben definir un alto absoluto en píxeles (no `withPercentHeight(...)`) y usar `withPercentWidth(...)` para adaptarse horizontalmente.

### Pilar 3: Contención Obligatoria en `GuiScrollPanel` y `GuiGridPanel`

Todo contenido vertical extenso (listas, formularios, secciones apiladas) debe residir dentro de un `GuiScrollPanel`, o en un `GuiGridPanel` para grillas uniformes de slots o celdas:

```java
// Scroll vertical preconfigurado (contentPanel VERTICAL, hugContent=true, 100% ancho)
GuiScrollPanel scrollPanel = GuiScrollPanel.vertical(180, 6);

// Grilla dinámica con autoColumns y scroll vertical automático
GuiGridPanel slotGrid = GuiGridPanel.slotGrid(140, 2);
slotGrid.addSlots(inventorySlots.inventorySlots, this);
```

Tanto `GuiScrollPanel` como `GuiGridPanel` reservan automáticamente el ancho de su barra de desplazamiento en una sola pasada determinista cuando el contenido excede el viewport, evitando solapamientos u oscilación de columnas en escalas 3x y 4x.

En pantallas de inventario (`GuiBaseContainer`), se pueden acoplar paneles laterales mediante `attachSidePanel(DockSide, GuiComponent)`, manteniendo el conjunto dentro de los márgenes de pantalla (`flexShrink`), registrando áreas de exclusión JEI/HEI (`jeiRecipeAreas`) y protegiendo clics externos (`hasClickedOutside`).

### Pilar 4: Preservación del Árbol en `onScreenResize`

Nunca se debe limpiar y recrear la jerarquía de componentes dentro de `onScreenResize()`. Al cambiar el tamaño de la ventana, `FlexLayout` y `withPercentWidth` recalculan posiciones y dimensiones preservando el texto ingresado, el foco de teclado y la posición de scroll.

---

## 3. Qué Evitar al Diseñar Layouts

| Antipatrón | Causa Técnica del Problema | Solución Correcta |
| :--- | :--- | :--- |
| Coordenadas absolutas `(X, Y)` para posicionamiento estructural | Se recorta o desborda en GUI Scale 3x y 4x | Usar `0` en `X, Y`, `FlexLayout` y `withPercentWidth()` |
| Llamar `initComponents()` o `clearChildren()` en `onScreenResize()` | Destruye foco, estado de inputs, scroll y cancela animaciones | Confiar en la propagación automática de `FlexLayout` |
| Usar `withPercentHeight()` dentro de un contenedor `VERTICAL` con `hugContent(true)` | Dependencia circular entre el alto del padre y el del hijo | Definir alto absoluto en los hijos y usar `withPercentWidth()` |
| Usar `FlexWrap = true` sin altos definidos por elemento | La fila envuelta colapsa visualmente a altura `0` | Asignar altura explícita en cada elemento de la fila |
[/ES]

[EN]
# 04 - Responsive Design & Relative Positioning (GUI Scale 1x to 4x)

This document defines X4UI's official responsive design standard, ensuring interfaces remain readable, aligned, and accessible across any window resolution and scale factor (`GUI Scale` 1, 2, 3, 4, and Auto) on Forge 1.12.2 and CleanroomMC.

---

## 1. The Minecraft Scaling Problem

Minecraft computes logical screen dimensions (`ScaledResolution`) by dividing actual window pixel dimensions by the active scale factor:

$$\text{scaledWidth} = \left\lfloor \frac{\text{displayWidth}}{\text{scaleFactor}} \right\rfloor, \quad \text{scaledHeight} = \left\lfloor \frac{\text{displayHeight}}{\text{scaleFactor}} \right\rfloor$$

A `1920x1080` window shrinks from `960x540` at Scale 2 to `480x270` at Scale 4. Interfaces built with fixed `(X, Y)` coordinates or wide hard-coded widths clip out of bounds or overlap.

---

## 2. The Four Pillars of the X4UI Responsive Standard

### Pillar 1: Percentage Sizing on `GuiComponent`

`GuiComponent` resolves dimensions and positions relative to its parent via fluent methods (passing `-1.0f` disables percentage sizing):

```java
card.withPercentWidth(1.0f);         // 100% of parent available width
colLeft.withPercentWidth(0.5f);      // 50% of parent available width
modal.withPercentSize(0.8f, 0.6f);   // 80% width, 60% height
badge.withPercentPosition(0.5f, 0.1f);
```

### Pillar 2: `FlexLayout`, Alignment (`FlexAlign`) & `GuiPanel` Primitives

Group elements with `GuiPanel` semantic builders and `GuiBaseScreen` helpers instead of computing manual coordinates:

```java
// Centered modal window with automatic background dimming
GuiPanel window = createCenteredWindow(420, 300);

// Header row with title on the left and close button on the right
GuiPanel header = GuiPanel.row(8);
header.addChild(new GuiLabel(0, 0, "Control Panel", 0xFFFFFFFF));
header.addChild(GuiPanel.spacer());
header.addChild(new GuiButton(0, 0, 20, 20, "X", this::closeScreen));

// Themed section card with padding and automatic height (hugContent)
GuiPanel section = GuiPanel.card(10, 6);
```

- **Alignment (`FlexAlign`):** Supports `START`, `CENTER`, `END`, and `STRETCH` on cross axis (`setAlignItems`) and main axis (`setJustifyContent`), paired with `GuiPanel.spacer()`.
- **Elastic Solver (`flexGrow` / `flexShrink` & `min`/`max` Bounds):** Children can declare `withFlexGrow(float)`, `withFlexShrink(float)`, `withMinSize(w, h)`, and `withMaxSize(w, h)`. `FlexLayout` runs a *water-filling* solver against `baseWidth`/`baseHeight` to distribute free space or compress overflow within bounds without cumulative frame-to-frame drift.
- **`hugContent` behavior:** By default `FlexLayout` is **non-destructive** (`hugContent = false`), preserving explicit or percentage parent bounds. Enabling `.withHugContent(true)` fits the container to its visible children.
- **Circular sizing rule (`VERTICAL` + `hugContent(true)`):** When a container's height is summed from its children, children must specify pixel heights (not `withPercentHeight(...)`) and use `withPercentWidth(...)` for horizontal responsiveness.

### Pillar 3: Mandatory Containment in `GuiScrollPanel` & `GuiGridPanel`

All tall vertical content (lists, forms, stacked sections) must reside inside a `GuiScrollPanel`, or inside a `GuiGridPanel` for uniform slot or cell grids:

```java
// Preconfigured vertical scroll (VERTICAL contentPanel, hugContent=true, 100% width)
GuiScrollPanel scrollPanel = GuiScrollPanel.vertical(180, 6);

// Dynamic grid with autoColumns and automatic vertical scroll fallback
GuiGridPanel slotGrid = GuiGridPanel.slotGrid(140, 2);
slotGrid.addSlots(inventorySlots.inventorySlots, this);
```

Both `GuiScrollPanel` and `GuiGridPanel` reserve scrollbar width in a single deterministic pass when content overflows the viewport, preventing right-edge clipping or column oscillation at GUI Scale 3x and 4x.

In inventory screens (`GuiBaseContainer`), side panels can be docked via `attachSidePanel(DockSide, GuiComponent)`, clamping the ensemble within screen bounds (`flexShrink`), updating JEI/HEI `jeiRecipeAreas`, and protecting `hasClickedOutside`.

### Pillar 4: Hierarchy Preservation on `onScreenResize`

Never clear and recreate the component hierarchy inside `onScreenResize()`. When the window resizes, `FlexLayout` and `withPercentWidth` recalculate bounds automatically while preserving text input values, focus, and scroll offsets.

---

## 3. What to Avoid in Layout Design

| Anti-Pattern | Technical Root Cause | Correct Approach |
| :--- | :--- | :--- |
| Fixed `(X, Y)` coordinates for structural layout | Clips or overlaps at GUI Scale 3x and 4x | Pass `0` for `X, Y`, use `FlexLayout` and `withPercentWidth()` |
| Calling `initComponents()` or `clearChildren()` in `onScreenResize()` | Destroys input focus, text state, scroll offsets, and active animations | Rely on automatic `FlexLayout` recalculation |
| Using `withPercentHeight()` inside a `VERTICAL` `hugContent(true)` container | Creates a circular height dependency between parent and child | Specify pixel heights on children and use `withPercentWidth()` |
| Enabling `FlexWrap = true` without explicit element heights | Wrapped rows collapse visually to height `0` | Assign an explicit height to each item in the row |
[/EN]
