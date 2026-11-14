---
title: "Core Concepts"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 1
---

[ES]
# 01 - Conceptos Fundamentales y Arquitectura

Este documento describe la arquitectura central de X4UI: la filosofía del framework, el árbol jerárquico de componentes, el ciclo de vida estandarizado, el sistema de diseño flexbox, la propagación de eventos, el estado reactivo (`State<T>`), y los antipatrones que debes evitar a toda costa.

---

## 2. Árbol Jerárquico de Componentes

X4UI organiza la interfaz de usuario en un árbol jerárquico de modo retenido (patrón Composite). Cada elemento visual hereda de `GuiComponent`. La raíz de la jerarquía es `rootPanel` (un `GuiPanel` que abarca toda la pantalla).

```
rootPanel (GuiPanel - Flex Vertical, Ancho 100%)
├── headerPanel (GuiPanel - Flex Horizontal)
│   ├── GuiLabel "Título"
│   └── GuiButton "[X]" (Cerrar)
├── contentPanel (GuiScrollPanel - Viewport responsivo)
│   ├── card1 (GuiPanel)
│   └── card2 (GuiPanel)
└── footerPanel (GuiPanel - Barra inferior)
    └── GuiSliderInt
```

### Operaciones del Árbol

```java
GuiPanel panel = new GuiPanel(0, 0, 0, 300).withPercentWidth(1.0f);
GuiButton btn = (GuiButton) new GuiButton(0, 0, 0, 20, "Aceptar", () -> {}).withPercentWidth(0.5f);

panel.addChild(btn);       // Agrega btn y dispara onAttached()
panel.removeChild(btn);    // Remueve btn y dispara onDetached()
panel.clearChildren();     // Remueve y destruye todos los hijos
```

---

## 3. Ciclo de Vida del Componente (`GuiComponent`)

El ciclo de vida en X4UI está estandarizado en etapas deterministas:

1. **Construcción:** Se establecen las propiedades iniciales en el constructor o mediante la API fluida (`.withPercentWidth()`, `.withVariant()`).
2. **Adjunción (`onAttached()`):** Invocado al agregarse a un contenedor padre.
3. **Actualización de Cuadro (`update(float deltaTime)`):** Se ejecuta en cada fotograma antes del renderizado. Si hay flags sucias (`requestLayout()`), se resuelve el diseño y los anchos porcentuales basados en el padre, propagándose a todos los hijos.
4. **Renderizado (`render(IGraphics gfx, int mouseX, int mouseY, float partialTicks)`):**
   - Llama a `renderSelf(gfx, mouseX, mouseY, partialTicks)`.
   - Ordena los hijos por capa (`layer`) y llama a `renderChildren(gfx, ...)` aplicando recorte (*clipping*).
5. **Separación (`onDetached()`):** Se invoca al removerse del padre.
6. **Destrucción (`onDestroy()` / `destroy()`):**
   - Se desvinculan automáticamente todos los listeners reactivos enlazados mediante `bindState()` o `mapState()`.
   - Se liberan referencias débiles en `GuiAnimator` y se propaga a los hijos.

---

## 4. Estado Reactivo (`State<T>`)

`State<T>` (en `com.x4yi.x4ui.common`) es un contenedor reactivo seguro para hilos que notifica a los suscriptores cuando su valor muta. Deduplica actualizaciones mediante `Objects.equals()`.

```java
import com.x4yi.x4ui.common.State;

State<Integer> score = new State<>(0);

// Enlace seguro al ciclo de vida del componente
label.bindState(score, val -> label.setText("Puntos: " + val));

score.set(10); // Actualiza la etiqueta automáticamente
```

---

## 5. Bus de Estados (`UIStateBus`)

Para comunicar módulos o sincronizar datos con el servidor sin acoplamiento directo, `UIStateBus` soporta tres alcances:
- `Scope.SCREEN`: se limpia automáticamente al cerrar la pantalla (`GuiBaseScreen.onGuiClosed()`), ideal con `syncedState(key, valor)`.
- `Scope.SESSION`: sobrevive al cierre de pantallas y se limpia al desconectarse del servidor.
- `Scope.GLOBAL`: persiste durante toda la ejecución del cliente.

