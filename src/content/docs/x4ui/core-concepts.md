---
title: "Core Concepts"
project: "X4UI"
category: "General"
categoryOrder: 1
order: 1
---

[ES]
# 01 - Conceptos Fundamentales

Este documento describe la arquitectura central de X4UI: el árbol jerárquico de componentes, el ciclo de vida estandarizado, el sistema de coordenadas relativas y porcentuales, el motor de diseño flexbox, la propagación de eventos, el estado reactivo (`State<T>`), el bus desacoplado (`UIStateBus`), el sistema de temas (`ITheme` y `ThemeRegistry`), las animaciones y la gestión de memoria.

---

## 1. Árbol Jerárquico de Componentes

X4UI organiza la interfaz de usuario en un árbol jerárquico de modo retenido (patrón Composite). Cada elemento visual hereda de `GuiComponent`. La raíz de la jerarquía es `rootPanel` (un `GuiPanel` que abarca toda la pantalla).

```
rootPanel (GuiPanel - Ancho x Alto de la pantalla)
├── headerPanel (GuiPanel - Flex Horizontal)
│   ├── GuiLabel "Título"
│   └── GuiButton "[X]" (Cerrar)
├── contentPanel (GuiScrollPanel - Viewport con scroll)
│   ├── card1 (GuiPanel)
│   └── card2 (GuiPanel)
└── footerPanel (GuiPanel - Barra inferior)
    └── GuiSliderInt
```

### Operaciones del Árbol

```java
GuiPanel panel = new GuiPanel(0, 0, 200, 300);
GuiButton btn = new GuiButton(0, 0, 100, 20, "Aceptar", () -> {});

panel.addChild(btn);       // Agrega btn y dispara onAttached()
panel.removeChild(btn);    // Remueve btn y dispara onDetached()
panel.clearChildren();     // Remueve y destruye todos los hijos
panel.getChildren();       // Lista inmutable o de solo lectura de hijos
```

---

## 2. Ciclo de Vida del Componente (`GuiComponent`)

El ciclo de vida en X4UI r1.0b5 está estandarizado en etapas deterministas:

1. **Construcción:** Se establecen las propiedades iniciales en el constructor o mediante métodos encadenables (`withPosition()`, `withSize()`).
2. **Adjunción (`onAttached()`):** Se invoca automáticamente al agregarse a un contenedor padre mediante `addChild()`. Es el punto ideal para inicializar suscripciones dependientes de la jerarquía.
3. **Actualización de Cuadro (`update(float deltaTime)` / `tick(float deltaTime)`):** Se ejecuta en cada fotograma antes del renderizado. Si hay flags sucias (`requestLayout()`), se resuelve el diseño y luego se actualizan todos los hijos en cascada.
4. **Renderizado (`render(IGraphics gfx, int mouseX, int mouseY, float partialTicks)`):**
   - Llama a `renderSelf(gfx, mouseX, mouseY, partialTicks)` para dibujar el componente propio.
   - Ordena los hijos por su capa (`layer`) y llama a `renderChildren(gfx, ...)` aplicando recorte si corresponde.
5. **Separación (`onDetached()`):** Se invoca al removerse del padre mediante `removeChild()`.
6. **Destrucción (`onDestroy()` / `destroy()`):**
   - Se desvinculan automáticamente todos los listeners reactivos enlazados mediante `bindState()` o `mapState()`.
   - Se liberan referencias débiles en `GuiAnimator`.
   - Se propaga la llamada a todos los hijos recursivamente.

---

## 3. Coordenadas y Dimensionamiento Responsivo

### Coordenadas Relativas al Padre
Todas las coordenadas `(x, y)` son locales a su contenedor padre. Para obtener la posición absoluta en píxeles de pantalla:

```java
int screenX = component.getAbsoluteX();
int screenY = component.getAbsoluteY();
```

### Dimensionamiento y Posicionamiento Porcentual
`GuiComponent` soporta dimensionamiento dinámico proporcional al tamaño de su contenedor padre:

```java
// El componente ocupará el 100% del ancho del padre y el 50% de su alto
panel.withPercentWidth(1.0f)
     .withPercentHeight(0.5f);

// Posicionamiento porcentual (centrado a 50% X, 20% Y)
badge.withPercentPosition(0.5f, 0.2f);
```

