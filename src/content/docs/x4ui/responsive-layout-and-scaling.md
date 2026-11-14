---
title: "Responsive Layout & Scaling"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 4
---

[ES]
# 04 - Diseño Responsivo y Posicionamiento Relativo (GUI Scale 1x a 4x)

Este documento describe el estándar oficial de diseño responsivo en X4UI. Con la adopción obligatoria de `FlexLayout` y tamaños porcentuales, garantizamos que las interfaces permanezcan perfectamente legibles y alineadas bajo cualquier resolución y factor de escala de Minecraft Forge 1.12.2 (GUI Scale 1, 2, 3, 4 y Auto).

---

## 1. El Problema del Escalado en Minecraft

Minecraft calcula las dimensiones lógicas de la pantalla (`ScaledResolution`) dividiendo la resolución en píxeles reales de la ventana entre el factor de escala:

$$\text{scaledWidth} = \left\lfloor \frac{\text{displayWidth}}{\text{scaleFactor}} \right\rfloor, \quad \text{scaledHeight} = \left\lfloor \frac{\text{displayHeight}}{\text{scaleFactor}} \right\rfloor$$

Si utiliza dimensiones absolutas y coordenadas fijas `(X, Y)`, su interfaz fallará y se cortará en pantallas de escala grande (Scale 3 y 4). Es por esto que el posicionamiento fijo se considera un **antipatrón severo**.

---

## 2. Los Cuatro Pilares del Estándar Responsivo X4UI

Para construir UIs verdaderamente robustas y escalables, se deben seguir estas cuatro reglas de oro:

---

### Pilar 1: Dimensionamiento Porcentual Fluido en `GuiComponent`

`GuiComponent` cuenta con soporte nativo para dimensiones y coordenadas dinámicamente relativas al componente padre mediante la API fluida:

```java
// Ocupar el 100% del ancho del contenedor padre
card.withPercentWidth(1.0f);

// Dividir en dos columnas al 50% de ancho
colLeft.withPercentWidth(0.5f);
colRight.withPercentWidth(0.5f);

// Fijar ancho y alto porcentuales simultáneamente
modal.withPercentSize(0.8f, 0.6f); // 80% ancho, 60% alto

// Posicionamiento porcentual manual (centrado al 50% X)
badge.withPercentPosition(0.5f, 0.1f);
```

#### Métodos Fluent Responsivos:
- `.withPercentWidth(float percent)`
- `.withPercentHeight(float percent)`
- `.withPercentSize(float percentWidth, float percentHeight)`
- `.withPercentPosition(float percentX, float percentY)`

*Nota: Pasar `-1.0f` desactiva el cálculo porcentual.*

---

### Pilar 2: `FlexLayout`, Alineación (`FlexAlign`) y Primitivas Fluentes

Siempre que agrupe varios elementos, utilice los constructores semánticos de `GuiPanel` en lugar de calcular coordenadas manuales:

```java
// Ventana modal centrada estándar (con dimBackground automático en GuiBaseScreen)
GuiPanel window = createCenteredWindow(420, 300);

// Encabezado en fila con título a la izquierda y botón cerrar a la derecha
GuiPanel header = GuiPanel.row(8);
header.addChild(new GuiLabel(0, 0, "Panel de Control", 0xFFFFFFFF));
header.addChild(GuiPanel.spacer());
header.addChild(new GuiButton(0, 0, 20, 20, "X", this::closeScreen));

// Tarjeta de sección con tema, padding y altura automática (hugContent)
GuiPanel section = GuiPanel.card(10, 6);
```

#### Alineación con `FlexAlign`:
`FlexLayout` soporta `FlexAlign.START`, `CENTER`, `END` y `STRETCH` tanto en el eje transversal (`setAlignItems`) como en el eje principal (`setJustifyContent`), además de `GuiPanel.spacer()` para empujar elementos a los extremos.

