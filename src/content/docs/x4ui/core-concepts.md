---
title: "Core Concepts"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 1
---

[ES]
# 01 - Conceptos Fundamentales y Arquitectura

Este documento define el paradigma de modo retenido de X4UI, las decisiones de diseño que sustentan su árbol de componentes, el ciclo de vida determinista, la gestión de estado reactivo y los criterios de optimización mediante banderas sucias (*dirty flags*).

---

## 1. El Paradigma de X4UI y Qué Soluciona

En el sistema vanilla de Minecraft (`GuiScreen`), el código de interfaz es imperativo e inmediato: cada fotograma recalcula posiciones, dibuja primitivas crudas y mezcla la lógica de negocio con el renderizado. Esto provoca acoplamiento fuerte, fugas de estado al redimensionar la ventana y código difícil de mantener.

X4UI adopta un **paradigma de modo retenido tipo DOM**:
1. **Separación entre estructura y dibujo:** Los componentes se instancian una sola vez en `initComponents()` y se organizan en un árbol jerárquico (`rootPanel`).
2. **Layout perezoso:** Las coordenadas y dimensiones se recalculan únicamente cuando cambia la estructura o la resolución, nunca en cada fotograma por defecto.
3. **Vistas reactivas y pasivas (*Dumb Views*):** Los datos residen en contenedores observables (`State<T>`) o en `UIStateBus`; la vista se limita a suscribirse y reflejar cambios.
4. **Limpieza automática de memoria:** Al destruir un componente o cerrar la pantalla, X4UI desvincula sus suscripciones reactivas y libera animaciones asociadas.

---

## 2. Árbol Jerárquico de Componentes

Cada elemento visual hereda de `GuiComponent` (patrón Composite). La raíz de toda pantalla es `rootPanel`, un `GuiPanel` que cubre el área lógica de la ventana:

```
rootPanel (GuiPanel)
├── headerPanel (GuiPanel.row)
│   ├── GuiLabel
│   ├── spacer (GuiPanel.spacer)
│   └── GuiButton ("X")
├── contentPanel (GuiScrollPanel)
│   ├── card1 (GuiPanel.card)
│   └── card2 (GuiPanel.card)
└── footerPanel (GuiPanel.row)
    └── GuiSliderInt
```

### Operaciones sobre el Árbol

```java
GuiPanel panel = new GuiPanel(0, 0, 0, 300).withPercentWidth(1.0f);
GuiButton btn = (GuiButton) new GuiButton(0, 0, 0, 20, "Aceptar", () -> {}).withPercentWidth(0.5f);

panel.addChild(btn);       // Adjunta btn e invoca onAttached()
panel.removeChild(btn);    // Separa btn e invoca onDetached()
panel.clearChildren();     // Separa y destruye todos los hijos
```

---

## 3. Ciclo de Vida de `GuiComponent`

El ciclo de vida sigue seis etapas deterministas:

1. **Construcción:** Asignación de propiedades iniciales en el constructor o mediante API fluida (`withPercentWidth`, `withMargin`, `withLayer`).
2. **Adjunción (`onAttached()`):** Se ejecuta al agregarse a un contenedor padre.
3. **Actualización (`update(float deltaTime)`):** Se ejecuta antes de renderizar. Si existen banderas sucias de diseño (`requestLayout()`), resuelve dimensiones porcentuales y posicionamiento del `ILayoutManager`, propagándolo hacia los hijos.
4. **Renderizado (`render(IGraphics gfx, int mouseX, int mouseY, float partialTicks)`):**
   - Invoca `renderSelf(gfx, mouseX, mouseY, partialTicks)`.
   - Si existe bandera sucia de render (`requestRender()`), reordena los hijos por `layer` (Z-index).
   - Invoca `renderChildren(gfx, ...)` aplicando recorte (*clipping*) cuando corresponde.
5. **Separación (`onDetached()`):** Se ejecuta al remover el componente de su padre.
6. **Destrucción (`destroy()` / `onDestroy()`):**
   - Desvincula automáticamente todos los listeners enlazados mediante `bindState()` o `mapState()`.
   - Libera animaciones en `GuiAnimator` y se propaga recursivamente a los hijos.

---

## 4. Propagación de Eventos

Los eventos de mouse (`mouseClicked`, `mouseReleased`, `mouseDragged`, `mouseScrolled`) y teclado (`keyTyped`) recorren el árbol respetando visibilidad y orden de capas (`layer`):
- Los componentes en capas superiores (`layer` mayor) reciben prioridad de captura.
- Cuando un componente consume el evento (retorna `true`), detiene la propagación hacia capas inferiores.

---

## 5. Estado Reactivo (`State<T>`) y Bus de Estados (`UIStateBus`)

