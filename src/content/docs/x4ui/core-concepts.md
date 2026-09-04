---
title: "Core Concepts"
project: "X4UI"
category: "General"
categoryOrder: 1
order: 1
---

[ES]
# Conceptos Fundamentales

Este documento describe los sistemas base de X4UI: el árbol de componentes, el sistema de coordenadas, el motor de diseño, la propagación de eventos, el estado reactivo, los temas, la API builder, las animaciones y la gestión de memoria.

## 1. Árbol de Componentes

X4UI utiliza un árbol de componentes de modo retenido (patrón Composite). Cada elemento UI extiende `GuiComponent`. Los componentes forman una jerarquía padre-hijo con raíz en `rootPanel`.

```
rootPanel (GuiPanel)
├── headerPanel (GuiPanel)
│   ├── GuiLabel "Title"
│   └── GuiButton "Close"
├── contentPanel (GuiScrollPanel)
│   ├── GuiButton "Item 1"
│   ├── GuiButton "Item 2"
│   └── GuiButton "Item 3"
└── footerPanel (GuiPanel)
    └── GuiSliderInt
```

### Agregar y Eliminar Hijos

```java
GuiPanel panel = new GuiPanel(0, 0, 200, 300);
GuiButton btn = new GuiButton(0, 0, 100, 20, "Click", () -> {});

panel.addChild(btn);       // Agrega btn como hijo de panel
panel.removeChild(btn);    // Elimina btn de panel
panel.clearChildren();     // Elimina todos los hijos
panel.getChildren();       // Devuelve la lista de hijos
```

### Ciclo de Vida del Componente

1. **Construcción** -- `new GuiComponent(x, y, width, height)` establece la posición y el tamaño.
2. **Adjunción** -- `addChild()` establece la referencia al padre y marca al padre como dirty.
3. **Tick** -- `tick(float deltaTime)` se llama cada cuadro. Ejecuta el diseño pendiente y luego ejecuta el tick de todos los hijos.
4. **Renderizado** -- `render(mouseX, mouseY, partialTicks)` llama a `renderSelf()` y luego a `renderChildren()`.
5. **Destrucción** -- `destroy()` ejecuta todos los desvinculadores (de `bindState()`), luego destruye todos los hijos.

Cuando una pantalla se cierra (`onGuiClosed()`), `rootPanel.destroy()` se llama automáticamente, lo que desencadena `destroy()` en cada componente del árbol.

## 2. Sistema de Coordenadas

Todas las coordenadas son **relativas al componente padre**. Un hijo en `(x: 10, y: 10)` dentro de un padre en `(x: 50, y: 50)` se renderiza en la posición de pantalla `(60, 60)`.

```java
GuiPanel parent = new GuiPanel(50, 50, 200, 200);
GuiButton child = new GuiButton(10, 10, 80, 20, "Button", null);
parent.addChild(child);

// child.getAbsoluteX() == 60
// child.getAbsoluteY() == 60
```

Los métodos `getAbsoluteX()` y `getAbsoluteY()` recorren la cadena de padres para calcular la posición en espacio de pantalla.

### Recorte con OpenGL Scissor

Los componentes hijos renderizados fuera de los límites del padre se recortan mediante OpenGL scissor. Esto se aplica automáticamente en `GuiScrollPanel` y cualquier contenedor que sobrescriba `renderChildren()`.

## 3. Diseño Flexbox (`FlexLayout`)

`GuiPanel` utiliza un gestor de diseño `FlexLayout` que dispone los hijos secuencialmente. Cuando se establece una dirección flex, los hijos ignoran sus valores estáticos `x/y` y son posicionados por el motor de diseño.

### FlexDirection

```java
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

panel.setFlexDirection(FlexDirection.VERTICAL);    // Apila hijos de arriba a abajo
panel.setFlexDirection(FlexDirection.HORIZONTAL);  // Apila hijos de izquierda a derecha
panel.setFlexDirection(FlexDirection.ABSOLUTE);    // Los hijos usan su propio x/y (por defecto)
```

### Espaciado (Gap)

```java
panel.setGap(5);  // 5px de espacio entre cada hijo
```

### Envoltura Flex (Flex Wrap)

```java
panel.setFlexWrap(true);  // Envuelve hijos a la siguiente fila/columna cuando exceden las dimensiones del padre
```

### Comportamiento del Diseño

