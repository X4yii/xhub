---
title: "Animations"
project: "X4UI"
category: "State And Animations"
categoryOrder: 4
---

[ES]
# Animaciones (`GuiAnimator`)

En lugar de hacer cálculos manuales en cada frame, X4UI usa el `GuiAnimator` para mover y transicionar cosas de forma fluida.

## ¿Cómo funciona?

El animador cambia un valor numérico (como una posición o un tamaño) desde un inicio hasta un fin, en un tiempo específico. Usa el reloj del sistema, por lo que las animaciones siempre duran lo mismo, sin importar si Minecraft va a 30 o a 144 FPS.

## API Principal

Para iniciar una animación, usa el método `GuiAnimator.animate`:

```java
GuiAnimator.animate(
    this,              // Componente objetivo (para identificar la animación)
    "opacidad_fondo",  // Nombre único para esta propiedad
    0.0f,              // Valor inicial
    1.0f,              // Valor final
    100,               // Duración total en milisegundos
    Easing.EASE_OUT,   // Curva de velocidad
    valor -> miOpacidad = valor // Qué hacer con el valor animado cada frame
);
```

### Evitar Conflictos

Si llamas a `animate()` usando el mismo componente y el mismo nombre ("opacidad_fondo"), la animación anterior se cancela al instante y comienza la nueva. Esto es perfecto para evitar errores cuando el ratón entra y sale rápidamente de un botón.

## Tipos de Easing (Velocidad)

Las curvas `Easing` le dan naturalidad al movimiento:
* `LINEAR`: Velocidad constante y plana de principio a fin.
* `EASE_IN`: Empieza despacio, termina rápido.
* `EASE_OUT`: Empieza rápido, termina despacio (ideal para entradas en pantalla de menús del mod).
* `EASE_IN_OUT`: Suave al inicio y al final.

[/ES]

[EN]
# Animations (`GuiAnimator`)

Instead of doing manual calculations every frame, X4UI uses `GuiAnimator` to move and transition things smoothly.

## How does it work?

The animator changes a numeric value (like a position or size) from a start to an end, in a specific time. It uses the system clock, so animations always take the same time, regardless of whether Minecraft is running at 30 or 144 FPS.

## Main API

To start an animation, use the `GuiAnimator.animate` method:

```java
GuiAnimator.animate(
    this,              // Target component (to identify the animation)
    "background_opacity", // Unique name for this property
    0.0f,              // Start value
    1.0f,              // End value
    100,               // Total duration in milliseconds
    Easing.EASE_OUT,   // Speed curve
    value -> myOpacity = value // What to do with the animated value each frame
);
```

### Avoiding Conflicts

If you call `animate()` using the same component and the same name ("background_opacity"), the previous animation is instantly canceled and the new one begins. This is perfect to avoid bugs when the mouse quickly enters and leaves a button.

## Easing Types (Speed)

`Easing` curves give a natural feel to the movement:
* `LINEAR`: Constant and flat speed from start to finish.
* `EASE_IN`: Starts slowly, ends fast.
* `EASE_OUT`: Starts fast, ends slowly (ideal for screen pop-ins).
* `EASE_IN_OUT`: Smooth at the start and the end.

[/EN]
