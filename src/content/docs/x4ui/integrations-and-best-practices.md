---
title: "Integrations & Best Practices"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 8
---

[ES]
# 08 - Integraciones y Mejores Prácticas

Este documento detalla las directrices estandarizadas para trabajar con X4UI en proyectos de gran escala, evitando deuda arquitectónica y garantizando consistencia.

---

## 1. Reglas de Nomenclatura (Naming Conventions)

Para mantener la claridad arquitectónica y evitar el síndrome del "God Object", el prefijo `Gui` en X4UI está estrictamente reservado para **componentes visuales evidentes** que heredan de `GuiComponent`.

### Lo que SÍ debe llamarse `Gui`
- Componentes interactivos: `GuiButton`, `GuiTextField`, `GuiCheckbox`.
- Contenedores de layouts: `GuiPanel`, `GuiScrollPanel`, `GuiVirtualList`.
- Gráficos y multimedia: `GuiImage`, `GuiVideo`, `GuiSprite`.

### Lo que NO debe llamarse `Gui` (Antipatrón)
- Gestores y Controladores: No llames `GuiToastManager` a un gestor de colas si éste no se dibuja a sí mismo. Lrámalo `ToastManager`. *(Nota: si el gestor hereda de `GuiOverlay` y renderiza contenido en pantalla de forma autónoma, el prefijo `Gui` sí es justificable).*
- Estructuras de Datos y Estados: `UIStateBus` no se llama `GuiStateBus`. `State<T>` no se llama `GuiState`.
- Modelos de Red: No llames `GuiPacket` a un paquete de sincronización.

---

## 2. Inyección de Dependencias y Modelos

Nunca pases objetos gigantes del juego (como el jugador entero, mundos o bases de datos) directamente al constructor de los componentes visuales.
Las Vistas (Views) deben ser estúpidas (*Dumb Views*) y reactivas.

**Antipatrón (Acoplamiento Fuerte):**
```java
GuiPanel playerStats = new GuiPlayerStatsPanel(Minecraft.getMinecraft().player);
```

**Buena Práctica (Reactivo, Desacoplado):**
Pasa contenedores de estado reactivo o utiliza el `UIStateBus`.

```java
State<PlayerStatsData> stats = new State<>(new PlayerStatsData());
GuiPanel playerStats = new PlayerStatsPanel(stats); // El panel se suscribe internamente
```

---

## 3. Prácticas de Inicialización

Al crear un `Screen` completo en Minecraft que utilice X4UI, instancia tus componentes una sola vez en el constructor o en un método de inicialización llamado *antes* de adjuntarlo a la pantalla.

Nunca inicies descargas pesadas del `MediaPipeline` dentro de `update()` o `render()`. Hazlo en la fase de inicialización.

---

## 4. Auditorías de Memoria

Recuerda que en Java 8, abusar de lambdas sin cuidado (capturando referencias del `Screen` entero) puede evitar que el Garbage Collector libere pantallas cerradas.
- Usa `bindState` siempre en los componentes, ya que X4UI los desvinculará automáticamente cuando el componente sea destruido al cerrar el `Screen`.
- Si utilizas `State.addListener()` manual, asegúrate de desuscribirlo en el `onDetached()` de tu componente raíz.
[/ES]

[EN]
# 08 - Integrations and Best Practices

This document details standardized guidelines for working with X4UI in large-scale projects, avoiding architectural debt, and ensuring consistency.

---

## 1. Naming Conventions

To maintain architectural clarity and avoid the "God Object" syndrome, the `Gui` prefix in X4UI is strictly reserved for **evident visual components** that inherit from `GuiComponent`.

### What SHOULD be named `Gui`
- Interactive components: `GuiButton`, `GuiTextField`, `GuiCheckbox`.
- Layout containers: `GuiPanel`, `GuiScrollPanel`, `GuiVirtualList`.
- Graphics and multimedia: `GuiImage`, `GuiVideo`, `GuiSprite`.

### What SHOULD NOT be named `Gui` (Anti-pattern)
- Managers and Controllers: Do not name a queue manager `GuiToastManager` if it doesn't draw itself. Name it `ToastManager`. *(Note: if the manager inherits from `GuiOverlay` and renders content autonomously, the `Gui` prefix is justifiable).*
- Data Structures and States: `UIStateBus` is not called `GuiStateBus`. `State<T>` is not called `GuiState`.
- Network Models: Do not name a synchronization packet `GuiPacket`.

---

## 2. Dependency Injection and Models

Never pass massive game objects (like the entire player, worlds, or databases) directly into the constructor of visual components.
Views should be *Dumb Views* and reactive.

**Anti-pattern (Tight Coupling):**
```java
GuiPanel playerStats = new GuiPlayerStatsPanel(Minecraft.getMinecraft().player);
```

**Best Practice (Reactive, Decoupled):**
Pass reactive state containers or use the `UIStateBus`.

```java
State<PlayerStatsData> stats = new State<>(new PlayerStatsData());
GuiPanel playerStats = new PlayerStatsPanel(stats); // The panel subscribes internally
```

---

## 3. Initialization Practices

When creating an entire `Screen` in Minecraft that uses X4UI, instantiate your components exactly once in the constructor or in an initialization method called *before* attaching it to the screen.

Never start heavy downloads from the `MediaPipeline` inside `update()` or `render()`. Do it during the initialization phase.

---

## 4. Memory Auditing

Remember that in Java 8, carelessly abusing lambdas (capturing references of the entire `Screen`) can prevent the Garbage Collector from freeing closed screens.
- Always use `bindState` on components, as X4UI will automatically unbind them when the component is destroyed upon closing the `Screen`.
- If you use manual `State.addListener()`, make sure to unsubscribe it in the `onDetached()` of your root component.
[/EN]
