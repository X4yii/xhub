---
title: "Component Tree"
project: "X4UI"
category: "Core Concepts"
categoryOrder: 2
---

[ES]
# Component Tree (Árbol de Componentes)

Todos los elementos en X4UI son instancias de `GuiComponent` y se organizan como un árbol jerárquico mediante relaciones Padre e Hijo.

## Jerarquía

Todo componente puede contener múltiples hijos. Al usar `B.addChild(A)`:

1. Se asigna a `A` quién es su padre (`B`).
2. Se añade `A` a la lista interna del padre.
3. Se invoca `markDirty()`, obligando al sistema a recalcular posiciones en el siguiente frame.

## Fases de Procesamiento

El árbol se procesa en tres fases desde el panel raíz:

### 1. Update (`update()`)
Ejecutado cada frame de arriba hacia abajo. Si un componente cambió (marcado como "sucio"), recalcula sus matemáticas antes de actualizar a sus hijos.

### 2. Draw (`drawComponent()`)
Ordena la lista de hijos según su propiedad de capa (`layer` o Z-Index) de menor a mayor. Dibuja el padre, luego los hijos. Los elementos con capa mayor se dibujan por encima.

### 3. Eventos (Clics y Teclas)
Se evalúan en orden inverso (de mayor a menor capa). Esto garantiza que el componente que se ve por encima de los demás intercepte el clic antes que los componentes de fondo.

[/ES]

[EN]
# Component Tree

All elements in X4UI are instances of `GuiComponent` and are organized as a hierarchical tree through Parent and Child relationships.

## Hierarchy

Every component can hold multiple children. When using `B.addChild(A)`:

1. `A` is assigned its parent (`B`).
2. `A` is added to the parent's internal child list.
3. `markDirty()` is invoked, forcing the system to recalculate positions on the next frame.

## Processing Phases

The tree is processed in three phases starting from the root panel:

### 1. Update (`update()`)
Executed every frame from top to bottom. If a component changed (marked as "dirty"), it recalculates its math before updating its children.

### 2. Draw (`drawComponent()`)
Sorts the child list by their layer property (`layer` or Z-Index) from lowest to highest. It draws the parent, then the children. Elements with a higher layer are drawn on top.

### 3. Events (Clicks and Keys)
Evaluated in reverse order (from highest to lowest layer). This ensures that the component visually on top intercepts the click before background components do.

[/EN]
