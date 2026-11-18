---
title: "Buttons & Inputs"
project: "X4UI"
category: "Components"
categoryOrder: 1
order: 0
---

[ES]
# Botones y Entradas (`GuiButton`, `GuiTextInput`, `GuiToggle`, `GuiSlider`)

Los componentes interactivos primarios operan bajo el paradigma reactivo de X4UI (`State<T>`) y la API fluida de `GuiComponent`, eliminando el acoplamiento manual de eventos. En `r1.0b7`, los widgets principales proveen factories flex-first `.of(...)` y setters fluidos covariantes (`withPercentWidth`, `withMargin`, `withFlexGrow`, `withFlexShrink`, `withMinSize`, `withMaxSize`, `withTooltip`), eliminando casts manuales.

---

## 1. `GuiButton`

Botón interactivo con variantes temáticas (`DEFAULT`, `PRIMARY`, `SECONDARY`, `SUCCESS`, `DANGER`, `GHOST`) y soporte de tooltips:

```java
GuiButton saveBtn = GuiButton.of("Guardar", () -> {
    // Acción al hacer clic
})
    .withPercentWidth(1.0f)
    .withVariant(GuiButton.Variant.PRIMARY)
    .withTooltip("Guarda la configuración actual");
```

---

## 2. `GuiTextInput`

Campo de texto con foco automático, cursor, selección, portapapeles y enlace bidireccional con `State<String>`:

```java
State<String> username = new State<>("");

GuiTextInput input = GuiTextInput.of(username)
    .setSubmitKey(KeyCodes.ENTER)
    .onEnter(() -> submitForm(username.get()))
    .setOnTextChanged(txt -> {
        // Reacción inmediata por tecla (opcional si ya usa State<String>)
    })
    .withPercentWidth(1.0f);

input.setPlaceholder("Nombre de usuario...");
```

---

## 3. `GuiToggle`

Interruptor booleano enlazable a un `State<Boolean>` o a un `Consumer<Boolean>`:

```java
State<Boolean> showHud = new State<>(true);

// Enlace reactivo directo (sin casts)
GuiToggle toggle = GuiToggle.of("Mostrar HUD", showHud)
    .withPercentWidth(1.0f);

// O con valor inicial y callback
GuiToggle altToggle = new GuiToggle(0, 0, 140, 20, "Modo compacto", false, enabled -> {
    // Manejo explícito
});
```

---

## 4. Sliders Numéricos (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`)

Los deslizadores trabajan directamente sobre un `State<T>` tipado con límites `min`, `max` y paso `step`:

```java
State<Integer> volume = new State<>(50);

GuiSliderInt volumeSlider = GuiSliderInt.of(volume, 0, 100, 1)
    .withPercentWidth(1.0f);
```

También están disponibles `GuiSliderFloat` y `GuiSliderDouble` con la misma firma reactiva, así como `GuiLabel.of(text)` / `GuiLabel.of(text, color)` y `GuiDropdown.of(state, options)`.

---

## 5. Qué Evitar en Entradas

| Antipatrón | Causa Técnica del Problema | Solución Correcta |
| :--- | :--- | :--- |
| Usar constantes de `org.lwjgl.input.Keyboard` en `setSubmitKey(...)` | Rompe portabilidad en CleanroomMC (LWJGL 3) | Utilizar `KeyCodes.ENTER` u otras constantes de `KeyCodes` |
| Leer `mc.displayWidth` sin guarda en componentes custom | Puede dividir por `0` al minimizar la ventana | Delegar en `UIInput.safeMouseX(...)` / `safeMouseY(...)` |
| Duplicar estado en campos booleanos locales fuera de `State<T>` | Desincroniza la vista si el servidor o un lote actualiza el valor | Enlazar el widget directamente a `State<T>` |
[/ES]

[EN]
# Buttons & Inputs (`GuiButton`, `GuiTextInput`, `GuiToggle`, `GuiSlider`)

Primary interactive widgets follow X4UI's reactive `State<T>` paradigm and `GuiComponent` fluent API, avoiding manual event boilerplate. In `r1.0b7`, core widgets provide flex-first `.of(...)` factories and covariant fluent setters (`withPercentWidth`, `withMargin`, `withFlexGrow`, `withFlexShrink`, `withMinSize`, `withMaxSize`, `withTooltip`), eliminating manual casts.

---

## 1. `GuiButton`

Interactive button with theme variants (`DEFAULT`, `PRIMARY`, `SECONDARY`, `SUCCESS`, `DANGER`, `GHOST`) and tooltip support:

```java
GuiButton saveBtn = GuiButton.of("Save", () -> {
    // Click action
})
    .withPercentWidth(1.0f)
    .withVariant(GuiButton.Variant.PRIMARY)
    .withTooltip("Saves the current configuration");
```

---

## 2. `GuiTextInput`

Text field supporting focus management, cursor rendering, selection, clipboard operations, and two-way binding with `State<String>`:

```java
State<String> username = new State<>("");

GuiTextInput input = GuiTextInput.of(username)
    .setSubmitKey(KeyCodes.ENTER)
    .onEnter(() -> submitForm(username.get()))
    .setOnTextChanged(txt -> {
        // Optional per-keystroke hook
    })
    .withPercentWidth(1.0f);

input.setPlaceholder("Username...");
```

---

## 3. `GuiToggle`

Boolean switch bound either to a `State<Boolean>` or an explicit `Consumer<Boolean>`:

```java
State<Boolean> showHud = new State<>(true);

// Direct reactive binding (cast-free)
GuiToggle toggle = GuiToggle.of("Show HUD", showHud)
    .withPercentWidth(1.0f);

// Or explicit initial value + callback
GuiToggle altToggle = new GuiToggle(0, 0, 140, 20, "Compact Mode", false, enabled -> {
    // Explicit handler
});
```

---

## 4. Typed Sliders (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`)

Sliders bind directly to a typed `State<T>` with `min`, `max`, and `step`:

```java
State<Integer> volume = new State<>(50);

GuiSliderInt volumeSlider = GuiSliderInt.of(volume, 0, 100, 1)
    .withPercentWidth(1.0f);
```

`GuiSliderFloat` and `GuiSliderDouble` follow the same reactive constructor pattern. `GuiLabel.of(text)` / `GuiLabel.of(text, color)` and `GuiDropdown.of(state, options)` provide matching cast-free factories.

---

## 5. What to Avoid with Inputs

| Anti-Pattern | Technical Root Cause | Correct Approach |
| :--- | :--- | :--- |
| Passing `org.lwjgl.input.Keyboard` constants to `setSubmitKey(...)` | Breaks portability under CleanroomMC (LWJGL 3) | Use `KeyCodes.ENTER` and constants from `KeyCodes` |
| Dividing by `mc.displayWidth` directly in custom widgets | Triggers division by zero when the window is minimized | Use `UIInput.safeMouseX(...)` / `safeMouseY(...)` |
| Mirroring widget values in plain local fields outside `State<T>` | Desynchronizes the UI when server batches update state | Bind widgets directly to `State<T>` |
[/EN]
