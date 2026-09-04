---
title: "Containers And Panels"
project: "X4UI"
category: "Components"
categoryOrder: 4
---

[ES]
# Contenedores y Paneles

Este documento cubre los componentes contenedor: `GuiPanel`, `GuiScrollPanel`, `GuiVirtualList` y `GuiSlot`.

---

## GuiPanel

El componente contenedor principal. Actúa como una caja de diseño que contiene componentes hijos y delega el posicionamiento a un gestor de `FlexLayout`.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiPanel`

### Constructor

```java
new GuiPanel(int x, int y, int width, int height)
```

El layout predeterminado es `FlexDirection.ABSOLUTE` (los hijos usan sus propios valores de `x/y`).

### Uso Básico

```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiButton;

GuiPanel panel = new GuiPanel(10, 10, 200, 200);
panel.addChild(new GuiButton(10, 10, 80, 20, "Button A", null));
panel.addChild(new GuiButton(10, 40, 80, 20, "Button B", null));

rootPanel.addChild(panel);
```

### Layout Flex

```java
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.client.gui.utils.Insets;

GuiPanel sidebar = new GuiPanel(0, 0, 200, 400);
sidebar.setFlexDirection(FlexDirection.VERTICAL);
sidebar.setGap(4);
sidebar.setPadding(new Insets(8));

sidebar.addChild(new GuiButton(0, 0, 180, 20, "Home", null));
sidebar.addChild(new GuiButton(0, 0, 180, 20, "Settings", null));
sidebar.addChild(new GuiButton(0, 0, 180, 20, "About", null));
```

Los hijos se apilan de arriba a abajo con espacios de 4px dentro de un área con padding de 8px.

### Layout Horizontal

```java
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

GuiPanel toolbar = new GuiPanel(0, 0, 400, 30);
toolbar.setFlexDirection(FlexDirection.HORIZONTAL);
toolbar.setGap(2);

toolbar.addChild(new GuiButton(0, 0, 80, 20, "Bold", null));
toolbar.addChild(new GuiButton(0, 0, 80, 20, "Italic", null));
toolbar.addChild(new GuiButton(0, 0, 80, 20, "Underline", null));
```

### Flex Wrap

```java
GuiPanel grid = new GuiPanel(0, 0, 400, 300);
grid.setFlexDirection(FlexDirection.HORIZONTAL);
grid.setFlexWrap(true);
grid.setGap(5);

for (int i = 0; i < 20; i++) {
    grid.addChild(new GuiButton(0, 0, 80, 20, "Item " + i, null));
}
```

Los hijos saltan a la siguiente fila cuando exceden el ancho del panel.

### Tema Personalizado

```java
panel.setTheme(new ITheme() { /* ... */ });
```

Los temas se propagan a todos los hijos. Si un hijo no tiene un tema explícito, hereda del padre.

### Propiedades

| Método | Tipo | Descripción |
|--------|------|-------------|
| `setFlexDirection(FlexDirection)` | `void` | Establece la dirección del layout |
| `getFlexDirection()` | `FlexDirection` | Devuelve la dirección actual |
| `setGap(int)` | `void` | Establece el espaciado entre hijos |
| `setFlexWrap(boolean)` | `void` | Habilita el envolvimiento |

---

## GuiScrollPanel

Un contenedor desplazable con desplazamiento animado suave, barra de desplazamiento vertical y recorte OpenGL scissor.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiScrollPanel`

### Constructor

```java
new GuiScrollPanel(int x, int y, int width, int height)
```

### Uso Básico

```java
import com.x4yi.x4ui.client.gui.component.GuiScrollPanel;
import com.x4yi.x4ui.client.gui.component.GuiButton;

GuiScrollPanel scrollList = new GuiScrollPanel(10, 10, 200, 150);

for (int i = 0; i < 30; i++) {
    final int index = i;
    scrollList.addChild(new GuiButton(0, 0, 180, 20, "Item " + index, () -> {
        System.out.println("Clicked item " + index);
    }));
}

rootPanel.addChild(scrollList);
```

### Agregar y Eliminar Hijos

`addChild()`, `removeChild()` y `clearChildren()` delegan al `contentPanel` interno:

```java
scrollList.addChild(new GuiButton(0, 0, 180, 20, "New Item", null));
scrollList.clearChildren();
```

### Desplazamiento Programático

```java
scrollList.scrollToBottom();                    // Desplazamiento suave al fondo
scrollList.setScrollY(100);                     // Salto instantáneo a Y=100
scrollList.setTargetScrollY(200);               // Desplazamiento suave a Y=200
float currentScroll = scrollList.getScrollY();   // Posición actual de desplazamiento
int maxScroll = scrollList.getMaxScrollY();      // Rango máximo de desplazamiento
```