- **VERTICAL**: Los hijos se apilan de arriba a abajo. La altura del padre se ajusta automáticamente para容纳 a todos los hijos (a menos que `flexWrap` esté habilitado).
- **HORIZONTAL**: Los hijos se apilan de izquierda a derecha. El ancho del padre se ajusta automáticamente para容纳 a todos los hijos (a menos que `flexWrap` esté habilitado).
- **ABSOLUTE**: Sin posicionamiento automático. Cada hijo usa sus propios valores `x/y`.
- El `padding` del padre crea espacio interno. El `margin` del hijo crea espacio exterior alrededor de cada hijo.
- Los hijos invisibles son omitidos por el motor de diseño.

### Ejemplo Completo

```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.client.gui.utils.Insets;

GuiPanel form = new GuiPanel(10, 10, 200, 250);
form.setFlexDirection(FlexDirection.VERTICAL);
form.setGap(4);
form.setPadding(new Insets(8));

form.addChild(new GuiButton(0, 0, 180, 20, "Save", () -> System.out.println("Saved")));
form.addChild(new GuiButton(0, 0, 180, 20, "Cancel", () -> System.out.println("Cancelled")));
form.addChild(new GuiButton(0, 0, 180, 20, "Delete", () -> System.out.println("Deleted")));
```

Los botones se apilan verticalmente con 4px de espacio, dentro de un área de 8px de padding.

## 4. Insets (Padding y Margin)

`Insets` es un objeto de valor inmutable para espaciado, análogo al atajo de CSS.

```java
import com.x4yi.x4ui.client.gui.utils.Insets;

new Insets(5);              // Todos los lados: 5
new Insets(5, 10);          // Vertical: 5, Horizontal: 10
new Insets(2, 4, 6, 8);    // Arriba: 2, Derecha: 4, Abajo: 6, Izquierda: 8
Insets.ZERO;                // Constante sin espaciado
```

Aplicar a componentes:

```java
panel.setPadding(new Insets(10));          // Espacio interno dentro del panel
button.setMargin(new Insets(0, 0, 5, 0)); // 5px de margen debajo del botón
```

## 5. Sistema de Eventos

Los eventos se propagan desde el componente raíz hacia abajo a través del árbol. La raíz (`GuiBaseScreen` o `GuiBaseContainer`) recibe eventos crudos de Minecraft y los reenvía a `rootPanel`.

### Tipos de Evento

| Evento | Método | Descripción |
|--------|--------|-------------|
| Clic del ratón | `onMouseClick(mouseX, mouseY, mouseButton)` | Izquierdo (0), derecho (1), medio (2) |
| Liberación del ratón | `onMouseRelease(mouseX, mouseY, state)` | Después de liberar el clic |
| Arrastre del ratón | `onMouseDrag(mouseX, mouseY, button, timeSinceLastClick)` | Mientras el botón está presionado |
| Desplazamiento del ratón | `onMouseScroll(mouseX, mouseY, wheel)` | Rueda de desplazamiento |
| Tecla presionada | `onKeyPress(typedChar, keyCode)` | Entrada de teclado |

### Orden de Propagación

Los eventos iteran los hijos en **orden de renderizado inverso** (el hijo con mayor capa/primer plano primero). Si un hijo retorna `true` desde un manejador de eventos, la propagación se detiene (el evento es consumido).

```java
GuiButton btn = new GuiButton(0, 0, 100, 20, "Click", null);

// Sobrescribir onMouseClick para agregar comportamiento personalizado
@Override
public boolean onMouseClick(int mouseX, int mouseY, int mouseButton) {
    if (super.onMouseClick(mouseX, mouseY, mouseButton)) {
        return true; // Ya fue manejado por un hijo
    }
    if (isMouseOver(mouseX, mouseY) && mouseButton == 0) {
        System.out.println("Custom click logic");
        return true; // Consumido
    }
    return false; // No manejado
}
```

### Gestión del Foco

Solo un componente puede tener el foco a la vez. El foco se almacena en el componente raíz.

```java
textField.requestFocus();   // Otorga el foco al campo de texto
textField.clearFocus();     // Elimina el foco
textField.isFocused();      // Retorna true si tiene el foco
```

El foco se elimina automáticamente al hacer clic fuera del componente enfocado.

## 6. Estado Reactivo (`State<T>`)

`State<T>` es un contenedor reactivo que notifica a los listeners cuando su valor cambia. Es el mecanismo principal para el enlace de datos en X4UI.

```java
import com.x4yi.x4ui.common.State;

State<Integer> counter = new State<>(0);

// Escuchar cambios
counter.addListener(value -> System.out.println("Counter: " + value));

counter.set(1);  // Imprime: Counter: 1
counter.set(5);  // Imprime: Counter: 5
counter.set(5);  // No imprime (valor sin cambio, deduplicado)
```

### Estado Derivado con `map()`

