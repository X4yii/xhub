---
title: "Event System"
project: "X4UI"
category: "Core Concepts"
categoryOrder: 2
---

[ES]
# Sistema de Eventos

X4UI distribuye los clics, el teclado y el ratón automáticamente a través del árbol de componentes.

## Propagación y Prioridad

Cuando haces clic en la pantalla, el evento viaja desde el elemento principal hacia abajo.
Para evitar que presiones botones que están ocultos detrás de otros, se revisa la lista de hijos en orden inverso (los elementos con mayor capa o `layer` se comprueban primero).

### Cancelación
Si un componente maneja el evento de clic (es decir, el método devuelve `true`), el proceso se detiene inmediatamente. Esto evita que el clic "atraviese" la interfaz.

## Interacciones Principales

Los componentes pueden usar estos métodos:

- `mouseClicked`: Cuando se presiona un botón del ratón.
- `mouseReleased`: Cuando se suelta el botón.
- `mouseClickMove`: Cuando se arrastra el ratón presionado. Útil para barras de desplazamiento.
- `handleMouseScroll`: Cuando se usa la rueda del ratón.
- `keyTyped`: Cuando se presiona una tecla.

## Requisitos para Interceptar Eventos

Para que un componente detecte clics:
1. Debe estar visible (`visible = true`).
2. Debe estar habilitado (`enabled = true`).
3. El ratón debe estar dentro de su área (`isMouseOver`).

[/ES]

[EN]
# Event System

X4UI automatically distributes clicks, keyboard input, and mouse interactions through the component tree.

## Propagation and Priority

When you click the screen, the event travels from the main element downwards.
To prevent pressing buttons that are hidden behind others, the child list is checked in reverse order (elements with a higher `layer` are checked first).

### Cancellation
If a component handles the click event (meaning the method returns `true`), the process stops immediately. This prevents the click from "passing through" the interface.

## Main Interactions

Components can override these methods:

- `mouseClicked`: When a mouse button is pressed.
- `mouseReleased`: When the button is released.
- `mouseClickMove`: When the mouse is dragged while holding a button. Useful for scrollbars.
- `handleMouseScroll`: When the mouse wheel is used.
- `keyTyped`: When a key is pressed.

## Requirements for Intercepting Events

For a component to detect clicks:
1. It must be visible (`visible = true`).
2. It must be enabled (`enabled = true`).
3. The mouse must be hovering over its area (`isMouseOver`).

[/EN]