### Comportamiento de Desplazamiento

- La rueda del mouse desplaza por `scrollStep` píxeles (predeterminado: 22)
- El desplazamiento es animado con `scrollSpeed` (predeterminado: 0.2)
- El contenido se recorta mediante OpenGL scissor
- Se dibuja una barra de desplazamiento temática en el borde derecho

### Renderizado

- El contenido se renderiza dentro de una región scissor que coincide con los límites del panel
- Solo se renderizan los hijos visibles (los hijos fuera de pantalla se omiten)
- Pista de la barra de desplazamiento: `theme.getScrollbarTrackColor()`
- Pulgar de la barra de desplazamiento: `theme.getScrollbarThumbColor()`

### Interacción con GuiVideo y GuiImage

Los componentes como `GuiVideo` o `GuiImage` dentro de un `GuiScrollPanel` se recortan por la región scissor. Cuando se desplazan fuera de la vista, no se renderizan.

---

## GuiVirtualList

Una lista virtualizada de alto rendimiento que solo instancia componentes para los elementos actualmente visibles en el viewport de desplazamiento. Ideal para conjuntos de datos grandes (cientos o miles de elementos).

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiVirtualList`

### Constructor

```java
new GuiVirtualList(int x, int y, int width, int height, int itemHeight, Function<T, GuiComponent> builder)
```

- `itemHeight` -- Altura fija de cada elemento en píxeles
- `builder` -- Función que crea un `GuiComponent` para cada elemento

### Uso Básico

```java
import com.x4yi.x4ui.client.gui.component.GuiVirtualList;
import com.x4yi.x4ui.client.gui.component.GuiButton;

List<String> items = new ArrayList<>();
for (int i = 0; i < 1000; i++) {
    items.add("Item " + i);
}

GuiVirtualList<String> list = new GuiVirtualList<>(10, 10, 200, 300, 25, item ->
    new GuiButton(0, 0, 180, 20, item, () -> System.out.println("Clicked: " + item))
);

list.setItems(items);
rootPanel.addChild(list);
```

### Actualizar Elementos

```java
// Reemplazar todos los elementos
List<String> newItems = Arrays.asList("A", "B", "C");
list.setItems(newItems);
```

### Cómo Funciona

1. Solo los elementos dentro del rango de desplazamiento visible (más 2 extra para desplazamiento suave) se instancian.
2. Cuando los elementos se desplazan fuera de la vista, sus componentes se eliminan del árbol y se destruyen.
3. Cuando los elementos se desplazan a la vista, se crean nuevos componentes mediante la función `builder`.
4. El `contentPanel` usa layout `FlexDirection.ABSOLUTE`, con cada elemento posicionado en `index * itemHeight`.

### Características de Rendimiento

- **Memoria**: O(elementos visibles) en lugar de O(total de elementos)
- **Renderizado**: Solo se renderizan los elementos visibles cada frame
- **Layout**: Solo los elementos visibles participan en cálculos de layout
- **Creación**: Los componentes se crean/destruyen durante el desplazamiento (reciclados)

### Comparación con GuiScrollPanel

| Característica | GuiScrollPanel | GuiVirtualList |
|----------------|----------------|----------------|
| Hijos | Todos instanciados | Solo los visibles |
| Memoria | O(n) | O(visibles) |
| Agregar/eliminar | Inmediato | Diferido (basado en desplazamiento) |
| Caso de uso | Listas pequeñas (< 100) | Listas grandes (100+) |

---

## GuiSlot

Envuelve un `Slot` de Minecraft para posicionarlo dentro del árbol de componentes de X4UI. La posición del slot se sincroniza cada tick para coincidir con la posición absoluta del componente.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiSlot`

### Constructor

```java
new GuiSlot(Slot slot, GuiBaseContainer containerScreen)
```

### Uso

```java
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

// Dentro del initComponents() de un GuiBaseContainer
GuiPanel inventoryPanel = new GuiPanel(0, 0, 200, 150);
inventoryPanel.setFlexDirection(FlexDirection.VERTICAL);
inventoryPanel.setGap(2);

for (Slot slot : inventorySlots.inventorySlots) {
    inventoryPanel.addChild(new GuiSlot(slot, this));
}

rootPanel.addChild(inventoryPanel);
```

### Comportamiento

- Tamaño fijo: 18x18 píxeles
- Cada tick, `slot.xPos` y `slot.yPos` se actualizan para coincidir con la posición absoluta del componente menos el `guiLeft`/`guiTop` del contenedor
- Renderiza un fondo semitransparente (`0x55000000`) y borde (`0xFF333333`)

### Integración con GuiBaseContainer