```java
State<Integer> count = new State<>(0);
State<String> label = count.map(c -> "Count: " + c);

label.addListener(System.out::println);

count.set(1);  // Imprime: Count: 1
count.set(2);  // Imprime: Count: 2
```

### Enlazar Estado a Componentes

Use `bindState()` en cualquier `GuiComponent` para actualizar automáticamente cuando el estado cambia. La función de回调 se garantiza que se ejecute en el hilo de renderizado. Los enlaces se eliminan automáticamente cuando se llama `destroy()`.

```java
State<Boolean> showButton = new State<>(true);

GuiButton btn = new GuiButton(0, 0, 100, 20, "Dynamic", () -> {});

btn.bindState(showButton, visible -> btn.setVisible(visible));

// Después: showButton.set(false) oculta el botón
// showButton.set(true) lo muestra de nuevo
```

### Enlazar Estado mediante GuiBuilder

```java
State<Boolean> enabled = new State<>(false);

GuiBuilder.createButton("Submit")
    .position(10, 10)
    .size(100, 20)
    .bindEnabled(enabled)
    .build();

// Después: enabled.set(true) habilita el botón
```

### Estado en Contenedores

`State<T>` se encuentra en `com.x4yi.x4ui.common`, lo que lo hace seguro para usar tanto en cliente como en servidor. Para la sincronización de servidor a cliente, use `NetworkSyncHelper` (véase `networking-and-sync.md`).

## 7. Temas (`ITheme`)

Los temas definen todos los estilos visuales usados por los componentes. Cada componente resuelve su tema recorriendo la cadena de padres. Si no se encuentra ningún tema, se usa `DefaultTheme.INSTANCE`.

### DefaultTheme

El tema oscuro integrado con colores inspirados en Material Design:

| Token | Color | Descripción |
|-------|-------|-------------|
| Primary | `0xFF3B82F6` | Acento azul |
| Background | `0xFF1F2937` | Gris oscuro |
| Text | `0xFFF3F4F6` | Gris claro |
| Button BG | `0x80000000` | Negro semitransparente |
| Button Hover | `0xFF29B6F6` | Azul claro |
| Slider Fill | `0xFF29B6F6` | Azul claro |

### Aplicar un Tema

```java
import com.x4yi.x4ui.client.gui.utils.DefaultTheme;

// Aplicar a toda la pantalla
setTheme(DefaultTheme.INSTANCE);

// Aplicar a un subárbol específico
myPanel.setTheme(customTheme);
```

### Implementar un Tema Personalizado

```java
import com.x4yi.x4ui.client.gui.utils.ITheme;
import com.x4yi.x4ui.client.gui.component.GuiComponent;
import java.util.List;

public class MyTheme implements ITheme {
    @Override public int getPrimaryColor()           { return 0xFF6200EA; }
    @Override public int getSecondaryColor()          { return 0xFF03DAC5; }
    @Override public int getBackgroundColor()         { return 0xFF121212; }
    @Override public int getTextColor()               { return 0xFFE0E0E0; }
    @Override public int getDisabledTextColor()       { return 0xFF757575; }
    @Override public int getButtonBackgroundColor()   { return 0x80000000; }
    @Override public int getButtonHoverColor()        { return 0xFF6200EA; }
    @Override public int getButtonDisabledColor()     { return 0x40000000; }
    @Override public int getScrollbarTrackColor()     { return 0xFF2C2C36; }
    @Override public int getScrollbarThumbColor()     { return 0xFF555560; }
    @Override public int getScrollbarThumbHoverColor(){ return 0xFF777782; }
    @Override public int getSliderTrackColor()        { return 0xFF2C2C36; }
    @Override public int getSliderFillColor()         { return 0xFF6200EA; }
    @Override public int getSliderHandleColor()       { return 0xFFBBBBCC; }
    @Override public int getSliderHandleHoverColor()  { return 0xFFFFFFFF; }
    @Override public int getTextInputBackgroundColor(){ return 0xFF16161E; }
    @Override public int getTextInputBorderColor()    { return 0xFF2C2C36; }
    @Override public int getTextInputFocusedBorderColor() { return 0xFF6200EA; }
    @Override public int getTooltipBackgroundColor()  { return 0xE01A1A24; }
    @Override public int getTooltipBorderColor()      { return 0xFF3B3B48; }
    @Override public int getTooltipTextColor()        { return 0xFFE0E0E0; }
    @Override public int getTooltipPadding()          { return 6; }
    @Override public int getTooltipGap()              { return 2; }

    @Override
    public void drawTooltip(List<String> lines, int mouseX, int mouseY, int screenW, int screenH) {
        // Implementar renderizado de tooltip
    }

    @Override
    public void drawTooltipComponent(GuiComponent component, int mouseX, int mouseY, int screenW, int screenH) {
        // Implementar renderizado de componente tooltip personalizado
    }
}
```