*Nota: Pasar `-1.0f` desactiva el cálculo porcentual y restaura el valor absoluto en píxeles.*

---

## 4. Diseño Flexbox (`FlexLayout`)

`GuiPanel` incluye un gestor `FlexLayout` para organizar componentes secuencialmente sin coordenadas manuales:

```java
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

// Direcciones disponibles
panel.setFlexDirection(FlexDirection.VERTICAL);    // Apilamiento de arriba a abajo
panel.setFlexDirection(FlexDirection.HORIZONTAL);  // Alineación en fila de izquierda a derecha
panel.setFlexDirection(FlexDirection.ABSOLUTE);    // Posicionamiento manual libre por (x, y)

// Configuración adicional
panel.setGap(6);           // 6 píxeles de separación entre componentes adyacentes
panel.setFlexWrap(true);   // Salta a la siguiente fila o columna al exceder el límite
panel.setPadding(new Insets(10)); // Espacio interno del panel
```

Los componentes invisibles (`setVisible(false)`) son omitidos automáticamente por el motor de diseño.

---

## 5. Espaciado Inmutable (`Insets`)

La clase `Insets` gestiona padding interno y márgenes externos:

```java
import com.x4yi.x4ui.client.gui.utils.Insets;

new Insets(8);             // 8 px en los 4 bordes
new Insets(4, 8);         // 4 px vertical, 8 px horizontal
new Insets(2, 4, 6, 8);   // Arriba: 2, Derecha: 4, Abajo: 6, Izquierda: 8
Insets.ZERO;               // Constante sin espacio
```

---

## 6. Sistema de Eventos y Foco

Los eventos de entrada se propagan desde la raíz hacia los hijos en **orden inverso de capa** (los componentes situados al frente reciben el evento primero):

| Evento | Método | Consumo |
|--------|--------|---------|
| Clic del ratón | `onMouseClick(int mouseX, int mouseY, int mouseButton)` | Retornar `true` detiene la propagación |
| Liberación | `onMouseRelease(int mouseX, int mouseY, int state)` | Retornar `true` consume el evento |
| Arrastre | `onMouseDrag(int mouseX, int mouseY, int button, long time)` | Procesado mientras el botón se mantiene presionado |
| Rueda de scroll | `onMouseScroll(int mouseX, int mouseY, int wheel)` | Manejado por paneles desplazables |
| Teclado | `onKeyPress(char typedChar, int keyCode)` | Solo el componente con foco recibe teclas |

### Modelo de Foco Único
Solo un componente puede poseer el foco de teclado a la vez:
```java
input.requestFocus();   // Otorga foco exclusivo
input.clearFocus();     // Retira el foco
boolean f = input.isFocused();
```

---

## 7. Estado Reactivo (`State<T>`)

`State<T>` (en `com.x4yi.x4ui.common`) es un contenedor reactivo seguro para hilos que notifica a los suscriptores cuando su valor muta. Deduplica actualizaciones mediante `Objects.equals()`.

```java
import com.x4yi.x4ui.common.State;

State<Integer> score = new State<>(0);

// Enlace seguro al ciclo de vida del componente
label.bindState(score, val -> label.setText("Puntos: " + val));

// Mutación del valor
score.set(10); // Actualiza la etiqueta automáticamente
score.set(10); // No emite evento (deduplicado)
```

### Transformaciones Derivadas (`map`)
```java
State<Boolean> isOnline = new State<>(true);
State<String> statusText = isOnline.map(online -> online ? "Conectado" : "Desconectado");
```

---

## 8. Bus Global de Estados (`UIStateBus`)

Para comunicar módulos o interfaces independientes sin acoplamiento directo, X4UI provee `UIStateBus`:

```java
import com.x4yi.x4ui.client.gui.bus.UIStateBus;

// Publicar un evento o estado
UIStateBus.publish(new UserProfileUpdatedEvent(userId, newName));

// Suscribirse al evento
UIStateBus.subscribe(UserProfileUpdatedEvent.class, event -> {
    System.out.println("Perfil actualizado: " + event.getName());
});
```

---

## 9. Sistema de Temas (`ITheme` y `ThemeRegistry`)