`GuiSlot` requiere una referencia a `GuiBaseContainer` para acceder a `getGuiLeft()` y `getGuiTop()`. Esto asegura que la posición del slot sea correcta en relación con el fondo del contenedor vanilla.

### Integración con JEI

`GuiBaseContainer` provee `getJeiRecipeAreas()` para registrar áreas de transferencia de recetas compatibles con Just Enough Items (JEI).

```java
@Override
protected void initComponents() {
    // Agregar áreas de transferencia de recetas para JEI
    jeiRecipeAreas.add(new Rectangle(50, 20, 80, 80));
}
```
[/ES]

[EN]
# Containers and Panels

This document covers the container components: `GuiPanel`, `GuiScrollPanel`, `GuiVirtualList`, and `GuiSlot`.

---

## GuiPanel

The primary container component. Acts as a layout box that holds child components and delegates positioning to a `FlexLayout` manager.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiPanel`

### Constructor

```java
new GuiPanel(int x, int y, int width, int height)
```

The default layout is `FlexDirection.ABSOLUTE` (children use their own `x/y` values).

### Basic Usage

```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiButton;

GuiPanel panel = new GuiPanel(10, 10, 200, 200);
panel.addChild(new GuiButton(10, 10, 80, 20, "Button A", null));
panel.addChild(new GuiButton(10, 40, 80, 20, "Button B", null));

rootPanel.addChild(panel);
```

### Flex Layout

```java
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.client.gui.utils.Insets;

GuiPanel sidebar = new GuiPanel(0, 0, 200, 400);
sidebar.setFlexDirection(FlexDirection.VERTICAL);
sidebar.setGap(4);
sidebar.setPadding(new Insets(8));

sidebar.addChild(new GuiButton(0, 0, 180, 20, "Home", null));
sidebar.addChild(new GuiButton(0, 0, 180, 20, "Settings", null));
sidebar.addChild(new GuiButton(0, 0, 180, 20, "About", null));
```

Children are stacked top-to-bottom with 4px gaps inside an 8px padding area.

### Horizontal Layout

```java
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

GuiPanel toolbar = new GuiPanel(0, 0, 400, 30);
toolbar.setFlexDirection(FlexDirection.HORIZONTAL);
toolbar.setGap(2);

toolbar.addChild(new GuiButton(0, 0, 80, 20, "Bold", null));
toolbar.addChild(new GuiButton(0, 0, 80, 20, "Italic", null));
toolbar.addChild(new GuiButton(0, 0, 80, 20, "Underline", null));
```

### Flex Wrap

```java
GuiPanel grid = new GuiPanel(0, 0, 400, 300);
grid.setFlexDirection(FlexDirection.HORIZONTAL);
grid.setFlexWrap(true);
grid.setGap(5);

for (int i = 0; i < 20; i++) {
    grid.addChild(new GuiButton(0, 0, 80, 20, "Item " + i, null));
}
```

Children wrap to the next row when they exceed the panel's width.

### Custom Theme

```java
panel.setTheme(new ITheme() { /* ... */ });
```

Themes cascade to all children. If a child has no explicit theme, it inherits from its parent.

### Properties

| Method | Type | Description |
|--------|------|-------------|
| `setFlexDirection(FlexDirection)` | `void` | Sets layout direction |
| `getFlexDirection()` | `FlexDirection` | Returns current direction |
| `setGap(int)` | `void` | Sets spacing between children |
| `setFlexWrap(boolean)` | `void` | Enables wrapping |

---

## GuiScrollPanel

A scrollable container with smooth animated scrolling, vertical scrollbar, and OpenGL scissor clipping.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiScrollPanel`

### Constructor

```java
new GuiScrollPanel(int x, int y, int width, int height)
```

### Basic Usage

```java
import com.x4yi.x4ui.client.gui.component.GuiScrollPanel;
import com.x4yi.x4ui.client.gui.component.GuiButton;

GuiScrollPanel scrollList = new GuiScrollPanel(10, 10, 200, 150);

for (int i = 0; i < 30; i++) {
    final int index = i;
    scrollList.addChild(new GuiButton(0, 0, 180, 20, "Item " + index, () -> {
        System.out.println("Clicked item " + index);
    }));
}

rootPanel.addChild(scrollList);
```

### Adding and Removing Children

`addChild()`, `removeChild()`, and `clearChildren()` delegate to the internal `contentPanel`:

```java
scrollList.addChild(new GuiButton(0, 0, 180, 20, "New Item", null));
scrollList.clearChildren();
```

### Programmatic Scrolling