## 8. Tooltips

Cualquier `GuiComponent` puede mostrar un tooltip al pasar el cursor. Los tooltips son renderizados por el tema.

### Tooltip de Texto

```java
button.setTooltip("Click to save your progress");
```

### Tooltip Multilínea

Use `\n` para saltos de línea:

```java
button.setTooltip("Line 1\nLine 2\nLine 3");
```

### Componente Tooltip Personalizado

Para tooltips enriquecidos, cree un componente personalizado:

```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

GuiPanel tooltipPanel = new GuiPanel(0, 0, 150, 60);
tooltipPanel.setFlexDirection(FlexDirection.VERTICAL);
tooltipPanel.addChild(new GuiLabel(0, 0, "Custom Tooltip", 0xFF00E5FF));
tooltipPanel.addChild(new GuiLabel(0, 0, "With multiple lines", 0xFFAAAAAA));

button.setTooltipComponent(tooltipPanel);
```

### Propagación de Tooltips

Los tooltips se resuelven recorriendo la cadena de padres. Si un hijo no tiene tooltip, se usa el tooltip del padre. El componente más profundo con tooltip bajo el cursor es el que se muestra.

## 9. Sistema de Dirty Flags (Rendimiento)

X4UI utiliza un modelo de evaluación perezosa con dirty flags para evitar recálculos innecesarios:

- `requestLayout()` -- Marca el componente como necesitando re-diseño. El motor de diseño se ejecuta en el siguiente `tick()`.
- `requestRender()` -- Marca el componente como necesitando re-ordenación del orden de renderizado. Los hijos se re-ordenan por `layer` en el siguiente renderizado.
- `markDirty()` -- Llama a `requestLayout()` y `requestRender()`.

El diseño y la ordenación de renderizado solo se ejecutan cuando los flags están activados. Mutar propiedades puramente visuales (por ejemplo, color, texto) sin cambiar posición o tamaño evita activar el recálculo del diseño.

```java
// Esto NO activa el recálculo del diseño
label.setText("New text");

// Esto SÍ activa el recálculo del diseño
button.setWidth(200);
button.setHeight(30);
```

## 10. Sistema de Capas (Z-Index)

Cada componente tiene un entero `layer`. Los hijos se renderizan en orden ascendente de capa. Las capas más altas se renderizan encima.

```java
background.setLayer(0);   // Se renderiza primero (detrás)
foreground.setLayer(10);  // Se renderiza último (al frente)
popup.setLayer(100);      // Se renderiza encima de todo
```

El componente `GuiDropdown` usa `layer = 100` por defecto para que su popup se renderice encima de otros componentes.

## 11. Motor de Animación (`GuiAnimator`)

Un sistema de animación de propiedades basado en tiempo con funciones de aceleración (easing).

```java
import com.x4yi.x4ui.client.gui.animation.GuiAnimator;
import com.x4yi.x4ui.client.gui.animation.GuiAnimator.Easing;

// Animar una propiedad float de 0 a 1 en 500ms con ease-out
GuiAnimator.animate(
    myComponent,           // objeto objetivo
    "opacity",             // nombre de la propiedad (String)
    0.0f,                  // valor inicial
    1.0f,                  // valor final
    500,                   // duración en milisegundos
    Easing.EASE_OUT,       // función de aceleración
    new GuiAnimator.AnimationCallback() {
        @Override public void onUpdate(float value) {
            // Llamado cada cuadro con el valor interpolado
        }
        @Override public void onComplete() {
            // Llamado cuando la animación termina
        }
    }
);
```

### Funciones de Aceleración

| Aceleración | Descripción |
|-------------|-------------|
| `LINEAR` | Velocidad constante |
| `EASE_IN` | Inicio lento, final rápido |
| `EASE_OUT` | Inicio rápido, final lento |
| `EASE_IN_OUT` | Inicio y final lentos |

### Notas Importantes

- `GuiAnimator.update()` se debe llamar cada cuadro para actualizar las animaciones.
- Las animaciones en el mismo objetivo+propiedad se reemplazan (solo una activa por propiedad).
- Llame a `GuiAnimator.clearAnimations()` para cancelar todas las animaciones activas.

## 12. Caché de Ancho de Fuente

`FontWidthCache` proporciona una caché LRU por mod para los resultados de `FontRenderer.getStringWidth()`. Esto previene fugas de memoria en UIs con mucho texto (por ejemplo, `GuiMarkdown`) limitando las entradas en caché a 10,000 por namespace de mod.

