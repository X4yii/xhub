---
title: "Containers & Panels"
project: "X4UI"
category: "Components"
categoryOrder: 1
order: 1
---

[ES]
# Contenedores y Paneles (`GuiPanel`, `GuiUnionPanel`, `GuiCard`, `GuiScrollPanel`, `GuiGridPanel`, `GuiSlot`)

Los contenedores organizan la jerarquía visual, gestionan el diseño mediante `ILayoutManager` (`FlexLayout`) y controlan el recorte (*clipping*) de sus hijos.

---

## 1. `GuiPanel` y Primitivas Semánticas

`GuiPanel` es el contenedor estructural base. Soporta radios independientes por esquina (`withCornerRadii`), bordes selectivos por lado (`withBorderSides`) y constructores estáticos orientados al estándar responsivo:

```java
// Contenedor en columna (VERTICAL, hugContent=true, 100% ancho)
GuiPanel column = GuiPanel.column(8);

// Contenedor en fila (HORIZONTAL, 100% ancho) con espaciador flexible
GuiPanel row = GuiPanel.row(8);
row.addChild(new GuiLabel(0, 0, "Título", 0xFFFFFFFF));
row.addChild(GuiPanel.spacer());
row.addChild(new GuiButton(0, 0, 20, 20, "X", this::closeScreen));

// Tarjeta temática con padding y hugContent automático
GuiPanel card = GuiPanel.card(10, 6);

// Pestaña superior sin borde inferior y esquinas superiores redondeadas
GuiPanel tab = new GuiPanel(0, 0, 80, 22)
    .withCornerRadii(CornerRadii.top(6))
    .withBorderSides(BorderSides.without(BorderSides.ALL, BorderSides.BOTTOM));
```

---

## 2. `GuiUnionPanel` (Alas Acopladas sin Costuras)

`GuiUnionPanel` extiende `GuiPanel` para acoplar paneles laterales (`attachWing(DockSide, GuiPanel, int offset)`) que se funden en **un único fondo continuo** (rectángulos disjuntos sin doble alpha) y un **contorno exterior inteligente** (suprimiendo las aristas compartidas y aplanando esquinas en contacto):

```java
GuiUnionPanel union = new GuiUnionPanel(0, 0, 176, 166);
union.setBackgroundColor(0xFF1A1D24);
union.setBorderWidth(1);
union.setBorderColor(0xFF2D333F);
union.setCornerRadius(6);

GuiPanel configWing = new GuiPanel(0, 0, 64, 96);
union.attachWing(DockSide.RIGHT, configWing, 12);
```

---

## 3. `GuiCard`, `GuiScrollPanel` y `GuiGridPanel`

- **`GuiCard`:** extiende `GuiPanel` con título integrado (`getTitleLabel()`) estilizado por el tema activo.
- **`GuiScrollPanel`:** encapsula `contentPanel` dentro de un viewport con recorte hardware y desplazamiento normalizado (`GuiScrollPanel.vertical(220, 6)`).
- **`GuiGridPanel`:** extiende `GuiScrollPanel` con cálculo automático de columnas (`autoColumns`), reserva de scrollbar en 1 sola pasada y helper `addSlots(...)`:

```java
GuiGridPanel grid = GuiGridPanel.slotGrid(120, 2);
grid.addSlots(inventorySlots.inventorySlots, this);
```

---

## 4. `GuiSlot` y `GuiBaseContainer.attachSidePanel`

`GuiSlot` vincula un `Slot` de inventario vanilla dentro de `GuiBaseContainer` y se resincroniza instantáneamente ante cambios de layout (`onBoundsChanged()`). En `GuiBaseContainer`, `attachSidePanel(DockSide, GuiComponent)` acopla paneles laterales a la ventana principal manteniendo todo dentro de la pantalla, actualizando `jeiRecipeAreas` y evitando el dropeo accidental de ítems en `hasClickedOutside`.

---

## 5. Qué Evitar en Contenedores

| Antipatrón | Causa Técnica del Problema | Solución Correcta |
| :--- | :--- | :--- |
| Configurar `scroll.setFlexDirection(...)` en lugar de `scroll.getContentPanel().setFlexDirection(...)` | Modifica el contenedor externo del viewport en lugar del panel interno de ítems | Usar `GuiScrollPanel.vertical(...)` o configurar `getContentPanel()` |
| Usar `GuiPanel` sin `GuiScrollPanel` para listas o formularios largos | El contenido queda inaccesible fuera de pantalla en GUI Scale 3x y 4x | Envolver todo flujo vertical extenso en `GuiScrollPanel` |
[/ES]

