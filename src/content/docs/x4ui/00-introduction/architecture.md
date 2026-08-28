---
title: "Architecture"
project: "X4UI"
category: "Introduction"
categoryOrder: 0
---

[ES]
# Arquitectura

X4UI se basa en un árbol jerárquico de componentes, ocultando las llamadas complejas a OpenGL.

## Component Tree (DOM)

Toda interfaz tiene un nodo raíz que contiene componentes hijos. Estos hijos pueden contener más hijos.

La clase principal es `GuiComponent`. Todos los elementos heredan de ella:
- **Contenedores**: Agrupan elementos (`GuiPanel`, `GuiScrollPanel`).
- **Interactivos**: Reciben clics o input (`GuiButton`, `GuiToggle`).
- **Visuales**: Muestran información (`GuiSprite`, `GuiLabel`).

## Ciclo de Vida

1. **Creación**: Instancias el componente en código.
2. **Montaje**: Lo añades a un padre usando `addChild()`.
3. **Update**: Ejecutado cada frame mediante `update()`. Aquí se calculan layouts y animaciones.
4. **Draw**: Renderizado mediante `drawComponent()`. Primero el componente se dibuja a sí mismo (`drawSelf()`), luego dibuja sus hijos ordenados por `layer` de menor a mayor (así las capas más altas quedan por encima).
5. **Eventos**: Los clics se procesan de mayor a menor capa (top-down), asegurando que el elemento superior intercepte el clic primero.

## Optimización (Dirty Flags)

X4UI utiliza indicadores (*flags*) booleanos para ahorrar CPU:
- `needsLayout`: Verdadero si el tamaño, márgenes o visibilidad cambian. Obliga al padre a recalcular posiciones.
- `needsRenderSort`: Verdadero si cambia la capa (`layer`). Evita reordenar elementos en cada frame.

Llamar a `markDirty()` en un componente activa estas banderas hacia arriba en el árbol.

[/ES]

[EN]
# Architecture

X4UI relies on a hierarchical component tree, hiding complex OpenGL calls.

## Component Tree (DOM)

Every interface has a root node that contains child components. These children can contain more children.

The main class is `GuiComponent`. Every element inherits from it:
- **Containers**: Group elements together (`GuiPanel`, `GuiScrollPanel`).
- **Interactives**: Receive clicks or input (`GuiButton`, `GuiToggle`).
- **Visuals**: Display information (`GuiSprite`, `GuiLabel`).

## Lifecycle

1. **Creation**: Instantiate the component in code.
2. **Mounting**: Add it to a parent using `addChild()`.
3. **Update**: Executed every frame via `update()`. Layouts and animations are computed here.
4. **Draw**: Rendered via `drawComponent()`. First the component draws itself (`drawSelf()`), then it draws its children sorted by `layer` from lowest to highest (so higher layers appear on top).
5. **Events**: Clicks are processed from highest to lowest layer (top-down), ensuring the top-most element intercepts the click first.

## Optimization (Dirty Flags)

X4UI uses boolean flags to save CPU time:
- `needsLayout`: True if size, margins, or visibility changes. Forces the parent to recalculate positions.
- `needsRenderSort`: True if the `layer` changes. Avoids sorting elements every single frame.

Calling `markDirty()` on a component pushes these flags up the tree.

[/EN]
