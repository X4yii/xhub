---
title: "Containers And Panels"
project: "X4UI"
category: "Components"
categoryOrder: 4
---

[ES]
# Contenedores y Paneles

Este documento cubre los componentes contenedores fundamentales de X4UI: `GuiPanel`, `GuiScrollPanel`, `GuiVirtualList` y `GuiSlot`.

---

## GuiPanel

El bloque de construcción estructural fundamental. Aloja componentes hijos y gestiona su disposición mediante `FlexLayout` o coordenadas locales.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiPanel`

### Constructor y Configuración
```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.client.gui.utils.Insets;

GuiPanel panel = new GuiPanel(10, 10, 240, 320);
panel.setFlexDirection(FlexDirection.VERTICAL);
panel.setGap(6);
panel.setPadding(new Insets(8));

panel.addChild(new GuiButton(0, 0, 200, 20, "Opción 1", () -> {}));
panel.addChild(new GuiButton(0, 0, 200, 20, "Opción 2", () -> {}));

rootPanel.addChild(panel);
```

---

## GuiScrollPanel

Un panel con viewport recortado mediante hardware scissor, desplazamiento suave interpolado, soporte para rueda del ratón y barra de desplazamiento interactiva arrastrable.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiScrollPanel`

### Constructor y Operaciones
```java
import com.x4yi.x4ui.client.gui.component.GuiScrollPanel;

GuiScrollPanel scrollList = new GuiScrollPanel(10, 10, 220, 200);

for (int i = 0; i < 50; i++) {
    final int idx = i;
    scrollList.addChild(new GuiButton(0, 0, 190, 20, "Elemento #" + idx, () -> {
        System.out.println("Seleccionado: " + idx);
    }));
}

rootPanel.addChild(scrollList);
```

### Sesión de Desplazamiento Bloqueada (Sticky Scroll Session)
En X4UI r1.0b5, cuando el usuario interactúa con la rueda del ratón sobre un panel con scroll anidado, el foco de desplazamiento se bloquea temporalmente al panel bajo el cursor para evitar transferencias erráticas al panel padre.

---

## GuiVirtualList

Una lista virtualizada de alto rendimiento basada en el patrón *ViewHolder*. En lugar de instanciar cientos o miles de componentes en memoria, solo mantiene creados aquellos elementos visibles en el viewport actual.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiVirtualList`

### Constructor y Uso
```java
import com.x4yi.x4ui.client.gui.component.GuiVirtualList;
import com.x4yi.x4ui.client.gui.component.GuiButton;

List<String> items = new ArrayList<>();
for (int i = 0; i < 5000; i++) {
    items.add("Registro " + i);
}

// itemHeight: 24 px por fila fija
GuiVirtualList<String> virtualList = new GuiVirtualList<>(
    10, 10, 250, 300, 24,
    item -> new GuiButton(0, 0, 230, 20, item, () -> System.out.println("Click en " + item))
);

virtualList.setItems(items);
rootPanel.addChild(virtualList);
```

---

## GuiSlot

Envuelve un `Slot` de Minecraft vanilla permitiendo ubicarlo dentro de la jerarquía visual de X4UI. En cada tick, `GuiSlot` sincroniza sus coordenadas locales calculando la posición absoluta en pantalla y trasladándola a `slot.xPos` y `slot.yPos`.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiSlot`

```java
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import net.minecraft.inventory.Slot;

// Dentro de un GuiBaseContainer
for (Slot slot : inventorySlots.inventorySlots) {
    gridPanel.addChild(new GuiSlot(slot, this));
}
```

---

## Qué Evitar Hacer (Antipatrones en Contenedores)

> [!CAUTION]
> **1. NUNCA agregar miles de hijos a un `GuiPanel` convencional.**
> Si tiene más de 100 elementos (ej. listas enormes), utilice siempre `GuiVirtualList` para reciclar memoria.

> [!WARNING]
> **2. NUNCA alojar un `GuiVirtualList` sin altura definida.**
> Requiere un límite espacial para saber cuántos elementos renderizar.

