---
title: "Flexbox Model"
project: "X4UI"
category: "Layout"
categoryOrder: 3
---

[ES]
# Sistema FlexBox (`GuiPanel`)

X4UI incluye un sistema de diseño (layout) automático similar a Flexbox en la web, usando el contenedor `GuiPanel`.

## Direcciones (`FlexDirection`)

Existen tres formas en las que un panel puede organizar a sus hijos:

* `ABSOLUTE`: El panel no organiza a sus hijos. Cada hijo usa sus propias coordenadas `x` e `y`.
* `HORIZONTAL`: Los hijos se organizan automáticamente en fila, de izquierda a derecha. Ignoran sus propias coordenadas `x` e `y`.
* `VERTICAL`: Los hijos se apilan automáticamente de arriba hacia abajo.

## Espaciado Automático (`Gap`)

Cuando usas `VERTICAL` o `HORIZONTAL`, puedes añadir espacio entre los elementos con la propiedad `gap`.

```java
GuiPanel menu = new GuiPanel(0, 0, 100, 200);
menu.setFlexDirection(FlexDirection.VERTICAL);
menu.setGap(5); // 5 píxeles de separación entre cada hijo
```

## Saltos de Línea (`FlexWrap`)

Si añades muchos elementos, se saldrán del tamaño del panel. Para evitar esto, usa `flexWrap`.

```java
menu.setFlexWrap(true);
```

Cuando un elemento ya no cabe en el panel, automáticamente salta a la siguiente columna (si es `VERTICAL`) o a la siguiente fila (si es `HORIZONTAL`). Es muy útil para hacer cuadrículas o inventarios.

## Auto-Ajuste del Panel

Al terminar de organizar a los hijos, el `GuiPanel` ajustará su propio ancho y alto para envolver exactamente el contenido que tiene dentro. Esto permite que los menús crezcan solos según los datos que contengan.

[/ES]

[EN]
# FlexBox System (`GuiPanel`)

X4UI includes an automatic layout system similar to Flexbox on the web, using the `GuiPanel` container.

## Directions (`FlexDirection`)

There are three ways a panel can organize its children:

* `ABSOLUTE`: The panel does not organize its children. Each child uses its own `x` and `y` coordinates.
* `HORIZONTAL`: Children are automatically organized in a row, from left to right. They ignore their own `x` and `y` coordinates.
* `VERTICAL`: Children are automatically stacked from top to bottom.

## Automatic Spacing (`Gap`)

When using `VERTICAL` or `HORIZONTAL`, you can add space between elements with the `gap` property.

```java
GuiPanel menu = new GuiPanel(0, 0, 100, 200);
menu.setFlexDirection(FlexDirection.VERTICAL);
menu.setGap(5); // 5 pixels of separation between each child
```

## Line Breaks (`FlexWrap`)

If you add too many elements, they will overflow the panel's size. To prevent this, use `flexWrap`.

```java
menu.setFlexWrap(true);
```

When an element no longer fits in the panel, it automatically jumps to the next column (if `VERTICAL`) or the next row (if `HORIZONTAL`). This is very useful for making grids or inventories.

## Panel Auto-Sizing

After organizing the children, the `GuiPanel` will adjust its own width and height to exactly wrap the content inside it. This allows menus to grow dynamically based on the data they contain.

[/EN]
