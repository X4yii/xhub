---
title: "Advanced Components"
project: "X4UI"
category: "Components"
categoryOrder: 1
order: 3
---

[ES]
# Componentes Avanzados (`GuiVirtualList`, `GuiDropdown`, `GuiMarkdown`, `GuiModelRender`, `GuiTooltip`)

Componentes especializados para listas masivas recicladas, selección desplegable, renderizado Markdown, modelos 3D con depth buffer y tooltips contextuales.

---

## 1. `GuiVirtualList<T>`

Implementa **reciclaje de vistas (*View Recycling*)**: solo instancia y dibuja las filas visibles en el viewport actual, manteniendo uso constante de memoria incluso con miles de registros. En `r1.0b7`, redimensionar la lista invalida el rango visible automáticamente y `setItems(...)` recicla las vistas activas hacia el pool en lugar de descartarlas:

```java
class Entry {
    final String name;
    Entry(String name) { this.name = name; }
}

GuiVirtualList<Entry> list = new GuiVirtualList<Entry>(
    0, 0, 0, 240, 24,
    // Builder: instancia una fila visible (debe usar withPercentWidth(1.0f))
    item -> GuiLabel.of(item.name, 0xFFE6E8EC).withPercentWidth(1.0f),
    // Binder: actualiza la fila reciclada al hacer scroll
    (comp, item) -> ((GuiLabel) comp).setText(item.name)
);
list.withPercentWidth(1.0f);
list.setItems(entries);
```

---

## 2. `GuiDropdown<T>`

Selector desplegable enlazado a un `State<T>` y a una lista de opciones:

```java
State<String> selectedMode = new State<>("Normal");
List<String> modes = Arrays.asList("Normal", "Compacto", "Avanzado");

GuiDropdown<String> dropdown = GuiDropdown.of(selectedMode, modes)
    .withPercentWidth(1.0f);
```

---

## 3. `GuiMarkdown`

Renderiza texto enriquecido (encabezados, listas, código, enlaces y separadores) respetando el ancho del contenedor y la fuente asignada. En `r1.0b7`, `GuiMarkdown` recalcula el ajuste de líneas automáticamente en `onBoundsChanged()` al cambiar de ancho bajo `withPercentWidth(...)` o `FlexLayout` (`flexGrow`/`flexShrink`):

```java
GuiMarkdown docView = new GuiMarkdown(0, 0, 0, "# Guía\nContenido **enriquecido**.")
    .withFont("roboto_regular");
docView.withPercentWidth(1.0f);
```

---

## 4. `GuiModelRender` y `GuiTooltip`

- **`GuiModelRender`:** renderiza entidades (`setEntity`) o ítems (`setItemStack`) en 3D limpiando el buffer de profundidad de forma segura (`IGraphics.clearDepthBuffer()`), con soporte de escala (`setScale`), rotación (`setRotation`) y arrastre (`setAllowDragRotation`).
- **`GuiTooltip`:** componente de tooltip flotante configurable también mediante `.withTooltip(...)` en cualquier `GuiComponent`.

---

## 5. Qué Evitar en Componentes Avanzados

| Antipatrón | Causa Técnica del Problema | Solución Correcta |
| :--- | :--- | :--- |
| Omitir `.withPercentWidth(1.0f)` en el lambda builder de `GuiVirtualList` | La fila conserva ancho `0` y no se renderiza | Devolver el componente raíz de cada fila con `.withPercentWidth(1.0f)` |
| Instanciar miles de `GuiPanel` en `GuiScrollPanel` para datos tabulares | Satura memoria y tiempo de layout | Utilizar `GuiVirtualList<T>` con reciclaje de vistas |
[/ES]

[EN]
# Advanced Components (`GuiVirtualList`, `GuiDropdown`, `GuiMarkdown`, `GuiModelRender`, `GuiTooltip`)

Specialized widgets for recycled large lists, dropdown selection, Markdown rendering, depth-cleared 3D models, and contextual tooltips.

---

## 1. `GuiVirtualList<T>`

Implements **View Recycling**: only visible rows inside the viewport are instantiated and rendered, keeping memory and layout cost constant even with thousands of entries. In `r1.0b7`, resizing invalidates the visible range automatically and `setItems(...)` recycles active views back into the pool instead of discarding them:

```java
class Entry {
    final String name;
    Entry(String name) { this.name = name; }
}

GuiVirtualList<Entry> list = new GuiVirtualList<Entry>(
    0, 0, 0, 240, 24,
    // Builder: instantiates a visible row (must use withPercentWidth(1.0f))
    item -> GuiLabel.of(item.name, 0xFFE6E8EC).withPercentWidth(1.0f),
    // Binder: rebinds recycled rows during scrolling
    (comp, item) -> ((GuiLabel) comp).setText(item.name)
);
list.withPercentWidth(1.0f);
list.setItems(entries);
```

---

## 2. `GuiDropdown<T>`

Dropdown selector bound directly to a `State<T>` and an option list:

```java
State<String> selectedMode = new State<>("Normal");
List<String> modes = Arrays.asList("Normal", "Compact", "Advanced");

GuiDropdown<String> dropdown = GuiDropdown.of(selectedMode, modes)
    .withPercentWidth(1.0f);
```

---

## 3. `GuiMarkdown`

Renders formatted Markdown (headings, lists, code, links, separators) adapting to container width and assigned `IFont`. In `r1.0b7`, `GuiMarkdown` automatically re-wraps lines in `onBoundsChanged()` whenever its width changes under `withPercentWidth(...)` or `FlexLayout` (`flexGrow`/`flexShrink`):

```java
GuiMarkdown docView = new GuiMarkdown(0, 0, 0, "# Guide\nFormatted **content**.")
    .withFont("roboto_regular");
docView.withPercentWidth(1.0f);
```

---

## 4. `GuiModelRender` & `GuiTooltip`

- **`GuiModelRender`:** renders 3D entities (`setEntity`) or item stacks (`setItemStack`) with safe depth buffer clearing (`IGraphics.clearDepthBuffer()`), scaling (`setScale`), rotation (`setRotation`), and drag interaction (`setAllowDragRotation`).
- **`GuiTooltip`:** floating tooltip widget, also configurable via `.withTooltip(...)` on any `GuiComponent`.

---

## 5. What to Avoid with Advanced Components

| Anti-Pattern | Technical Root Cause | Correct Approach |
| :--- | :--- | :--- |
| Omitting `.withPercentWidth(1.0f)` in `GuiVirtualList`'s builder lambda | Row retains width `0` and renders invisible | Return each row root with `.withPercentWidth(1.0f)` |
| Populating `GuiScrollPanel` with thousands of `GuiPanel` children | Exhausts memory and slows layout passes | Use `GuiVirtualList<T>` with view recycling |
[/EN]
