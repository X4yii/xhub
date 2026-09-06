---
title: "Buttons And Inputs"
project: "X4UI"
category: "Components"
categoryOrder: 4
---

[ES]
# Botones e Inputs

Este documento cubre los componentes interactivos de entrada: `GuiButton`, `GuiTextInput`, `GuiToggle`, `GuiSlider` y sus variantes modulares tipadas (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`).

---

## GuiButton

Un botón clickeable con estado de hover animado, texto centrado, soporte de fuentes personalizadas y sonido de clic.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiButton`

### Constructores y Uso Fluido
```java
import com.x4yi.x4ui.client.gui.component.GuiButton;

GuiButton saveBtn = new GuiButton(10, 10, 120, 24, "Guardar", () -> {
    System.out.println("Guardado!");
});

// Configuración encadenable
saveBtn.withPosition(10, 10)
       .withSize(140, 24)
       .withTooltip("Guardar cambios actuales");

rootPanel.addChild(saveBtn);
```

### Estado Deshabilitado
```java
saveBtn.setEnabled(false); // Renderiza en color atenuado y no procesa clics
```

---

## GuiTextInput

Un campo de texto avanzado con soporte de desplazamiento horizontal para cadenas largas, selección mediante arrastre de ratón, atajos de edición y texto de placeholder.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiTextInput`

### Uso Básico
```java
import com.x4yi.x4ui.client.gui.component.GuiTextInput;

GuiTextInput nameInput = new GuiTextInput(10, 40, 200, 20);
nameInput.setPlaceholder("Escribe tu nombre...");
nameInput.setMaxLength(64);

// Callback al presionar Enter
nameInput.onEnter(() -> {
    System.out.println("Texto enviado: " + nameInput.getText());
});

rootPanel.addChild(nameInput);
```

### Atajos de Teclado Soportados
- **Ctrl + A:** Seleccionar todo el texto.
- **Ctrl + C / X / V:** Copiar, cortar y pegar del portapapeles del sistema.
- **Ctrl + Backspace:** Borrar la palabra anterior completa.
- **Ctrl + Delete:** Borrar la palabra siguiente completa.
- **Shift + Flechas:** Expandir o contraer la selección de texto.
- **Home / End:** Mover el cursor al inicio o final de la línea.

---

## GuiToggle

Un interruptor tipo píldora interactivo con transición animada, texto indicador adaptativo ("ON" / "OFF") y vinculación a `State<Boolean>`.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiToggle`

### Constructores
```java
import com.x4yi.x4ui.client.gui.component.GuiToggle;
import com.x4yi.x4ui.common.State;

// Vinculado a un State reactivo
State<Boolean> soundEnabled = new State<>(true);
GuiToggle soundToggle = new GuiToggle(10, 70, 140, 20, "Sonido", soundEnabled);

// O con valor inicial booleano y callback
GuiToggle autoSave = new GuiToggle(10, 95, 140, 20, "Auto-Guardar", true, enabled -> {
    System.out.println("Auto-guardar: " + enabled);
});

rootPanel.addChild(soundToggle);
```

Las dimensiones de la píldora se ajustan automáticamente a la métrica y altura de la tipografía activa (`gfx.getFontHeight()`).

---

## GuiSlider (Modular y Tipado)

En X4UI r1.0b5, los deslizadores se encuentran organizados en el paquete `com.x4yi.x4ui.client.gui.component.slider` y ofrecen implementaciones tipadas seguras para `Integer`, `Float` y `Double`, con soporte tanto horizontal como vertical.

**Paquete:** `com.x4yi.x4ui.client.gui.component.slider.*`

### Variantes Disponibles

#### 1. `GuiSliderInt`
```java
import com.x4yi.x4ui.client.gui.component.slider.GuiSliderInt;
import com.x4yi.x4ui.common.State;

State<Integer> fov = new State<>(70);
GuiSliderInt fovSlider = new GuiSliderInt(10, 120, 160, 16, fov, 30, 110, 1);
rootPanel.addChild(fovSlider);
```

#### 2. `GuiSliderFloat`
```java
import com.x4yi.x4ui.client.gui.component.slider.GuiSliderFloat;

State<Float> volume = new State<>(0.8f);
GuiSliderFloat volumeSlider = new GuiSliderFloat(10, 145, 160, 16, volume, 0.0f, 1.0f, 0.05f);
rootPanel.addChild(volumeSlider);
```

#### 3. `GuiSliderDouble`
```java
import com.x4yi.x4ui.client.gui.component.slider.GuiSliderDouble;

State<Double> sensitivity = new State<>(1.0);
GuiSliderDouble sensSlider = new GuiSliderDouble(10, 170, 160, 16, sensitivity, 0.1, 5.0, 0.1);
rootPanel.addChild(sensSlider);
```

### Orientación Vertical
Cualquier deslizador puede configurarse en modo vertical mediante `withHorizontal(false)`:

```java
GuiSliderFloat verticalGain = new GuiSliderFloat(200, 40, 16, 120, volume, 0.0f, 1.0f, 0.05f)
    .withHorizontal(false);
rootPanel.addChild(verticalGain);
```

---

## Qué Evitar Hacer (Antipatrones en Entradas)

> [!CAUTION]
> **1. NUNCA mutar el `State<T>` del slider dentro de su propio listener.**
> Podría provocar bucles infinitos de actualización.

> [!WARNING]
> **2. NUNCA usar constructores obsoletos de `GuiSlider`.**
> Utilice siempre las versiones tipadas (`GuiSliderInt`, `GuiSliderFloat`, etc) con `State<T>`.

> [!WARNING]
> **3. NUNCA dejar campos de `GuiTextInput` sin límite de longitud (`setMaxLength`).**
> Defina siempre un máximo de caracteres razonable (ej. 32) para prevenir desbordamientos.

> [!IMPORTANT]
> **4. NUNCA asumir clics si las dimensiones son 0.**
> Si utiliza anchos porcentuales, asegúrese de que el padre esté dimensionado antes de interactuar.
[/ES]

[EN]
# Buttons & Inputs

This document details interactive input components: `GuiButton`, `GuiTextInput`, `GuiToggle`, and typed modular sliders (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`).

---

## GuiButton

A clickable button featuring animated hover transitions, centered label text, custom font support, and native click sounds.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiButton`

### Constructors & Fluent Usage
```java
import com.x4yi.x4ui.client.gui.component.GuiButton;

GuiButton saveBtn = new GuiButton(10, 10, 120, 24, "Save", () -> {
    System.out.println("Saved!");
});

// Fluent chaining
saveBtn.withPosition(10, 10)
       .withSize(140, 24)
       .withTooltip("Save current configuration");

rootPanel.addChild(saveBtn);
```

### Disabled State
```java
saveBtn.setEnabled(false); // Renders with dimmed text and ignores click events
```

---

## GuiTextInput

A full-featured text field with horizontal scrolling for long inputs, mouse-drag text selection, word-jumping shortcuts, and placeholder text.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiTextInput`

### Basic Usage
```java
import com.x4yi.x4ui.client.gui.component.GuiTextInput;

GuiTextInput nameInput = new GuiTextInput(10, 40, 200, 20);
nameInput.setPlaceholder("Enter username...");
nameInput.setMaxLength(64);

// Submit callback on Enter key
nameInput.onEnter(() -> {
    System.out.println("Submitted: " + nameInput.getText());
});

rootPanel.addChild(nameInput);
```

### Supported Keyboard Shortcuts
- **Ctrl + A:** Select all text.
- **Ctrl + C / X / V:** Copy, cut, and paste from system clipboard.
- **Ctrl + Backspace:** Delete entire previous word.
- **Ctrl + Delete:** Delete entire next word.
- **Shift + Arrows:** Expand or contract character selection.
- **Home / End:** Move caret to start or end of text.

---

## GuiToggle

An animated iOS-style pill toggle switch with adaptive "ON" / "OFF" text badges, bound to `State<Boolean>`.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiToggle`

### Constructors
```java
import com.x4yi.x4ui.client.gui.component.GuiToggle;
import com.x4yi.x4ui.common.State;

// Reactive state binding
State<Boolean> soundEnabled = new State<>(true);
GuiToggle soundToggle = new GuiToggle(10, 70, 140, 20, "Sound", soundEnabled);

// Or with primitive boolean and listener callback
GuiToggle autoSave = new GuiToggle(10, 95, 140, 20, "Auto-Save", true, enabled -> {
    System.out.println("Auto-save: " + enabled);
});

rootPanel.addChild(soundToggle);
```

Pill badge width and height adapt automatically to the active typography font metrics (`gfx.getFontHeight()`).

---

## GuiSlider (Modular & Typed)

In X4UI r1.0b5, sliders reside under `com.x4yi.x4ui.client.gui.component.slider` and provide type-safe implementations for `Integer`, `Float`, and `Double`, supporting horizontal and vertical orientations.

**Package:** `com.x4yi.x4ui.client.gui.component.slider.*`

### Available Variants

#### 1. `GuiSliderInt`
```java
import com.x4yi.x4ui.client.gui.component.slider.GuiSliderInt;
import com.x4yi.x4ui.common.State;

State<Integer> fov = new State<>(70);
GuiSliderInt fovSlider = new GuiSliderInt(10, 120, 160, 16, fov, 30, 110, 1);
rootPanel.addChild(fovSlider);
```

#### 2. `GuiSliderFloat`
```java
import com.x4yi.x4ui.client.gui.component.slider.GuiSliderFloat;

State<Float> volume = new State<>(0.8f);
GuiSliderFloat volumeSlider = new GuiSliderFloat(10, 145, 160, 16, volume, 0.0f, 1.0f, 0.05f);
rootPanel.addChild(volumeSlider);
```

#### 3. `GuiSliderDouble`
```java
import com.x4yi.x4ui.client.gui.component.slider.GuiSliderDouble;

State<Double> sensitivity = new State<>(1.0);
GuiSliderDouble sensSlider = new GuiSliderDouble(10, 170, 160, 16, sensitivity, 0.1, 5.0, 0.1);
rootPanel.addChild(sensSlider);
```

### Vertical Orientation
Any slider can switch to vertical mode using `withHorizontal(false)`:

```java
GuiSliderFloat verticalGain = new GuiSliderFloat(200, 40, 16, 120, volume, 0.0f, 1.0f, 0.05f)
    .withHorizontal(false);
rootPanel.addChild(verticalGain);
```

---

## What to Avoid (Input Anti-Patterns)

> [!CAUTION]
> **1. NEVER mutate slider `State<T>` inside its own listener.**
> Mutating state in self-listeners without deduplication triggers infinite update loops.

> [!WARNING]
> **2. NEVER use legacy `GuiSlider` constructors.**
> Always use typed versions (`GuiSliderInt`, `GuiSliderFloat`, etc) with `State<T>`.

> [!WARNING]
> **3. NEVER leave `GuiTextInput` instances without maximum lengths (`setMaxLength`).**
> Always enforce bounds (e.g. 32 chars) to prevent overflow abuse.

> [!IMPORTANT]
> **4. NEVER assume button clicks register when dimensions are zero.**
> When using percentage widths, ensure parent containers are sized before interaction.
[/EN]