[EN]
# Containers & Panels (`GuiPanel`, `GuiUnionPanel`, `GuiCard`, `GuiScrollPanel`, `GuiGridPanel`, `GuiSlot`)

Containers structure the visual hierarchy, arrange children through `ILayoutManager` (`FlexLayout`), and enforce hardware clipping bounds.

---

## 1. `GuiPanel` & Semantic Builders

`GuiPanel` is the base structural container. It supports per-corner radii (`withCornerRadii`), per-side border bitmasks (`withBorderSides`), and static semantic factories aligned with the responsive standard:

```java
// Vertical stack (VERTICAL, hugContent=true, 100% width)
GuiPanel column = GuiPanel.column(8);

// Horizontal row (HORIZONTAL, 100% width) with flexible spacer
GuiPanel row = GuiPanel.row(8);
row.addChild(new GuiLabel(0, 0, "Title", 0xFFFFFFFF));
row.addChild(GuiPanel.spacer());
row.addChild(new GuiButton(0, 0, 20, 20, "X", this::closeScreen));

// Themed card with padding and automatic hugContent height
GuiPanel card = GuiPanel.card(10, 6);

// Top-docked tab with rounded top corners and no bottom border
GuiPanel tab = new GuiPanel(0, 0, 80, 22)
    .withCornerRadii(CornerRadii.top(6))
    .withBorderSides(BorderSides.without(BorderSides.ALL, BorderSides.BOTTOM));
```

---

## 2. `GuiUnionPanel` (Seamless Docked Wings)

`GuiUnionPanel` extends `GuiPanel` to attach docked wing panels (`attachWing(DockSide, GuiPanel, int offset)`) that merge into **one continuous disjoint background** (no alpha overdraw) and an **outer-only border** (eliminating shared seam edges and flattening touching corners):

```java
GuiUnionPanel union = new GuiUnionPanel(0, 0, 176, 166);
union.setBackgroundColor(0xFF1A1D24);
union.setBorderWidth(1);
union.setBorderColor(0xFF2D333F);
union.setCornerRadius(6);

GuiPanel configWing = new GuiPanel(0, 0, 64, 96);
union.attachWing(DockSide.RIGHT, configWing, 12);
```

---

## 3. `GuiCard`, `GuiScrollPanel` & `GuiGridPanel`

- **`GuiCard`:** extends `GuiPanel` with a built-in header label (`getTitleLabel()`) styled by the active theme.
- **`GuiScrollPanel`:** wraps `contentPanel` inside a scissored viewport with normalized scroll wheel support (`GuiScrollPanel.vertical(220, 6)`).
- **`GuiGridPanel`:** extends `GuiScrollPanel` with `autoColumns` calculation, 1-pass scrollbar reservation, and `addSlots(...)`:

```java
GuiGridPanel grid = GuiGridPanel.slotGrid(120, 2);
grid.addSlots(inventorySlots.inventorySlots, this);
```

---

## 4. `GuiSlot` & `GuiBaseContainer.attachSidePanel`

`GuiSlot` binds a vanilla inventory `Slot` inside `GuiBaseContainer` and re-syncs immediately on layout updates (`onBoundsChanged()`). On `GuiBaseContainer`, `attachSidePanel(DockSide, GuiComponent)` docks side panels to the main window while clamping within viewport bounds, registering `jeiRecipeAreas`, and protecting `hasClickedOutside`.

---

## 5. What to Avoid with Containers

| Anti-Pattern | Technical Root Cause | Correct Approach |
| :--- | :--- | :--- |
| Calling `scroll.setFlexDirection(...)` instead of `scroll.getContentPanel().setFlexDirection(...)` | Configures the outer viewport wrapper instead of the inner content container | Use `GuiScrollPanel.vertical(...)` or configure `getContentPanel()` |
| Placing tall lists or forms directly in `GuiPanel` without `GuiScrollPanel` | Content clips off-screen at GUI Scale 3x and 4x | Wrap all tall vertical flows inside `GuiScrollPanel` |
[/EN]
