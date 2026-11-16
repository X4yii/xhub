---
title: "Containers & Panels"
project: "X4UI"
category: "Components"
categoryOrder: 1
order: 1
---

[ES]
# Contenedores y Paneles (`GuiPanel`, `GuiCard`, `GuiScrollPanel`, `GuiSlot`)

Los contenedores organizan la jerarquía visual, gestionan el diseño mediante `ILayoutManager` (`FlexLayout`) y controlan el recorte (*clipping*) de sus hijos.

---

## 1. `GuiPanel` y Primitivas Semánticas

`GuiPanel` es el contenedor estructural base. En `r1.0b6` provee constructores estáticos orientados al estándar responsivo:

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
```

También es posible configurar manualmente la dirección, alineación (`FlexAlign`) y relleno:

```java
GuiPanel panel = new GuiPanel(0, 0, 0, 0).withPercentWidth(1.0f);
panel.setFlexDirection(FlexDirection.VERTICAL);
panel.setGap(6);
panel.setPadding(new Insets(10));
```

---

## 2. `GuiCard`

`GuiCard` extiende `GuiPanel` con título integrado y estilo de tarjeta del tema activo:

```java
GuiCard card = (GuiCard) new GuiCard(0, 0, 0, 120, "Estadísticas")
    .withPercentWidth(1.0f);
```

---

## 3. `GuiScrollPanel`

`GuiScrollPanel` encapsula un sub-contenedor interno (`contentPanel`) dentro de un viewport con recorte hardware y desplazamiento normalizado (`UIInput`):

```java
// Forma recomendada: scroll vertical preconfigurado
GuiScrollPanel scroll = GuiScrollPanel.vertical(220, 6);
scroll.addChild(card1); // addChild() redirige internamente hacia contentPanel
scroll.addChild(card2);
```

Cuando el contenido supera la altura del viewport, `GuiScrollPanel` reserva automáticamente el espacio de la barra de desplazamiento para evitar recorte horizontal.

---

## 4. `GuiSlot`

`GuiSlot` vincula un `Slot` de inventario vanilla dentro de `GuiBaseContainer` al árbol de componentes:

```java
for (Slot slot : inventorySlots.inventorySlots) {
    rootPanel.addChild(new GuiSlot(slot, this));
}
```

---

## 5. Qué Evitar en Contenedores

| Antipatrón | Causa Técnica del Problema | Solución Correcta |
| :--- | :--- | :--- |
| Configurar `scroll.setFlexDirection(...)` en lugar de `scroll.getContentPanel().setFlexDirection(...)` | Modifica el contenedor externo del viewport en lugar del panel interno de ítems | Usar `GuiScrollPanel.vertical(...)` o configurar `getContentPanel()` |
| Usar `GuiPanel` sin `GuiScrollPanel` para listas o formularios largos | El contenido queda inaccesible fuera de pantalla en GUI Scale 3x y 4x | Envolver todo flujo vertical extenso en `GuiScrollPanel` |
[/ES]

[EN]
# Containers & Panels (`GuiPanel`, `GuiCard`, `GuiScrollPanel`, `GuiSlot`)

Containers structure the visual hierarchy, arrange children through `ILayoutManager` (`FlexLayout`), and enforce hardware clipping bounds.

---

## 1. `GuiPanel` & Semantic Builders

`GuiPanel` is the base structural container. In `r1.0b6` it provides static semantic factories aligned with the responsive standard:

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
```

Manual layout configuration is also supported via `FlexDirection`, `FlexAlign`, and `Insets`:

```java
GuiPanel panel = new GuiPanel(0, 0, 0, 0).withPercentWidth(1.0f);
panel.setFlexDirection(FlexDirection.VERTICAL);
panel.setGap(6);
panel.setPadding(new Insets(10));
```

---

## 2. `GuiCard`

`GuiCard` extends `GuiPanel` with a built-in header label (`getTitleLabel()`) styled by the active theme:

```java
GuiCard card = (GuiCard) new GuiCard(0, 0, 0, 120, "Statistics")
    .withPercentWidth(1.0f);
```

---

## 3. `GuiScrollPanel`

`GuiScrollPanel` wraps an internal `contentPanel` inside a scissored viewport with normalized scroll wheel support (`UIInput`):

```java
// Recommended: preconfigured vertical scroll panel
GuiScrollPanel scroll = GuiScrollPanel.vertical(220, 6);
scroll.addChild(card1); // addChild() forwards to contentPanel
scroll.addChild(card2);
```

When content overflows the viewport height, `GuiScrollPanel` reserves scrollbar width automatically to prevent right-edge clipping.

---

## 4. `GuiSlot`

`GuiSlot` integrates a vanilla inventory `Slot` inside `GuiBaseContainer`:

```java
for (Slot slot : inventorySlots.inventorySlots) {
    rootPanel.addChild(new GuiSlot(slot, this));
}
```

---

## 5. What to Avoid with Containers

| Anti-Pattern | Technical Root Cause | Correct Approach |
| :--- | :--- | :--- |
| Calling `scroll.setFlexDirection(...)` instead of `scroll.getContentPanel().setFlexDirection(...)` | Configures the outer viewport wrapper instead of the inner content container | Use `GuiScrollPanel.vertical(...)` or configure `getContentPanel()` |
| Placing tall lists or forms directly in `GuiPanel` without `GuiScrollPanel` | Content clips off-screen at GUI Scale 3x and 4x | Wrap all tall vertical flows inside `GuiScrollPanel` |
[/EN]