#### Control de Tamaño del Contenedor Padre (`hugContent`):
Por defecto en `r1.0b5`, `FlexLayout` es **no destructivo** (`hugContent = false`): respeta fielmente el tamaño del contenedor padre si este tiene dimensiones fijas o responsivas por porcentaje (`withPercentWidth`/`withPercentHeight`).

Si deseas que el contenedor padre **abrace y adapte automáticamente su tamaño** a la suma total de sus hijos (comportamiento "Hug / Fit Content"), debes indicarlo explícitamente:

```java
// El contenedor padre ajustará su altura/ancho exactamente al contenido de sus hijos
FlexLayout layout = new FlexLayout(FlexDirection.VERTICAL, 8, false)
    .withHugContent(true);

panel.setLayoutManager(layout);
```

> [!NOTE]
> - Si `hugContent` es `false` (por defecto): el panel padre mantiene su tamaño asignado (o porcentaje), ideal para modales centrados, sidebars fijos o vistas divididas.
> - Si `hugContent` es `true`: el panel padre se expande o contrae dinámicamente según la cantidad y tamaño de sus hijos visibles, ideal para tarjetas dinámicas, popups flotantes o paneles de items dentro de un scroll.

> [!WARNING]
> **El Bucle de Tamaños en FlexLayout con Hug Content:**
> Si un contenedor usa `FlexDirection.VERTICAL` con `hugContent(true)`, el contenedor calculará su altura sumando la altura de todos sus hijos. Por ende, los hijos **no pueden** usar `withPercentHeight(...)` (un hijo no puede tomar el 100% de la altura de un padre que a su vez está tratando de calcular su altura en base al hijo).
> 
> **Regla universal para FlexLayout VERTICAL:**
> Los contenedores deben usar `.withPercentWidth(1.0f)` para expandirse horizontalmente. Los hijos de su interior también deben usar `.withPercentWidth(1.0f)` (o fracciones). **El alto (height) de los hijos debe ser absoluto (en píxeles)** para que el motor apile todo verticalmente.

---

### Pilar 3: Contención Obligatoria en `GuiScrollPanel`

**Regla de Oro:** *Todo contenido vertical (listas, formularios, flujos de paneles) debe residir dentro de un `GuiScrollPanel`.*

En GUI Scale 1x y 2x, la altura de la pantalla es grande y el `GuiScrollPanel` no mostrará barra de desplazamiento. En GUI Scale 4x, la altura disponible puede ser minúscula y el scroll se activará automáticamente, asegurando accesibilidad al 100% del contenido.

**Cuidado con el Ancho en Scrolls:** 
El contenedor interno de un `GuiScrollPanel` se expone mediante `.getContentPanel()`. Para asegurar que todo su interior crezca responsivamente, use la regla del Pilar 2:

```java
// Scroll vertical responsivo listo para usar (contentPanel ya usa VERTICAL, hugContent=true y 100% ancho)
GuiScrollPanel scrollPanel = GuiScrollPanel.vertical(180, 6);
```

---

### Pilar 4: Nunca Destruir la Jerarquía en OnScreenResize

**Antipatrón estrictamente prohibido:** Sobreescribir `onScreenResize()` en el *Screen* principal y ejecutar un método como `initComponents()` que borre todos los componentes y los vuelva a instanciar de cero usando `this.width` para darles un nuevo tamaño.

Gracias a `FlexLayout` y `withPercentWidth`, los contenedores recalcularán y acomodarán absolutamente todos sus hijos de manera automática cuando el jugador redimensiona la pantalla, preservando el estado de inputs de texto, posiciones de scroll y focos de teclado sin interrupción.

---

## Qué Evitar Hacer (Antipatrones Críticos Responsivos)

> [!CAUTION]
> **1. NUNCA usar Coordenadas Absolutas (X,Y) para posicionamiento estructural.**
> Las declaraciones como `new GuiButton(340, 150, ...)` provocarán superposiciones y pantallas rotas. Use anchos de `0` y deléguele la responsabilidad a `FlexLayout` y `.withPercentWidth()`.

