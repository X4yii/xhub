---
title: "What Is X4Ui"
project: "X4UI"
category: "Introduction"
categoryOrder: 0
---

[ES]
# ¿Qué es X4UI?

X4UI es un framework de interfaces gráficas (GUI) para Minecraft Forge 1.12.2. Simplifica la creación de menús reemplazando el sistema rígido de Vanilla por un modelo basado en componentes (DOM), similar al desarrollo web.

## Características Principales

* **Arquitectura de Árbol (DOM)**: Interfaces construidas organizando componentes dentro de otros componentes (padres e hijos).
* **Layout FlexBox**: Posicionamiento automático y espaciado dinámico. No necesitas calcular manualmente las coordenadas X e Y.
* **Alto Rendimiento**: El sistema de *Dirty Flags* asegura que el layout y el renderizado solo se recalculen cuando un componente realmente cambia.
* **Eventos Robustos**: Los clics y el teclado respetan el orden visual (Z-Index). Un clic no atravesará ventanas superpuestas.
* **Reactividad (`State<T>`)**: Variables que notifican automáticamente a la UI cuando su valor cambia.

[/ES]

[EN]
# What is X4UI?

X4UI is a Graphical User Interface (GUI) framework for Minecraft Forge 1.12.2. It simplifies menu creation by replacing the rigid Vanilla system with a Component Object Model (DOM), similar to modern web development.

## Main Features

* **Tree Architecture (DOM)**: Interfaces are built by nesting components inside other components (parents and children).
* **FlexBox Layout**: Automatic positioning and dynamic spacing. No manual X and Y coordinate math is needed.
* **High Performance**: The *Dirty Flags* system ensures layout and rendering are only recalculated when a component actually changes.
* **Robust Events**: Mouse clicks and key presses respect visual ordering (Z-Index). A click will not pass through overlapping windows.
* **Reactivity (`State<T>`)**: Variables that automatically notify the UI when their value changes.

[/EN]