Los estilos visuales están encapsulados en la interfaz `ITheme`. `DefaultTheme.INSTANCE` provee una paleta oscura estándar.

### Uso y Registro Global
```java
import com.x4yi.x4ui.client.gui.utils.ThemeRegistry;
import com.x4yi.x4ui.client.gui.utils.DefaultTheme;

// Registrar un tema personalizado con ID único
ThemeRegistry.register("mi_tema_oscuro", customTheme);

// Obtener un tema registrado
ITheme theme = ThemeRegistry.get("mi_tema_oscuro");

// Aplicar al componente o panel raíz
rootPanel.setTheme(theme);
```

Los componentes buscan su tema subiendo por la cadena de ancestros hasta llegar al tema predeterminado.

---

## 10. Motor de Animaciones (`GuiAnimator`)

Permite animar valores flotantes en el tiempo con funciones de aceleración (*easing*):

```java
import com.x4yi.x4ui.client.gui.animation.GuiAnimator;
import com.x4yi.x4ui.client.gui.animation.GuiAnimator.Easing;

GuiAnimator.animate(
    card, "alpha", 0.0f, 1.0f, 400, Easing.EASE_OUT,
    new GuiAnimator.AnimationCallback() {
        @Override public void onUpdate(float value) { card.setAlpha(value); }
        @Override public void onComplete() { System.out.println("Animación finalizada"); }
    }
);
```

`GuiAnimator` almacena referencias débiles al objeto objetivo, evitando fugas de memoria si la pantalla se cierra a mitad de una animación.

---

## 11. Banderas de Actualización (Dirty Flags)

- `requestLayout()`: Solicita recalcular dimensiones y posiciones en el próximo cuadro.
- `requestRender()`: Solicita reordenar las capas visuales (`layer`).
- Cambios puramente visuales (color, alfa) NO requieren llamar a `requestLayout()`.

---

## Qué Evitar Hacer (Antipatrones y Buenas Prácticas)

> [!CAUTION]
> **1. NUNCA agregar hijos (`addChild()`) dentro de `renderSelf()` o `render()`.**
> Instancie y agregue los componentes únicamente en `initComponents()` o dentro de callbacks de eventos para evitar destruir el rendimiento.

> [!WARNING]
> **2. NUNCA llamar a `requestLayout()` incondicionalmente en cada tick.**
> Hágalo solo cuando una propiedad estructural (ancho, alto, visibilidad, separación) realmente cambie.

> [!WARNING]
> **3. NUNCA suscribirse manualmente a `State.addListener()` sin desuscribirse.**
> Utilice siempre `component.bindState()`, que asegura la limpieza de listeners automáticamente.

> [!IMPORTANT]
> **4. NUNCA bloquear el hilo principal de Minecraft.**
> No realice peticiones de red o disco bloqueantes en los callbacks de botones. Utilice `RemoteResourceManager` o hilos secundarios.
[/ES]

[EN]
# 01 - Core Concepts

This document details the core architecture of X4UI: the component hierarchy tree, standardized component lifecycle, relative and percentage-based coordinate systems, flexbox layout engine, event propagation, reactive state management (`State<T>`), decoupled state bus (`UIStateBus`), theming engine (`ITheme` & `ThemeRegistry`), animations, and memory management.

---

## 1. Hierarchical Component Tree

X4UI organizes user interfaces as a retained-mode hierarchical tree (Composite pattern). Every visual widget extends `GuiComponent`. The root of this tree is `rootPanel` (a full-screen `GuiPanel` created automatically by `GuiBaseScreen` and `GuiBaseContainer`).

```
rootPanel (GuiPanel - Full Screen Width x Height)
├── headerPanel (GuiPanel - Horizontal Flex)
│   ├── GuiLabel "Title"
│   └── GuiButton "[X]" (Close)
├── contentPanel (GuiScrollPanel - Scissored Viewport)
│   ├── card1 (GuiPanel)
│   └── card2 (GuiPanel)
└── footerPanel (GuiPanel - Bottom Toolbar)
    └── GuiSliderInt
```

### Tree Operations