```java
import com.x4yi.x4ui.client.gui.utils.FontWidthCache;

// Usar en componentes personalizados
int width = FontWidthCache.getStringWidth(fontRenderer, "Hello World", "mymod");

// Limpiar la caché cuando ya no se necesite
FontWidthCache.clearCache("mymod");
FontWidthCache.clearAll();
```

## 13. ScissorHelper

`ScissorHelper` gestiona regiones de scissor OpenGL anidadas. Cada `pushScissor()` intersecciona con la región de scissor actual (semántica similar a `overflow: hidden` de CSS).

```java
import com.x4yi.x4ui.client.gui.utils.ScissorHelper;

ScissorHelper.pushScissor(x * scale, y * scale, w * scale, h * scale);
// ... renderizar contenido recortado ...
ScissorHelper.popScissor();
```

Esto se usa internamente por `GuiScrollPanel` para el recorte de desplazamiento. Los componentes que se renderizan fuera de la región de scissor son recortados.

## 14. Delta Time

`GuiBaseScreen.deltaTime` es un float estático (en segundos) que representa el tiempo entre el cuadro actual y el anterior. Está limitado a 0.1s para evitar saltos de animación después de picos de latencia.

```java
float dt = GuiBaseScreen.deltaTime;
float speed = 10f * dt; // Velocidad independiente de FPS
```

Todos los componentes integrados usan delta time para animaciones (interpolación de hover, animación de toggle, suavizado de desplazamiento).
[/ES]

[EN]
# Core Concepts

This document covers the foundational systems of X4UI: the component tree, coordinate system, layout engine, event propagation, reactive state, theming, the builder API, animation, and memory management.

## 1. Component Tree

X4UI uses a retained-mode component tree (Composite pattern). Every UI element extends `GuiComponent`. Components form a parent-child hierarchy rooted at `rootPanel`.

```
rootPanel (GuiPanel)
├── headerPanel (GuiPanel)
│   ├── GuiLabel "Title"
│   └── GuiButton "Close"
├── contentPanel (GuiScrollPanel)
│   ├── GuiButton "Item 1"
│   ├── GuiButton "Item 2"
│   └── GuiButton "Item 3"
└── footerPanel (GuiPanel)
    └── GuiSliderInt
```

### Adding and Removing Children

```java
GuiPanel panel = new GuiPanel(0, 0, 200, 300);
GuiButton btn = new GuiButton(0, 0, 100, 20, "Click", () -> {});

panel.addChild(btn);       // Adds btn as a child of panel
panel.removeChild(btn);    // Removes btn from panel
panel.clearChildren();     // Removes all children
panel.getChildren();       // Returns the children list
```

### Component Lifecycle

1. **Construction** -- `new GuiComponent(x, y, width, height)` sets position and size.
2. **Attachment** -- `addChild()` sets the parent reference and marks the parent dirty.
3. **Tick** -- `tick(float deltaTime)` is called each frame. Runs pending layout, then ticks all children.
4. **Render** -- `render(mouseX, mouseY, partialTicks)` calls `renderSelf()` then `renderChildren()`.
5. **Destroy** -- `destroy()` runs all unbinders (from `bindState()`), then destroys all children.

When a screen closes (`onGuiClosed()`), `rootPanel.destroy()` is called automatically, which cascades `destroy()` to every component in the tree.

## 2. Coordinate System

All coordinates are **relative to the parent component**. A child at `(x: 10, y: 10)` inside a parent at `(x: 50, y: 50)` renders at screen position `(60, 60)`.

```java
GuiPanel parent = new GuiPanel(50, 50, 200, 200);
GuiButton child = new GuiButton(10, 10, 80, 20, "Button", null);
parent.addChild(child);

// child.getAbsoluteX() == 60
// child.getAbsoluteY() == 60
```

The `getAbsoluteX()` and `getAbsoluteY()` methods walk up the parent chain to compute the screen-space position.

### OpenGL Scissor Clipping

Child components rendered outside their parent's bounds are clipped via OpenGL scissor. This is applied automatically by `GuiScrollPanel` and any container that overrides `renderChildren()`.

## 3. Flexbox Layout (`FlexLayout`)

`GuiPanel` uses a `FlexLayout` manager that arranges children sequentially. When a flex direction is set, children ignore their static `x/y` values and are positioned by the layout engine.

### FlexDirection

```java
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

panel.setFlexDirection(FlexDirection.VERTICAL);    // Stack children top-to-bottom
panel.setFlexDirection(FlexDirection.HORIZONTAL);  // Stack children left-to-right
panel.setFlexDirection(FlexDirection.ABSOLUTE);    // Children use their own x/y (default)
```