```java
// Estado por pantalla con namespace (evita colisiones entre bloques/entidades)
String key = UIStateBus.scopedKey("tile:10,64,10", "energy");
State<Integer> energy = UIStateBus.getOrCreate(key, 0, UIStateBus.Scope.SCREEN);

// Estado global compartido
State<Double> power = UIStateBus.getOrCreate("mimod:power", 1.0, UIStateBus.Scope.GLOBAL);
```

---

## 6. Sistema de Temas (`ITheme` y `ThemeRegistry`)

Los estilos visuales están encapsulados en la interfaz `ITheme`. `DefaultTheme.INSTANCE` provee una paleta oscura estándar. Los componentes heredan el tema de su cadena de ancestros o de `ThemeRegistry.getCurrentTheme()`.

```java
ThemeRegistry.registerTheme("mi_tema_oscuro", customTheme);
rootPanel.setTheme(ThemeRegistry.getTheme("mi_tema_oscuro"));
```

---

## 7. Banderas de Actualización (Dirty Flags)

- `requestLayout()`: Solicita recalcular dimensiones y posiciones en el próximo cuadro.
- `requestRender()`: Solicita reordenar las capas visuales (`layer`).
- Cambios puramente visuales (color, alfa) NO requieren llamar a `requestLayout()`.

---

## Qué Evitar Hacer (Antipatrones Críticos)

> [!CAUTION]
> **1. NUNCA agregar hijos (`addChild()`) dentro de `renderSelf()` o `render()`.**
> Instancie y agregue los componentes únicamente al inicializar la vista, nunca durante un fotograma de dibujo.

> [!WARNING]
> **2. NUNCA llamar a `requestLayout()` incondicionalmente en cada tick.**
> Hágalo solo cuando una propiedad estructural (ancho, alto, visibilidad, separación) realmente cambie.

> [!WARNING]
> **3. NUNCA suscribirse manualmente a `State.addListener()` sin desuscribirse.**
> Utilice siempre `component.bindState()`, que asegura la limpieza de listeners automáticamente cuando el componente muere.

> [!IMPORTANT]
> **4. NUNCA bloquear el hilo principal de Minecraft.**
> No realice peticiones de red o disco bloqueantes en callbacks de botones. Utilice `MediaPipeline` (con `CompletableFuture`) o hilos secundarios.
[/ES]

[EN]
# 01 - Core Concepts & Architecture

This document outlines the core architecture of X4UI: the framework's philosophy, the hierarchical component tree, the standardized lifecycle, the flexbox layout system, event propagation, reactive state (`State<T>`), and the critical anti-patterns you must avoid.

---



## 2. Hierarchical Component Tree

X4UI organizes the user interface into a retained-mode hierarchical tree (Composite pattern). Every visual element inherits from `GuiComponent`. The root of the hierarchy is `rootPanel` (a `GuiPanel` covering the entire screen).

```
rootPanel (GuiPanel - Flex Vertical, Width 100%)
├── headerPanel (GuiPanel - Flex Horizontal)
│   ├── GuiLabel "Title"
│   └── GuiButton "[X]" (Close)
├── contentPanel (GuiScrollPanel - Responsive Viewport)
│   ├── card1 (GuiPanel)
│   └── card2 (GuiPanel)
└── footerPanel (GuiPanel - Bottom bar)
    └── GuiSliderInt
```

### Tree Operations

```java
GuiPanel panel = new GuiPanel(0, 0, 0, 300).withPercentWidth(1.0f);
GuiButton btn = (GuiButton) new GuiButton(0, 0, 0, 20, "Accept", () -> {}).withPercentWidth(0.5f);

panel.addChild(btn);       // Adds btn and triggers onAttached()
panel.removeChild(btn);    // Removes btn and triggers onDetached()
panel.clearChildren();     // Removes and destroys all children
```