```java
GuiPanel panel = new GuiPanel(0, 0, 200, 300);
GuiButton btn = new GuiButton(0, 0, 100, 20, "Accept", () -> {});

panel.addChild(btn);       // Adds btn and invokes onAttached()
panel.removeChild(btn);    // Removes btn and invokes onDetached()
panel.clearChildren();     // Recursively removes and destroys all children
panel.getChildren();       // Read-only list of children
```

---

## 2. Component Lifecycle (`GuiComponent`)

In X4UI r1.0b5, component lifecycle stages are deterministic and standardized:

1. **Construction:** Initial bounds and properties set via constructor or fluent builders (`withPosition()`, `withSize()`).
2. **Attachment (`onAttached()`):** Triggered when added to a parent container via `addChild()`. This is the designated hook for hierarchy-dependent registrations.
3. **Per-Frame Update (`update(float deltaTime)` / `tick(float deltaTime)`):** Executed once per frame before rendering. Evaluates dirty layout flags (`requestLayout()`) and ticks all children in cascade.
4. **Rendering (`render(IGraphics gfx, int mouseX, int mouseY, float partialTicks)`):**
   - Invokes `renderSelf(gfx, mouseX, mouseY, partialTicks)` for the component's own drawing.
   - Sorts children by layer (`layer`) and invokes `renderChildren(gfx, ...)` with automatic scissor clipping if applicable.
5. **Detachment (`onDetached()`):** Triggered when removed from a parent via `removeChild()`.
6. **Destruction (`onDestroy()` / `destroy()`):**
   - Automatically unbinds and cleans all reactive state listeners registered via `bindState()` or `mapState()`.
   - Releases weak animation targets in `GuiAnimator`.
   - Propagates destruction recursively to all children.

---

## 3. Coordinates & Responsive Sizing

### Parent-Relative Coordinates
All component coordinates `(x, y)` are relative to their parent container. To query absolute screen coordinates:

```java
int screenX = component.getAbsoluteX();
int screenY = component.getAbsoluteY();
```

### Percentage-Based Sizing & Positioning
`GuiComponent` supports dynamic percentage dimensions calculated relative to parent bounds:

```java
// Fill 100% of parent width, 50% of parent height
panel.withPercentWidth(1.0f)
     .withPercentHeight(0.5f);

// Relative positioning (center at 50% X, 20% Y)
badge.withPercentPosition(0.5f, 0.2f);
```

*Note: Passing `-1.0f` disables percentage calculation and restores absolute pixel sizing.*

---

## 4. Flexbox Layout (`FlexLayout`)

`GuiPanel` integrates a `FlexLayout` manager to arrange children sequentially without manual coordinate calculations:

```java
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

// Available layout directions
panel.setFlexDirection(FlexDirection.VERTICAL);    // Top-to-bottom column
panel.setFlexDirection(FlexDirection.HORIZONTAL);  // Left-to-right row
panel.setFlexDirection(FlexDirection.ABSOLUTE);    // Manual absolute positioning via (x, y)

// Layout properties
panel.setGap(6);           // 6 px separation between adjacent children
panel.setFlexWrap(true);   // Wrap onto next row/column when boundary is reached
panel.setPadding(new Insets(10)); // Internal panel padding
```

Hidden components (`setVisible(false)`) are automatically bypassed by the layout engine.

---

## 5. Immutable Spacing (`Insets`)

The immutable `Insets` class models uniform or asymmetric padding and margins:

```java
import com.x4yi.x4ui.client.gui.utils.Insets;

new Insets(8);             // 8 px on all 4 sides
new Insets(4, 8);         // 4 px vertical, 8 px horizontal
new Insets(2, 4, 6, 8);   // Top: 2, Right: 4, Bottom: 6, Left: 8
Insets.ZERO;               // Zero-spacing constant
```

---

## 6. Event Handling & Focus System

Input events propagate from root to children in **reverse layer order** (top-most z-layer receives the event first):

| Event | Method | Consumption |
|--------|--------|-------------|
| Mouse Click | `onMouseClick(int mouseX, int mouseY, int mouseButton)` | Returning `true` stops propagation |
| Mouse Release | `onMouseRelease(int mouseX, int mouseY, int state)` | Returning `true` consumes event |
| Mouse Drag | `onMouseDrag(int mouseX, int mouseY, int button, long time)` | Continuous drag while button held |
| Mouse Scroll | `onMouseScroll(int mouseX, int mouseY, int wheel)` | Handled by scrollable panels |
| Key Press | `onKeyPress(char typedChar, int keyCode)` | Dispatched exclusively to focused component |