> [!CAUTION]
> **2. NUNCA purgar y recrear la interfaz durante `onScreenResize`.**
> Recrear miles de componentes interrumpe ciclos de vida, cancela `GuiAnimator`s y causa fugas de estado si no se maneja bien. Confíe en el motor de diseño.

> [!WARNING]
> **3. NUNCA crear un layout Horizontal con Wrap (FlexWrap = true) sin Heights explícitos.**
> Si sus componentes envuelven a una nueva línea, la fila entera colapsará visualmente si no ha definido la altura base absoluta de cada elemento en la fila.
[/ES]

[EN]
# 04 - Responsive Design & Relative Positioning (GUI Scale 1x to 4x)

This document describes the official responsive design standard in X4UI. By enforcing the use of `FlexLayout` and percentage-based sizing, we guarantee that interfaces remain perfectly readable and aligned under any resolution and Minecraft Forge 1.12.2 scale factor (GUI Scale 1, 2, 3, 4, and Auto).

---

## 1. The Minecraft Scaling Problem

Minecraft calculates logical screen dimensions (`ScaledResolution`) by dividing the actual pixel resolution of the window by the scale factor:

$$\text{scaledWidth} = \left\lfloor \frac{\text{displayWidth}}{\text{scaleFactor}} \right\rfloor, \quad \text{scaledHeight} = \left\lfloor \frac{\text{displayHeight}}{\text{scaleFactor}} \right\rfloor$$

If you use absolute dimensions and fixed `(X, Y)` coordinates, your interface will fail and clip out of bounds on large scales (Scale 3 and 4). This is why fixed absolute positioning is considered a **severe anti-pattern**.

---

## 2. The Four Pillars of the X4UI Responsive Standard

To build truly robust and scalable UIs, these four golden rules must be followed:

---

### Pillar 1: Fluent Percentage Sizing in `GuiComponent`

`GuiComponent` features native support for dimensions and coordinates dynamically relative to the parent component via the fluent API:

```java
// Occupy 100% of the parent container's width
card.withPercentWidth(1.0f);

// Divide into two 50% width columns
colLeft.withPercentWidth(0.5f);
colRight.withPercentWidth(0.5f);

// Set both percentage width and height simultaneously
modal.withPercentSize(0.8f, 0.6f); // 80% width, 60% height

// Manual percentage positioning (centered at 50% X)
badge.withPercentPosition(0.5f, 0.1f);
```

#### Responsive Fluent Methods:
- `.withPercentWidth(float percent)`
- `.withPercentHeight(float percent)`
- `.withPercentSize(float percentWidth, float percentHeight)`
- `.withPercentPosition(float percentX, float percentY)`

*Note: Passing `-1.0f` disables percentage calculations.*

---

### Pillar 2: `FlexLayout`, Alignment (`FlexAlign`) & Fluent Primitives

Whenever grouping multiple elements, use `GuiPanel` semantic builders instead of computing manual coordinates:

```java
// Standard centered modal window (with automatic dimBackground in GuiBaseScreen)
GuiPanel window = createCenteredWindow(420, 300);

// Header row with title on the left and close button on the right
GuiPanel header = GuiPanel.row(8);
header.addChild(new GuiLabel(0, 0, "Control Panel", 0xFFFFFFFF));
header.addChild(GuiPanel.spacer());
header.addChild(new GuiButton(0, 0, 20, 20, "X", this::closeScreen));

// Section card with theme, padding, and automatic height (hugContent)
GuiPanel section = GuiPanel.card(10, 6);
```

#### Alignment with `FlexAlign`:
`FlexLayout` supports `FlexAlign.START`, `CENTER`, `END`, and `STRETCH` on both the cross axis (`setAlignItems`) and main axis (`setJustifyContent`), as well as `GuiPanel.spacer()` to push items to opposite ends.