---

## 3. Component Lifecycle (`GuiComponent`)

The component lifecycle in X4UI is standardized into deterministic stages:

1. **Construction:** Initial properties are set in the constructor or via the fluent API (`.withPercentWidth()`, `.withVariant()`).
2. **Attachment (`onAttached()`):** Invoked when added to a parent container.
3. **Frame Update (`update(float deltaTime)`):** Executed every frame before rendering. If dirty flags (`requestLayout()`) are present, the layout and parent-based percentage widths are resolved and propagated to all children.
4. **Rendering (`render(IGraphics gfx, int mouseX, int mouseY, float partialTicks)`):**
   - Calls `renderSelf(gfx, mouseX, mouseY, partialTicks)`.
   - Sorts children by `layer` and calls `renderChildren(gfx, ...)` applying clipping.
5. **Detachment (`onDetached()`):** Invoked when removed from the parent.
6. **Destruction (`onDestroy()` / `destroy()`):**
   - Automatically unbinds all reactive listeners attached via `bindState()` or `mapState()`.
   - Releases weak references in `GuiAnimator` and propagates to children.

---

## 4. Reactive State (`State<T>`)

`State<T>` (in `com.x4yi.x4ui.common`) is a thread-safe reactive container that notifies subscribers when its value mutates. It deduplicates updates via `Objects.equals()`.

```java
import com.x4yi.x4ui.common.State;

State<Integer> score = new State<>(0);

// Safe binding to component lifecycle
label.bindState(score, val -> label.setText("Score: " + val));

score.set(10); // Automatically updates the label
```

---

## 5. State Bus (`UIStateBus`)

To share decoupled UI state or sync data from the server, `UIStateBus` provides three scopes:
- `Scope.SCREEN`: automatically cleared when the screen closes (`GuiBaseScreen.onGuiClosed()`), or via `syncedState(key, defaultValue)`.
- `Scope.SESSION`: survives screen closes and is cleared on server disconnect.
- `Scope.GLOBAL`: persists for the entire client session.

```java
// Screen-scoped state with namespace (prevents collisions across blocks/entities)
String key = UIStateBus.scopedKey("tile:10,64,10", "energy");
State<Integer> energy = UIStateBus.getOrCreate(key, 0, UIStateBus.Scope.SCREEN);

// Global shared state
State<Double> power = UIStateBus.getOrCreate("mymod:power", 1.0, UIStateBus.Scope.GLOBAL);
```

---

## 6. Theme System (`ITheme` & `ThemeRegistry`)

Visual styles are encapsulated in `ITheme`. `DefaultTheme.INSTANCE` provides a solid, minimalist dark palette. Components inherit their theme from their ancestor chain or `ThemeRegistry.getCurrentTheme()`.

```java
ThemeRegistry.registerTheme("my_dark_theme", customTheme);
rootPanel.setTheme(ThemeRegistry.getTheme("my_dark_theme"));
```

---

## 7. Dirty Flags

- `requestLayout()`: Requests recalculation of dimensions and positions on the next frame.
- `requestRender()`: Requests resorting of visual `layer`s.
- Purely visual changes (color, alpha) DO NOT require calling `requestLayout()`.

---

## What To Avoid (Critical Anti-Patterns)

> [!CAUTION]
> **1. NEVER add children (`addChild()`) inside `renderSelf()` or `render()`.**
> Instantiate and add components only when initializing the view, never during a draw frame.

> [!WARNING]
> **2. NEVER call `requestLayout()` unconditionally on every tick.**
> Only do this when a structural property (width, height, visibility, gap) actually changes.

> [!WARNING]
> **3. NEVER manually subscribe via `State.addListener()` without unsubscribing.**
> Always use `component.bindState()`, which guarantees listener cleanup when the component dies.

> [!IMPORTANT]
> **4. NEVER block the main Minecraft thread.**
> Do not perform blocking network or disk requests in button callbacks. Use `MediaPipeline` (with `CompletableFuture`) or background threads.
[/EN]