### Gap

```java
panel.setGap(5);  // 5px spacing between each child
```

### Flex Wrap

```java
panel.setFlexWrap(true);  // Wraps children to the next row/column when they exceed the parent's dimensions
```

### Layout Behavior

- **VERTICAL**: Children are stacked top-to-bottom. The parent's height auto-sizes to fit all children (unless `flexWrap` is enabled).
- **HORIZONTAL**: Children are stacked left-to-right. The parent's width auto-sizes to fit all children (unless `flexWrap` is enabled).
- **ABSOLUTE**: No automatic positioning. Each child uses its own `x/y` values.
- Parent `padding` creates inner spacing. Child `margin` creates outer spacing around each child.
- Invisible children are skipped by the layout engine.

### Full Example

```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.client.gui.utils.Insets;

GuiPanel form = new GuiPanel(10, 10, 200, 250);
form.setFlexDirection(FlexDirection.VERTICAL);
form.setGap(4);
form.setPadding(new Insets(8));

form.addChild(new GuiButton(0, 0, 180, 20, "Save", () -> System.out.println("Saved")));
form.addChild(new GuiButton(0, 0, 180, 20, "Cancel", () -> System.out.println("Cancelled")));
form.addChild(new GuiButton(0, 0, 180, 20, "Delete", () -> System.out.println("Deleted")));
```

The buttons are stacked vertically with 4px gaps, inside an 8px padding area.

## 4. Insets (Padding and Margin)

`Insets` is an immutable value object for spacing, analogous to CSS shorthand.

```java
import com.x4yi.x4ui.client.gui.utils.Insets;

new Insets(5);              // All sides: 5
new Insets(5, 10);          // Vertical: 5, Horizontal: 10
new Insets(2, 4, 6, 8);    // Top: 2, Right: 4, Bottom: 6, Left: 8
Insets.ZERO;                // Constant for no spacing
```

Apply to components:

```java
panel.setPadding(new Insets(10));          // Inner spacing inside the panel
button.setMargin(new Insets(0, 0, 5, 0)); // 5px margin below the button
```

## 5. Event System

Events propagate from the root component down through the tree. The root (`GuiBaseScreen` or `GuiBaseContainer`) receives raw Minecraft events and forwards them to `rootPanel`.

### Event Types

| Event | Method | Description |
|-------|--------|-------------|
| Mouse click | `onMouseClick(mouseX, mouseY, mouseButton)` | Left (0), right (1), middle (2) |
| Mouse release | `onMouseRelease(mouseX, mouseY, state)` | After click release |
| Mouse drag | `onMouseDrag(mouseX, mouseY, button, timeSinceLastClick)` | While button held |
| Mouse scroll | `onMouseScroll(mouseX, mouseY, wheel)` | Scroll wheel |
| Key press | `onKeyPress(typedChar, keyCode)` | Keyboard input |

### Propagation Order

Events iterate children in **reverse render order** (topmost/highest-layer child first). If a child returns `true` from an event handler, propagation stops (the event is consumed).

```java
GuiButton btn = new GuiButton(0, 0, 100, 20, "Click", null);

// Override onMouseClick to add custom behavior
@Override
public boolean onMouseClick(int mouseX, int mouseY, int mouseButton) {
    if (super.onMouseClick(mouseX, mouseY, mouseButton)) {
        return true; // Already handled by a child
    }
    if (isMouseOver(mouseX, mouseY) && mouseButton == 0) {
        System.out.println("Custom click logic");
        return true; // Consumed
    }
    return false; // Not handled
}
```

### Focus Management

Only one component can be focused at a time. Focus is stored on the root component.

```java
textField.requestFocus();   // Gives focus to the text field
textField.clearFocus();     // Removes focus
textField.isFocused();      // Returns true if focused
```

Focus is automatically cleared when clicking outside the focused component.

## 6. Reactive State (`State<T>`)

`State<T>` is a reactive container that notifies listeners when its value changes. It is the primary mechanism for data binding in X4UI.

```java
import com.x4yi.x4ui.common.State;

State<Integer> counter = new State<>(0);

// Listen for changes
counter.addListener(value -> System.out.println("Counter: " + value));

counter.set(1);  // Prints: Counter: 1
counter.set(5);  // Prints: Counter: 5
counter.set(5);  // No print (value unchanged, deduplicated)
```

### Derived State with `map()`

```java
State<Integer> count = new State<>(0);
State<String> label = count.map(c -> "Count: " + c);

label.addListener(System.out::println);

count.set(1);  // Prints: Count: 1
count.set(2);  // Prints: Count: 2
```