#### Parent Container Sizing Control (`hugContent`):
Starting in `r1.0b5`, `FlexLayout` is **non-destructive** by default (`hugContent = false`): it respects the explicit or responsive percentage dimensions of the parent container (`withPercentWidth`/`withPercentHeight`).

If you want the parent container to **automatically hug and adapt its size** to the combined dimensions of its visible children ("Hug / Fit Content" behavior), enable it explicitly:

```java
// Parent container will resize its height/width to fit its children exactly
FlexLayout layout = new FlexLayout(FlexDirection.VERTICAL, 8, false)
    .withHugContent(true);

panel.setLayoutManager(layout);
```

> [!NOTE]
> - When `hugContent` is `false` (default): the parent panel preserves its defined size (or percentage), making it ideal for centered dialogs, fixed sidebars, or split panes.
> - When `hugContent` is `true`: the parent panel dynamically expands or contracts depending on its visible children, ideal for dynamic cards, floating popups, or item containers inside a scroll panel.

> [!WARNING]
> **The FlexLayout Sizing Loop with Hug Content:**
> If a container uses `FlexDirection.VERTICAL` with `hugContent(true)`, the container calculates its height by summing all child heights. Therefore, children **cannot** use `.withPercentHeight(...)` (a child cannot take 100% height of a parent whose height depends on that child).
> 
> **Universal Rule for VERTICAL FlexLayout:**
> Containers should use `.withPercentWidth(1.0f)` to expand horizontally. Their internal children should also use `.withPercentWidth(1.0f)` (or fractions). **The height of the children must be absolute (in pixels)** so the engine can properly stack them vertically.

---

### Pillar 3: Mandatory Containment in `GuiScrollPanel`

**Golden Rule:** *All vertical content (lists, forms, panel flows) must reside inside a `GuiScrollPanel`.*

In GUI Scale 1x and 2x, screen height is large and the `GuiScrollPanel` won't display a scrollbar. In GUI Scale 4x, the available height can be minuscule, and scrolling will automatically activate, ensuring 100% content accessibility.

**Beware of ScrollPanel Content Widths:** 
The internal container of a `GuiScrollPanel` is exposed via `.getContentPanel()`. To ensure everything inside it grows responsively, apply the rule from Pillar 2:

```java
// Ready-to-use responsive vertical scroll (contentPanel uses VERTICAL, hugContent=true, 100% width)
GuiScrollPanel scrollPanel = GuiScrollPanel.vertical(180, 6);
```

---

### Pillar 4: Never Destroy Hierarchy in OnScreenResize

**Strictly prohibited anti-pattern:** Overwriting `onScreenResize()` in the main *Screen* class and executing methods like `initComponents()` which clear all components and re-instantiate them from scratch using the new `this.width`.

Thanks to `FlexLayout` and `.withPercentWidth()`, containers will automatically recalculate and arrange absolutely all of their children when the player resizes the screen, preserving text input states, scroll positions, and keyboard focus without interruption.

---

## What To Avoid (Critical Responsive Anti-Patterns)

> [!CAUTION]
> **1. NEVER use Absolute Coordinates (X,Y) for structural positioning.**
> Statements like `new GuiButton(340, 150, ...)` will cause clipping and broken screens. Use `0` for widths and coordinates, and delegate the responsibility to `FlexLayout` and `.withPercentWidth()`.

> [!CAUTION]
> **2. NEVER purge and recreate the UI during `onScreenResize`.**
> Recreating thousands of components interrupts lifecycles, cancels `GuiAnimator` instances, and causes state leaks if not handled perfectly. Trust the layout engine.

> [!WARNING]
> **3. NEVER create a Horizontal layout with Wrap (`FlexWrap = true`) without explicit Heights.**
> If your components wrap to a new line, the entire row will visually collapse if you haven't defined the base absolute height of each element in the row.
[/EN]