### `State<T>`
`com.x4yi.x4ui.common.State<T>` es un contenedor observable seguro para hilos y compatible con servidor dedicado. Deduplica notificaciones mediante `Objects.equals()` para evitar trabajo redundante cuando el valor no cambia:

```java
State<Integer> score = new State<>(0);

// Vinculación segura ligada al ciclo de vida del componente
label.bindState(score, val -> label.setText("Puntos: " + val));

score.set(10); // Actualiza la etiqueta automáticamente
```

### `UIStateBus`
Permite compartir estado entre módulos o sincronizar datos desde el servidor sin acoplar referencias directas. Soporta tres alcances:
- `Scope.SCREEN`: se limpia automáticamente al cerrar la pantalla (`GuiBaseScreen.onGuiClosed()`). Es el alcance utilizado por `syncedState(key, valorInicial)`.
- `Scope.SESSION`: persiste entre pantallas abiertas y se limpia al desconectarse del servidor.
- `Scope.GLOBAL`: persiste durante toda la ejecución del cliente.

```java
String key = UIStateBus.scopedKey("machine:10,64,10", "energy");
State<Integer> energy = UIStateBus.getOrCreate(key, 0, UIStateBus.Scope.SCREEN);
```

---

## 6. Sistema de Temas (`ITheme` y `ThemeRegistry`)

La apariencia visual está desacoplada de la lógica de componentes mediante `ITheme`. `DefaultTheme.INSTANCE` provee una paleta oscura sólida y minimalista. Los componentes heredan el tema de su cadena de ancestros o utilizan `ThemeRegistry.getCurrentTheme()` como respaldo:

```java
ThemeRegistry.registerTheme("custom_dark", customTheme);
rootPanel.setTheme(ThemeRegistry.getTheme("custom_dark"));
```

---

## 7. Optimización mediante Dirty Flags

- `requestLayout()`: marca que las dimensiones o la jerarquía estructural cambiaron; el layout se recalculará una única vez en el siguiente `update()`.
- `requestRender()`: solicita reordenar las capas visuales (`layer`).
- Las mutaciones puramente visuales (color, opacidad, texto cuando no altera tamaño estructural) no requieren `requestLayout()`.

---

## 8. Qué Evitar al Crear una GUI

| Antipatrón | Causa Técnica del Problema | Solución Correcta |
| :--- | :--- | :--- |
| Llamar `addChild()` dentro de `renderSelf()` o `render()` | Crea componentes infinitos por fotograma y satura memoria/GC | Instanciar la jerarquía en `initComponents()` |
| Llamar `requestLayout()` incondicionalmente cada tick | Anula la optimización perezosa y fuerza recálculo completo en cada frame | Invocar solo ante cambios reales de tamaño, visibilidad o hijos |
| Suscribirse manualmente con `state.addListener(...)` sin limpiar | Retiene referencias fuertes al `GuiComponent` y provoca fugas de memoria | Usar `component.bindState(state, callback)` |
| Ejecutar I/O o red síncrona en callbacks de botones | Congela el hilo principal del cliente Minecraft | Delegar en `MediaPipeline`, `CompletableFuture` o `UINetwork` |
[/ES]

[EN]
# 01 - Core Concepts & Architecture

This document defines X4UI's retained-mode paradigm, the design decisions behind its component tree, deterministic lifecycle, reactive state management, and dirty-flag optimization model.

---

## 1. The X4UI Paradigm & What It Solves

Vanilla Minecraft's `GuiScreen` relies on immediate-mode imperative code: every frame recalculates positions, emits raw OpenGL geometry, and mixes business logic with rendering. This causes tight coupling, lost UI state on window resize, and high maintenance overhead.

X4UI adopts a **DOM-like retained-mode paradigm**:
1. **Structure decoupled from rendering:** Components are instantiated once in `initComponents()` and arranged in a persistent tree (`rootPanel`).
2. **Lazy layout resolution:** Coordinates and sizes are recalculated only when structure or viewport dimensions change, never unconditionally per frame.
3. **Passive, reactive views (*Dumb Views*):** Data lives in observable containers (`State<T>`) or `UIStateBus`; views subscribe to state and reflect updates automatically.
4. **Lifecycle-managed cleanup:** Destroying a component or closing a screen automatically unbinds reactive listeners and clears associated animations.

---

## 2. Hierarchical Component Tree

Every visual element extends `GuiComponent` (Composite pattern). The root of every screen is `rootPanel`, a `GuiPanel` spanning the logical viewport:

```
rootPanel (GuiPanel)
├── headerPanel (GuiPanel.row)
│   ├── GuiLabel
│   ├── spacer (GuiPanel.spacer)
│   └── GuiButton ("X")
├── contentPanel (GuiScrollPanel)
│   ├── card1 (GuiPanel.card)
│   └── card2 (GuiPanel.card)
└── footerPanel (GuiPanel.row)
    └── GuiSliderInt
```

