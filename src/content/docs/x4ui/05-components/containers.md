---
title: "Containers"
project: "X4UI"
category: "Components"
categoryOrder: 5
---

[ES]
# Containers (Contenedores)

Los contenedores se encargan de organizar y limitar el tamaño de los elementos que guardan en su interior.

## GuiPanel

Es el contenedor principal. Funciona como un `<div>` en diseño web.

### Organización (Layout)
Usa `setFlexDirection()` para cambiar cómo organiza a sus hijos:
- `ABSOLUTE`: No organiza a los hijos. Cada hijo decide dónde va.
- `HORIZONTAL`: Coloca a los hijos en fila, de izquierda a derecha.
- `VERTICAL`: Apila a los hijos de arriba hacia abajo.

Si activas `setFlexWrap(true)`, el panel saltará a la siguiente línea o columna si los elementos ya no caben en la pantalla.

## GuiScrollPanel

Es una versión avanzada de `GuiPanel` que añade una barra de desplazamiento (Scroll) y oculta visualmente lo que quede fuera de su caja.

### ¿Cómo funciona el Scroll?
Cuando añades un componente a un `GuiScrollPanel`, en realidad se añade a un panel oculto más grande en su interior (`contentPanel`). 

### Recorte (Clipping)
Para evitar que los textos o botones se salgan de la caja al hacer scroll, el panel usa una función de OpenGL llamada `GL_SCISSOR_TEST`. Esto corta visualmente todo lo que quede fuera de los bordes.

### Uso del Ratón
Si el contenido es más alto que la caja, el panel dibuja automáticamente una barra a la derecha y permite usar la rueda del ratón para subir o bajar el contenido de forma suave (Smooth Scrolling).

[/ES]

[EN]
# Containers

Containers are in charge of organizing and limiting the size of the elements inside them.

## GuiPanel

This is the main container. It works like a `<div>` in web design.

### Layout
Use `setFlexDirection()` to change how it organizes its children:
- `ABSOLUTE`: Does not organize children. Each child decides where it goes.
- `HORIZONTAL`: Places children in a row, from left to right.
- `VERTICAL`: Stacks children from top to bottom.

If you enable `setFlexWrap(true)`, the panel will jump to the next line or column if the elements no longer fit on the screen.

## GuiScrollPanel

It is an advanced version of `GuiPanel` that adds a scrollbar and visually hides whatever falls outside its box.

### How does Scrolling work?
When you add a component to a `GuiScrollPanel`, it is actually added to a larger hidden panel inside it (`contentPanel`). 

### Clipping
To prevent texts or buttons from overflowing the box when scrolling, the panel uses an OpenGL function called `GL_SCISSOR_TEST`. This visually cuts off everything outside the edges.

### Mouse Usage
If the content is taller than the box, the panel automatically draws a scrollbar on the right and allows using the mouse wheel to scroll up or down smoothly.

[/EN]