```java
scrollList.scrollToBottom();                    // Smooth scroll to bottom
scrollList.setScrollY(100);                     // Instant jump to Y=100
scrollList.setTargetScrollY(200);               // Smooth scroll to Y=200
float currentScroll = scrollList.getScrollY();   // Current scroll position
int maxScroll = scrollList.getMaxScrollY();      // Maximum scroll range
```

### Scroll Behavior

- Mouse wheel scrolls by `scrollStep` pixels (default: 22)
- Scrolling is animated with `scrollSpeed` (default: 0.2)
- Content is clipped via OpenGL scissor
- A themed scrollbar is drawn on the right edge

### Rendering

- Content is rendered inside a scissor region matching the panel's bounds
- Only visible children are rendered (off-screen children are skipped)
- Scrollbar track: `theme.getScrollbarTrackColor()`
- Scrollbar thumb: `theme.getScrollbarThumbColor()`

### Interaction with GuiVideo and GuiImage

Components like `GuiVideo` or `GuiImage` inside a `GuiScrollPanel` are clipped by the scissor region. When scrolled out of view, they are not rendered.

---

## GuiVirtualList

A high-performance virtualized list that only instantiates components for items currently visible in the scroll viewport. Ideal for large datasets (hundreds or thousands of items).

**Package:** `com.x4yi.x4ui.client.gui.component.GuiVirtualList`

### Constructor

```java
new GuiVirtualList(int x, int y, int width, int height, int itemHeight, Function<T, GuiComponent> builder)
```

- `itemHeight` -- Fixed height of each item in pixels
- `builder` -- Function that creates a `GuiComponent` for each item

### Basic Usage

```java
import com.x4yi.x4ui.client.gui.component.GuiVirtualList;
import com.x4yi.x4ui.client.gui.component.GuiButton;

List<String> items = new ArrayList<>();
for (int i = 0; i < 1000; i++) {
    items.add("Item " + i);
}

GuiVirtualList<String> list = new GuiVirtualList<>(10, 10, 200, 300, 25, item ->
    new GuiButton(0, 0, 180, 20, item, () -> System.out.println("Clicked: " + item))
);

list.setItems(items);
rootPanel.addChild(list);
```

### Updating Items

```java
// Replace all items
List<String> newItems = Arrays.asList("A", "B", "C");
list.setItems(newItems);
```

### How It Works

1. Only items within the visible scroll range (plus 2 extra for smooth scrolling) are instantiated.
2. When items scroll out of view, their components are removed from the tree and destroyed.
3. When items scroll into view, new components are created via the `builder` function.
4. The `contentPanel` uses `FlexDirection.ABSOLUTE` layout, with each item positioned at `index * itemHeight`.

### Performance Characteristics

- **Memory**: O(visible items) instead of O(total items)
- **Render**: Only visible items are rendered each frame
- **Layout**: Only visible items participate in layout calculations
- **Creation**: Components are created/destroyed during scrolling (recycled)

### Comparison with GuiScrollPanel

| Feature | GuiScrollPanel | GuiVirtualList |
|---------|---------------|----------------|
| Children | All instantiated | Only visible ones |
| Memory | O(n) | O(visible) |
| Add/remove | Immediate | Deferred (scroll-based) |
| Use case | Small lists (< 100) | Large lists (100+) |

---

## GuiSlot

Wraps a Minecraft `Slot` to position it within the X4UI component tree. The slot's position is synced each tick to match the component's absolute position.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiSlot`

### Constructor

```java
new GuiSlot(Slot slot, GuiBaseContainer containerScreen)
```

### Usage

```java
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

// Inside a GuiBaseContainer's initComponents()
GuiPanel inventoryPanel = new GuiPanel(0, 0, 200, 150);
inventoryPanel.setFlexDirection(FlexDirection.VERTICAL);
inventoryPanel.setGap(2);

for (Slot slot : inventorySlots.inventorySlots) {
    inventoryPanel.addChild(new GuiSlot(slot, this));
}

rootPanel.addChild(inventoryPanel);
```

### Behavior

- Fixed size: 18x18 pixels
- Each tick, `slot.xPos` and `slot.yPos` are updated to match the component's absolute position minus the container's `guiLeft`/`guiTop`
- Renders a semi-transparent background (`0x55000000`) and border (`0xFF333333`)

### Integration with GuiBaseContainer

`GuiSlot` requires a `GuiBaseContainer` reference to access `getGuiLeft()` and `getGuiTop()`. This ensures the slot position is correct relative to the vanilla container background.

### JEI Integration

`GuiBaseContainer` provides `getJeiRecipeAreas()` for registering recipe transfer areas compatible with Just Enough Items (JEI).

```java
@Override
protected void initComponents() {
    // Add recipe transfer areas for JEI
    jeiRecipeAreas.add(new Rectangle(50, 20, 80, 80));
}
```
[/EN]
