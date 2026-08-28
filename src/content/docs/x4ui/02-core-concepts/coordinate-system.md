---
title: "Coordinate System"
project: "X4UI"
category: "Core Concepts"
categoryOrder: 2
---

[ES]
# Coordinate System (Sistema de Coordenadas)

A diferencia de Vanilla, X4UI usa coordenadas **relativas**.

## Relativas vs Absolutas

Las propiedades `x` e `y` de un `GuiComponent` son siempre **relativas a la esquina superior izquierda de su Padre.**

### Ejemplo:
Si el `Panel A` está en la posición `(X: 50, Y: 50)` de la pantalla, y le agregas un `Button B` en su posición local `(X: 10, Y: 10)`, X4UI dibujará el botón en la pantalla real en `(X: 60, Y: 60)`.

## Funciones Clave

Para obtener la posición real en la pantalla durante el renderizado, usa:

- `getAbsoluteX()`
- `getAbsoluteY()`

Estos métodos suman automáticamente todas las coordenadas `x` e `y` desde el componente hasta el elemento raíz. Ten en cuenta que `margin` y `padding` **no** se incluyen en este cálculo; se aplican por separado por el motor de layout del padre (`GuiPanel.layoutChildren()`).

### Reglas
- Al crear componentes dentro de paneles FlexBox, no te preocupes por sus coordenadas `x` e `y`; el panel las sobrescribirá.
- Si creas un componente personalizado y sobrescribes `drawSelf`, **siempre** usa `getAbsoluteX()` y `getAbsoluteY()` para dibujar cosas en pantalla con OpenGL.

[/ES]

[EN]
# Coordinate System

Unlike Vanilla, X4UI uses **relative** coordinates.

## Relative vs Absolute

The `x` and `y` properties of a `GuiComponent` are always **relative to the top-left corner of its Parent.**

### Example:
If `Panel A` is at screen position `(X: 50, Y: 50)`, and you add `Button B` at local position `(X: 10, Y: 10)`, X4UI will draw the button on the real screen at `(X: 60, Y: 60)`.

## Key Functions

To get the real screen position during rendering, use:

- `getAbsoluteX()`
- `getAbsoluteY()`

These methods automatically sum up all `x` and `y` coordinates from the component up to the root element. Note that `margin` and `padding` are **not** included in this calculation; they are applied separately by the parent's layout engine (`GuiPanel.layoutChildren()`).

### Rules
- When creating components inside FlexBox panels, don't worry about their `x` and `y` coordinates; the panel will overwrite them.
- If you create a custom component and override `drawSelf`, **always** use `getAbsoluteX()` and `getAbsoluteY()` to draw things on the screen with OpenGL.

[/EN]
