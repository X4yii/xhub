---
title: "Buttons & Inputs"
project: "X4UI"
category: "Components"
categoryOrder: 1
order: 0
---

[ES]
# Botones y Entradas (Inputs)

Los componentes de interacción primaria están diseñados para aprovechar al máximo la **API Fluida** (Fluent API) y eliminar la necesidad de sobrecargar el código con llamadas repetitivas.

## GuiButton

El botón clásico interactivo. Las propiedades visuales y variantes se configuran mediante builders fluidos:

```java
GuiButton btn = (GuiButton) new GuiButton(0, 0, 0, 20, "Guardar", () -> {
    System.out.println("Guardado!");
})
.withPercentWidth(1.0f)                           // Dimensionamiento responsivo
.withVariant(GuiButton.Variant.SUCCESS)            // Variante visual del tema (DEFAULT, PRIMARY, SECONDARY, SUCCESS, DANGER, GHOST)
.withTooltip("Guarda los cambios permanentemente"); // Tooltip instantáneo al pasar el cursor
```

## Entradas de Texto (GuiTextInput)

`GuiTextInput` gestiona internamente el foco, renderizado de cursor parpadeante, selección y portapapeles.

```java
GuiTextInput nameInput = (GuiTextInput) new GuiTextInput(0, 0, 0, 20, "")
    .withPercentWidth(1.0f);

// Configurar placeholder
nameInput.setPlaceholder("Escribe tu nombre...");

// Escuchar cambios de texto
nameInput.setOnTextChanged(text -> {
    System.out.println("Texto actual: " + text);
});
```

### Estados Reactivos
Para vincular `GuiTextInput` a un `State<String>` reactivo:

```java
State<String> userName = new State<>("");
nameInput.bindState(userName, txt -> {
    nameInput.setText(txt);
});
```

## Sliders y Toggles

### Sliders Numéricos (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`)

Permiten seleccionar valores numéricos con arrastre del ratón o teclado:

```java
GuiSliderInt volumeSlider = (GuiSliderInt) new GuiSliderInt(0, 0, 0, 20, 0, 100, 50, "Volumen: ")
    .withPercentWidth(1.0f);

volumeSlider.setOnValueChanged(val -> {
    System.out.println("Nuevo volumen: " + val);
});
```

### Interruptores y Casillas (`GuiToggle`)

`GuiToggle` proporciona un interruptor booleano animado con soporte para etiquetas:

```java
GuiToggle showHUD = (GuiToggle) new GuiToggle(0, 0, 120, 20, "Mostrar HUD", true);

showHUD.setOnToggle(enabled -> {
    System.out.println("HUD activo: " + enabled);
});
```
[/ES]

[EN]
# Buttons and Inputs

Primary interaction components are designed to fully leverage the **Fluent API** and eliminate the need to clutter the code with repetitive setter calls.

## GuiButton

The classic interactive button. Secondary visual properties and variants are configured through fluent builders:

```java
GuiButton btn = (GuiButton) new GuiButton(0, 0, 0, 20, "Save", () -> {
    System.out.println("Saved!");
})
.withPercentWidth(1.0f)                           // Responsive sizing
.withVariant(GuiButton.Variant.SUCCESS)            // Visual variant from theme (DEFAULT, PRIMARY, SECONDARY, SUCCESS, DANGER, GHOST)
.withTooltip("Saves changes permanently");         // Instant hover tooltip
```

## Text Inputs (GuiTextInput)

`GuiTextInput` internally handles focus, blinking cursor rendering, text selection, and clipboard operations.

```java
GuiTextInput nameInput = (GuiTextInput) new GuiTextInput(0, 0, 0, 20, "")
    .withPercentWidth(1.0f);

// Configure placeholder
nameInput.setPlaceholder("Enter your name...");

// Listen for text changes
nameInput.setOnTextChanged(text -> {
    System.out.println("Current text: " + text);
});
```

### Reactive States
To bind `GuiTextInput` to a reactive `State<String>`:

```java
State<String> userName = new State<>("");
nameInput.bindState(userName, txt -> {
    nameInput.setText(txt);
});
```

## Sliders and Toggles

### Numeric Sliders (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`)

Allow continuous value adjustments via mouse drag or keyboard navigation:

```java
GuiSliderInt volumeSlider = (GuiSliderInt) new GuiSliderInt(0, 0, 0, 20, 0, 100, 50, "Volume: ")
    .withPercentWidth(1.0f);

volumeSlider.setOnValueChanged(val -> {
    System.out.println("New volume: " + val);
});
```

### Switches and Checkboxes (`GuiToggle`)

`GuiToggle` provides a smooth, animated boolean switch with label support:

```java
GuiToggle showHUD = (GuiToggle) new GuiToggle(0, 0, 120, 20, "Show HUD", true);

showHUD.setOnToggle(enabled -> {
    System.out.println("HUD enabled: " + enabled);
});
```
[/EN]