### Binding State to Components

Use `bindState()` on any `GuiComponent` to automatically update when the state changes. The callback is guaranteed to run on the render thread. Bindings are automatically removed when `destroy()` is called.

```java
State<Boolean> showButton = new State<>(true);

GuiButton btn = new GuiButton(0, 0, 100, 20, "Dynamic", () -> {});

btn.bindState(showButton, visible -> btn.setVisible(visible));

// Later: showButton.set(false) hides the button
// showButton.set(true) shows it again
```

### Binding State via GuiBuilder

```java
State<Boolean> enabled = new State<>(false);

GuiBuilder.createButton("Submit")
    .position(10, 10)
    .size(100, 20)
    .bindEnabled(enabled)
    .build();

// Later: enabled.set(true) enables the button
```

### State in Containers

`State<T>` lives in `com.x4yi.x4ui.common`, making it safe to use on both client and server. For server-to-client synchronization, use `NetworkSyncHelper` (see `networking-and-sync.md`).

## 7. Theming (`ITheme`)

Themes define all visual styles used by components. Every component resolves its theme by walking up the parent chain. If no theme is found, `DefaultTheme.INSTANCE` is used.

### DefaultTheme

The built-in dark theme with Material Design-inspired colors:

| Token | Color | Description |
|-------|-------|-------------|
| Primary | `0xFF3B82F6` | Blue accent |
| Background | `0xFF1F2937` | Dark gray |
| Text | `0xFFF3F4F6` | Light gray |
| Button BG | `0x80000000` | Semi-transparent black |
| Button Hover | `0xFF29B6F6` | Light blue |
| Slider Fill | `0xFF29B6F6` | Light blue |

### Applying a Theme

```java
import com.x4yi.x4ui.client.gui.utils.DefaultTheme;

// Apply to entire screen
setTheme(DefaultTheme.INSTANCE);

// Apply to a specific subtree
myPanel.setTheme(customTheme);
```

### Implementing a Custom Theme

```java
import com.x4yi.x4ui.client.gui.utils.ITheme;
import com.x4yi.x4ui.client.gui.component.GuiComponent;
import java.util.List;

public class MyTheme implements ITheme {
    @Override public int getPrimaryColor()           { return 0xFF6200EA; }
    @Override public int getSecondaryColor()          { return 0xFF03DAC5; }
    @Override public int getBackgroundColor()         { return 0xFF121212; }
    @Override public int getTextColor()               { return 0xFFE0E0E0; }
    @Override public int getDisabledTextColor()       { return 0xFF757575; }
    @Override public int getButtonBackgroundColor()   { return 0x80000000; }
    @Override public int getButtonHoverColor()        { return 0xFF6200EA; }
    @Override public int getButtonDisabledColor()     { return 0x40000000; }
    @Override public int getScrollbarTrackColor()     { return 0xFF2C2C36; }
    @Override public int getScrollbarThumbColor()     { return 0xFF555560; }
    @Override public int getScrollbarThumbHoverColor(){ return 0xFF777782; }
    @Override public int getSliderTrackColor()        { return 0xFF2C2C36; }
    @Override public int getSliderFillColor()         { return 0xFF6200EA; }
    @Override public int getSliderHandleColor()       { return 0xFFBBBBCC; }
    @Override public int getSliderHandleHoverColor()  { return 0xFFFFFFFF; }
    @Override public int getTextInputBackgroundColor(){ return 0xFF16161E; }
    @Override public int getTextInputBorderColor()    { return 0xFF2C2C36; }
    @Override public int getTextInputFocusedBorderColor() { return 0xFF6200EA; }
    @Override public int getTooltipBackgroundColor()  { return 0xE01A1A24; }
    @Override public int getTooltipBorderColor()      { return 0xFF3B3B48; }
    @Override public int getTooltipTextColor()        { return 0xFFE0E0E0; }
    @Override public int getTooltipPadding()          { return 6; }
    @Override public int getTooltipGap()              { return 2; }

    @Override
    public void drawTooltip(List<String> lines, int mouseX, int mouseY, int screenW, int screenH) {
        // Implement tooltip rendering
    }

    @Override
    public void drawTooltipComponent(GuiComponent component, int mouseX, int mouseY, int screenW, int screenH) {
        // Implement custom tooltip component rendering
    }
}
```

## 8. Tooltips

Any `GuiComponent` can display a tooltip on hover. Tooltips are rendered by the theme.

### Text Tooltip

```java
button.setTooltip("Click to save your progress");
```

### Multi-line Tooltip

Use `\n` for line breaks:

```java
button.setTooltip("Line 1\nLine 2\nLine 3");
```

