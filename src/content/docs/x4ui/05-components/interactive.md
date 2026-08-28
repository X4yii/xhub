---
title: "Interactive"
project: "X4UI"
category: "Components"
categoryOrder: 5
---

[ES]
# Interactive (Botones y Toggles)

Componentes diseñados para recibir clics y ejecutar código.

## GuiButton

El botón clásico. Muestra un fondo, un texto centrado y cambia de color al pasar el ratón por encima.

### Creación
```java
GuiButton btn = new GuiButton(x, y, width, height, "Conectar al Servidor", () -> {
    Minecraft.getMinecraft().displayGuiScreen(new GuiConnecting(null, mc, miServerData));
});
```

### Comportamiento
- Al pasar el ratón, el color de fondo transiciona suavemente.
- Al hacer clic izquierdo, reproduce automáticamente el sonido de clic de Minecraft.

## GuiToggle

Funciona como un interruptor de encendido/apagado (Switch).

### Creación
```java
GuiToggle luz = new GuiToggle(x, y, width, height, "Renderizar Partículas", true, (particulasActivas) -> {
    MiModConfigs.renderParticles = particulasActivas;
});
```

### Comportamiento
- Muestra un texto a la izquierda y un interruptor a la derecha ("ON" / "OFF").
- Al hacer clic, se mueve de lado a lado con una animación fluida y avisa a tu código.

## GuiDropdown<T>

Un menú desplegable para elegir una opción de una lista. Está conectado a un `State<T>`.

### Creación
```java
State<String> modoVuelo = new State<>("Normal");
List<String> opciones = Arrays.asList("Normal", "Jetpack", "Hover");

GuiDropdown<String> menu = new GuiDropdown<>(x, y, width, height, modoVuelo, opciones);
```

### ¿Cómo funciona?
- Muestra la opción actual. Al hacer clic, se abre una lista con las demás opciones.
- Para evitar que la lista quede escondida detrás de otras cosas, el menú aumenta su capa (`layer`) automáticamente al abrirse, dibujándose por encima de todo lo demás de forma segura.

[/ES]

[EN]
# Interactive (Buttons and Toggles)

Components designed to receive clicks and execute code.

## GuiButton

The classic button. Displays a background, centered text, and changes color when hovered over.

### Creation
```java
GuiButton btn = new GuiButton(x, y, width, height, "Connect to Server", () -> {
    Minecraft.getMinecraft().displayGuiScreen(new GuiConnecting(null, mc, myServerData));
});
```

### Behavior
- When hovered, the background color transitions smoothly.
- On left click, it automatically plays the Minecraft click sound.

## GuiToggle

Works like an On/Off switch.

### Creation
```java
GuiToggle light = new GuiToggle(x, y, width, height, "Render Particles", true, (particlesActive) -> {
    MyModConfigs.renderParticles = particlesActive;
});
```

### Behavior
- Shows text on the left and a switch on the right ("ON" / "OFF").
- On click, it moves from side to side with a smooth animation and notifies your code.

## GuiDropdown<T>

A dropdown menu to choose an option from a list. It's connected to a `State<T>`.

### Creation
```java
State<String> flightMode = new State<>("Normal");
List<String> options = Arrays.asList("Normal", "Jetpack", "Hover");

GuiDropdown<String> menu = new GuiDropdown<>(x, y, width, height, flightMode, options);
```

### How it works
- Shows the current option. On click, it opens a list with the other options.
- To prevent the list from being hidden behind other things, the menu automatically increases its layer (`layer`) when opened, drawing itself safely above everything else.

[/EN]