> [!WARNING]
> **3. NUNCA modificar `xPos`/`yPos` de un `Slot` de Minecraft.**
> Si utiliza `GuiSlot`, este tomará el control absoluto de las coordenadas y anulará cualquier cambio manual.
[/ES]

[EN]
# Containers & Panels

This document covers X4UI's fundamental layout containers: `GuiPanel`, `GuiScrollPanel`, `GuiVirtualList`, and `GuiSlot`.

---

## GuiPanel

The primary structural container. Groups child components and manages their layout via `FlexLayout` or relative coordinates.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiPanel`

### Constructor & Configuration
```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.client.gui.utils.Insets;

GuiPanel panel = new GuiPanel(10, 10, 240, 320);
panel.setFlexDirection(FlexDirection.VERTICAL);
panel.setGap(6);
panel.setPadding(new Insets(8));

panel.addChild(new GuiButton(0, 0, 200, 20, "Option 1", () -> {}));
panel.addChild(new GuiButton(0, 0, 200, 20, "Option 2", () -> {}));

rootPanel.addChild(panel);
```

---

## GuiScrollPanel

A container featuring hardware scissor clipping, smooth interpolated scrolling, mouse wheel support, and an interactive draggable scrollbar.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiScrollPanel`

### Constructor & Operations
```java
import com.x4yi.x4ui.client.gui.component.GuiScrollPanel;

GuiScrollPanel scrollList = new GuiScrollPanel(10, 10, 220, 200);

for (int i = 0; i < 50; i++) {
    final int idx = i;
    scrollList.addChild(new GuiButton(0, 0, 190, 20, "Item #" + idx, () -> {
        System.out.println("Selected: " + idx);
    }));
}

rootPanel.addChild(scrollList);
```

### Sticky Scroll Sessions
In X4UI r1.0b5, mouse-wheel scrolling over nested scrollable panels temporarily locks focus to the targeted child panel, preventing erratic scroll transfers to parent containers.

---

## GuiVirtualList

A high-performance virtualized list implementing the *ViewHolder* pattern. Rather than allocating components for thousands of rows, it only instantiates widgets currently visible within the scroll viewport.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiVirtualList`

### Constructor & Usage
```java
import com.x4yi.x4ui.client.gui.component.GuiVirtualList;
import com.x4yi.x4ui.client.gui.component.GuiButton;

List<String> items = new ArrayList<>();
for (int i = 0; i < 5000; i++) {
    items.add("Entry " + i);
}

// Fixed 24 px row height
GuiVirtualList<String> virtualList = new GuiVirtualList<>(
    10, 10, 250, 300, 24,
    item -> new GuiButton(0, 0, 230, 20, item, () -> System.out.println("Clicked " + item))
);

virtualList.setItems(items);
rootPanel.addChild(virtualList);
```

---

## GuiSlot

Wraps a vanilla Minecraft `Slot`, seamlessly positioning it within the X4UI component tree. On each game tick, `GuiSlot` synchronizes its screen position into `slot.xPos` and `slot.yPos`.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiSlot`

```java
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import net.minecraft.inventory.Slot;

// Inside GuiBaseContainer
for (Slot slot : inventorySlots.inventorySlots) {
    gridPanel.addChild(new GuiSlot(slot, this));
}
```

---

## What to Avoid (Container Pitfalls)

> [!CAUTION]
> **1. NEVER populate standard `GuiPanel` with thousands of items.**
> When rendering large datasets (100+ items), always use `GuiVirtualList` to recycle memory.

> [!WARNING]
> **2. NEVER place a `GuiVirtualList` inside a container with zero height.**
> Virtualization requires a definite spatial bound to know how many rows to render.

> [!WARNING]
> **3. NEVER manually mutate `slot.xPos` or `slot.yPos` when using `GuiSlot`.**
> `GuiSlot` takes absolute ownership of coordinates; manual assignments will be overridden.
[/EN]