### Custom Tooltip Component

For rich tooltips, create a custom component:

```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

GuiPanel tooltipPanel = new GuiPanel(0, 0, 150, 60);
tooltipPanel.setFlexDirection(FlexDirection.VERTICAL);
tooltipPanel.addChild(new GuiLabel(0, 0, "Custom Tooltip", 0xFF00E5FF));
tooltipPanel.addChild(new GuiLabel(0, 0, "With multiple lines", 0xFFAAAAAA));

button.setTooltipComponent(tooltipPanel);
```

### Tooltip Propagation

Tooltips are resolved by walking up the parent chain. If a child has no tooltip, the parent's tooltip is used. The deepest component with a tooltip under the cursor is the one displayed.

## 9. Dirty Flag System (Performance)

X4UI uses a lazy evaluation model with dirty flags to avoid unnecessary recalculations:

- `requestLayout()` -- Marks the component as needing re-layout. The layout engine runs on the next `tick()`.
- `requestRender()` -- Marks the component as needing render-order re-sort. Children are re-sorted by `layer` on the next render.
- `markDirty()` -- Calls both `requestLayout()` and `requestRender()`.

Layout and render sorting only execute when the flags are set. Mutating purely visual properties (e.g., color, text) without changing position or size avoids triggering layout recalculation.

```java
// This does NOT trigger layout recalculation
label.setText("New text");

// This DOES trigger layout recalculation
button.setWidth(200);
button.setHeight(30);
```

## 10. Layer System (Z-Index)

Each component has a `layer` integer. Children are rendered in ascending layer order. Higher layers render on top.

```java
background.setLayer(0);   // Rendered first (behind)
foreground.setLayer(10);  // Rendered last (in front)
popup.setLayer(100);      // Rendered above everything
```

The `GuiDropdown` component uses `layer = 100` by default so its popup renders above other components.

## 11. Animation Engine (`GuiAnimator`)

A time-based property animation system with easing functions.

```java
import com.x4yi.x4ui.client.gui.animation.GuiAnimator;
import com.x4yi.x4ui.client.gui.animation.GuiAnimator.Easing;

// Animate a float property from 0 to 1 over 500ms with ease-out
GuiAnimator.animate(
    myComponent,           // target object
    "opacity",             // property name (String)
    0.0f,                  // start value
    1.0f,                  // end value
    500,                   // duration in milliseconds
    Easing.EASE_OUT,       // easing function
    new GuiAnimator.AnimationCallback() {
        @Override public void onUpdate(float value) {
            // Called each frame with interpolated value
        }
        @Override public void onComplete() {
            // Called when animation finishes
        }
    }
);
```

### Easing Functions

| Easing | Description |
|--------|-------------|
| `LINEAR` | Constant speed |
| `EASE_IN` | Slow start, fast end |
| `EASE_OUT` | Fast start, slow end |
| `EASE_IN_OUT` | Slow start and end |

### Important Notes

- `GuiAnimator.update()` must be called every frame to tick animations.
- Animations on the same target+property are replaced (only one active per property).
- Call `GuiAnimator.clearAnimations()` to cancel all active animations.

## 12. Font Width Cache

`FontWidthCache` provides a per-mod LRU cache for `FontRenderer.getStringWidth()` results. This prevents memory leaks in text-heavy UIs (e.g., `GuiMarkdown`) by capping cached entries at 10,000 per mod namespace.

```java
import com.x4yi.x4ui.client.gui.utils.FontWidthCache;

// Use in custom components
int width = FontWidthCache.getStringWidth(fontRenderer, "Hello World", "mymod");

// Clear cache when no longer needed
FontWidthCache.clearCache("mymod");
FontWidthCache.clearAll();
```

## 13. Scissor Helper

`ScissorHelper` manages nested OpenGL scissor regions. Each `pushScissor()` intersects with the current scissor region (CSS-like `overflow: hidden` semantics).

```java
import com.x4yi.x4ui.client.gui.utils.ScissorHelper;

ScissorHelper.pushScissor(x * scale, y * scale, w * scale, h * scale);
// ... render clipped content ...
ScissorHelper.popScissor();
```

This is used internally by `GuiScrollPanel` for scroll clipping. Components that render outside the scissor region are clipped.

## 14. Delta Time

`GuiBaseScreen.deltaTime` is a static float (in seconds) representing the time between the current and previous frame. It is capped at 0.1s to prevent animation jumps after lag spikes.

```java
float dt = GuiBaseScreen.deltaTime;
float speed = 10f * dt; // FPS-independent speed
```

All built-in components use delta time for animations (hover lerp, toggle animation, scroll smoothing).
[/EN]
