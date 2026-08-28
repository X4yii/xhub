---
title: "Spacing"
project: "X4UI"
category: "Layout"
categoryOrder: 3
---

[ES]
# Margin vs Padding

Para ajustar el espaciado, todos los componentes tienen `margin` (margen) y `padding` (relleno), funcionando igual que en CSS web.

## Padding (Espacio Interior)

El `padding` empuja el contenido hacia adentro del componente. Solo tiene efecto en contenedores que organizan elementos, como el `GuiPanel`.

Si un panel tiene `padding(5)`, empezará a colocar a sus hijos a 5 píxeles de distancia de sus bordes, dejando un margen interno vacío.

## Margin (Espacio Exterior)

El `margin` empuja a los elementos que están alrededor. Funciona como un escudo protector fuera del componente.

Si tienes dos botones apilados en un panel, y el primer botón tiene `margin(2)`, el panel añadirá 2 píxeles extra de espacio antes y después de ese botón.

## Notas de Rendimiento

Cambiar el `margin` o el `padding` en tiempo real marca automáticamente al componente como modificado (`markDirty()`). Esto le dice al panel que debe recalcular las posiciones en el siguiente frame de forma eficiente.

[/ES]

[EN]
# Margin vs Padding

To adjust spacing, all components have `margin` and `padding`, working just like web CSS.

## Padding (Inner Space)

`padding` pushes the content inward. It only has an effect on containers that organize elements, like `GuiPanel`.

If a panel has `padding(5)`, it will start placing its children 5 pixels away from its edges, leaving an empty inner margin.

## Margin (Outer Space)

`margin` pushes surrounding elements away. It works like a protective shield outside the component.

If you have two stacked buttons in a panel, and the first button has `margin(2)`, the panel will add 2 extra pixels of space before and after that button.

## Performance Notes

Changing `margin` or `padding` in real-time automatically marks the component as modified (`markDirty()`). This tells the parent panel that it needs to recalculate positions efficiently on the next frame.

[/EN]