### Tree Operations

```java
GuiPanel panel = new GuiPanel(0, 0, 0, 300).withPercentWidth(1.0f);
GuiButton btn = (GuiButton) new GuiButton(0, 0, 0, 20, "Accept", () -> {}).withPercentWidth(0.5f);

panel.addChild(btn);       // Attaches btn and invokes onAttached()
panel.removeChild(btn);    // Detaches btn and invokes onDetached()
panel.clearChildren();     // Detaches and destroys all children
```

---

## 3. Component Lifecycle (`GuiComponent`)

The lifecycle follows six deterministic stages:

1. **Construction:** Initial properties are set via constructor or fluent API (`withPercentWidth`, `withMargin`, `withLayer`).
2. **Attachment (`onAttached()`):** Invoked when added to a parent container.
3. **Update (`update(float deltaTime)`):** Executed before rendering. If layout dirty flags (`requestLayout()`) are active, resolves percentage dimensions and delegates positioning to `ILayoutManager`, propagating down to children.
4. **Rendering (`render(IGraphics gfx, int mouseX, int mouseY, float partialTicks)`):**
   - Calls `renderSelf(gfx, mouseX, mouseY, partialTicks)`.
   - If render dirty flag (`requestRender()`) is set, sorts children by `layer` (Z-index).
   - Calls `renderChildren(gfx, ...)` with scissor clipping when enabled.
5. **Detachment (`onDetached()`):** Invoked when removed from the parent.
6. **Destruction (`destroy()` / `onDestroy()`):**
   - Automatically unbinds all listeners registered via `bindState()` or `mapState()`.
   - Releases weak references in `GuiAnimator` and propagates recursively to children.

---

## 4. Event Propagation

Mouse events (`mouseClicked`, `mouseReleased`, `mouseDragged`, `mouseScrolled`) and keyboard events (`keyTyped`) traverse the tree respecting visibility and `layer` ordering:
- Higher-layer components receive capture priority.
- Returning `true` consumes the event and halts propagation to lower layers.

---

## 5. Reactive State (`State<T>`) & State Bus (`UIStateBus`)

### `State<T>`
`com.x4yi.x4ui.common.State<T>` is a thread-safe, dedicated-server-compatible observable container. It deduplicates updates using `Objects.equals()` to prevent redundant UI work:

```java
State<Integer> score = new State<>(0);

// Lifecycle-safe binding tied to the component
label.bindState(score, val -> label.setText("Score: " + val));

score.set(10); // Updates the label automatically
```

### `UIStateBus`
Enables decoupled cross-module state sharing and server-to-client data sync without direct object references. Supports three scopes:
- `Scope.SCREEN`: automatically cleared on screen close (`GuiBaseScreen.onGuiClosed()`). Used by `syncedState(key, initialValue)`.
- `Scope.SESSION`: survives screen closes and is cleared on server disconnect.
- `Scope.GLOBAL`: persists for the entire client session.

```java
String key = UIStateBus.scopedKey("machine:10,64,10", "energy");
State<Integer> energy = UIStateBus.getOrCreate(key, 0, UIStateBus.Scope.SCREEN);
```

---

## 6. Theme System (`ITheme` & `ThemeRegistry`)

Visual styling is decoupled from component logic through `ITheme`. `DefaultTheme.INSTANCE` provides a solid, minimalist dark palette. Components inherit the theme from their ancestor chain or fall back to `ThemeRegistry.getCurrentTheme()`:

```java
ThemeRegistry.registerTheme("custom_dark", customTheme);
rootPanel.setTheme(ThemeRegistry.getTheme("custom_dark"));
```

---

## 7. Dirty-Flag Optimization

- `requestLayout()`: marks that dimensions or structural hierarchy changed; layout runs once on the next `update()`.
- `requestRender()`: requests resorting of visual `layer`s.
- Purely visual mutations (color, alpha, or text changes that do not alter structural bounds) do not require `requestLayout()`.

---

## 8. What to Avoid When Building a GUI

| Anti-Pattern | Technical Root Cause | Correct Approach |
| :--- | :--- | :--- |
| Calling `addChild()` inside `renderSelf()` or `render()` | Allocates unbounded components every frame and exhausts memory/GC | Instantiate hierarchy in `initComponents()` |
| Calling `requestLayout()` unconditionally every tick | Defeats lazy layout and forces full tree recalculation every frame | Call only when dimensions, visibility, or children actually change |
| Subscribing via `state.addListener(...)` without unsubscribing | Retains strong references to closed `GuiComponent` instances (memory leak) | Use `component.bindState(state, callback)` |
| Running blocking I/O or network calls in button callbacks | Freezes the Minecraft client main thread | Delegate to `MediaPipeline`, `CompletableFuture`, or `UINetwork` |
[/EN]