### Single-Focus Model
Only one component may hold keyboard input focus at any time:
```java
input.requestFocus();   // Claim focus
input.clearFocus();     // Yield focus
boolean f = input.isFocused();
```

---

## 7. Reactive State (`State<T>`)

`State<T>` (in `com.x4yi.x4ui.common`) is a thread-safe reactive container that notifies subscribers when its value changes. Updates are deduplicated using `Objects.equals()`.

```java
import com.x4yi.x4ui.common.State;

State<Integer> score = new State<>(0);

// Lifecycle-managed binding
label.bindState(score, val -> label.setText("Score: " + val));

// Mutating state
score.set(10); // Automatically triggers label update
score.set(10); // Deduplicated, no event emitted
```

### Derived Transformations (`map`)
```java
State<Boolean> isOnline = new State<>(true);
State<String> statusText = isOnline.map(online -> online ? "Online" : "Offline");
```

---

## 8. Global State Bus (`UIStateBus`)

To communicate between independent screens or third-party mods without direct coupling, X4UI provides `UIStateBus`:

```java
import com.x4yi.x4ui.client.gui.bus.UIStateBus;

// Publish event
UIStateBus.publish(new UserProfileUpdatedEvent(userId, newName));

// Subscribe to event
UIStateBus.subscribe(UserProfileUpdatedEvent.class, event -> {
    System.out.println("Profile updated: " + event.getName());
});
```

---

## 9. Theming System (`ITheme` & `ThemeRegistry`)

Visual styling tokens are encapsulated within the `ITheme` interface. `DefaultTheme.INSTANCE` supplies a clean Material-inspired dark theme.

### Global Registration & Application
```java
import com.x4yi.x4ui.client.gui.utils.ThemeRegistry;
import com.x4yi.x4ui.client.gui.utils.DefaultTheme;

// Register custom theme
ThemeRegistry.register("my_dark_theme", customTheme);

// Retrieve registered theme
ITheme theme = ThemeRegistry.get("my_dark_theme");

// Apply to component or screen root
rootPanel.setTheme(theme);
```

Components resolve active themes by ascending their parent chain up to the root default.

---

## 10. Animation Engine (`GuiAnimator`)

Interpolates float properties over time using configurable easing curves:

```java
import com.x4yi.x4ui.client.gui.animation.GuiAnimator;
import com.x4yi.x4ui.client.gui.animation.GuiAnimator.Easing;

GuiAnimator.animate(
    card, "alpha", 0.0f, 1.0f, 400, Easing.EASE_OUT,
    new GuiAnimator.AnimationCallback() {
        @Override public void onUpdate(float value) { card.setAlpha(value); }
        @Override public void onComplete() { System.out.println("Animation complete"); }
    }
);
```

`GuiAnimator` retains weak references to targets, preventing memory retention if a screen is closed mid-animation.

---

## 11. Dirty Flags

- `requestLayout()`: Requests recalculation of bounds and positions on the next frame.
- `requestRender()`: Requests child layer reordering on the next frame.
- Purely visual mutations (color, alpha) do NOT require calling `requestLayout()`.

---

## What to Avoid (Pitfalls & Best Practices)

> [!CAUTION]
> **1. NEVER add children (`addChild()`) inside `renderSelf()` or `render()`.**
> Instantiate and add components only in `initComponents()` or event callbacks to avoid destroying performance.

> [!WARNING]
> **2. NEVER invoke `requestLayout()` unconditionally every tick.**
> Only do so when structural properties (width, height, visibility, gap) have actually changed.

> [!WARNING]
> **3. NEVER subscribe to `State.addListener()` without explicit removal.**
> Always prefer `component.bindState()`, which unbinds automatically and prevents memory leaks.

> [!IMPORTANT]
> **4. NEVER block Minecraft's main client thread.**
> Do not perform synchronous disk I/O or HTTP requests in callbacks. Use `RemoteResourceManager` or background threads.
[/EN]
