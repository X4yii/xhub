---
title: "X4UI Framework - Manual de desarrollo"
project: "X4UI"
category: "General"
categoryOrder: -1
order: 1
---

[ES]
# Sobre X4UI

¿Cansado de lidiar con coordenadas estáticas (hardcodeadas), sobreescrituras desordenadas de `drawScreen` e infinitos bugs en el arcaico sistema de interfaces de Vanilla Minecraft 1.12.2?

**X4UI** es un framework de interfaces de usuario dinámico, flexible e independiente, extraído del mod *Hammers Unbound*. Trae consigo los paradigmas de desarrollo web modernos (como diseños FlexBox, estructuras en árbol DOM y propagación de eventos) directamente a Forge 1.12.2.

## Características Principales

- **Arquitectura DOM:** Construye tu interfaz anidando componentes (`rootPanel.addChild(new GuiButton(...))`).
- **Diseños FlexBox:** `GuiPanel` soporta apilamiento automático `VERTICAL` y `HORIZONTAL`.
- **Micro-Animaciones:** Lógica de interpolación (lerp) integrada para transiciones fluidas e independientes de los FPS.
- **Rendimiento Extremo (Dirty Flag System):** Los diseños sólo se recalcularán matemáticamente cuando un componente cambia físicamente.

## Inicio Rápido

Para usar X4UI, simplemente extiende `GuiBaseScreen` en lugar del clásico `GuiScreen` de Vanilla:

```java
public class MyCustomScreen extends GuiBaseScreen {
    
    public MyCustomScreen() {
        super(null, "Mi Título");
    }

    @Override
    protected void initComponents() {
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(5);
        
        GuiLabel titleLabel = new GuiLabel(0, 0, "¡Bienvenido a X4UI!");
        GuiButton closeButton = new GuiButton(0, 0, 100, 20, "Cerrar", () -> this.closeScreen());
        
        rootPanel.addChild(titleLabel);
        rootPanel.addChild(closeButton);
    }
}
```
[/ES]

[EN]
# About X4UI

Tired of dealing with hardcoded coordinates, messy `drawScreen` overrides, and infinite bugs in the archaic Vanilla Minecraft 1.12.2 GUI system? 

**X4UI** is a standalone, flexible, and dynamic user interface framework extracted from *Hammers Unbound*. It brings modern web-like development paradigms (like FlexBox layouts, DOM-tree structures, and event bubbling) straight into Forge 1.12.2.

## Key Features

- **DOM Architecture:** Build your UI by nesting components (`rootPanel.addChild(new GuiButton(...))`).
- **FlexBox Layouts:** `GuiPanel` supports automatic `VERTICAL` and `HORIZONTAL` stacking.
- **Micro-Animations:** Built-in lerp logic for buttery-smooth, FPS-independent hover and click transitions.
- **High Performance (Dirty Flag System):** Layouts are only recalculated when a component physically changes.

## Quick Start

To use X4UI, simply extend `GuiBaseScreen` instead of Vanilla's `GuiScreen`:

```java
public class MyCustomScreen extends GuiBaseScreen {
    
    public MyCustomScreen() {
        super(null, "My Title");
    }

    @Override
    protected void initComponents() {
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(5);
        
        GuiLabel titleLabel = new GuiLabel(0, 0, "Welcome to X4UI!");
        GuiButton closeButton = new GuiButton(0, 0, 100, 20, "Close", () -> this.closeScreen());
        
        rootPanel.addChild(titleLabel);
        rootPanel.addChild(closeButton);
    }
}
```
[/EN]
