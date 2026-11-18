---
title: "Integrations & Best Practices"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 8
---

[ES]
# 08 - Integraciones y Mejores Prácticas

Este documento reúne las convenciones arquitectónicas de X4UI (`r1.0b7`), su integración nativa con Just Enough Items (JEI) y las reglas de diseño recomendadas para mods consumidores.

---

## 1. Integración Nativa con JEI (`JeiPlugin`)

X4UI registra `JeiPlugin` y `JeiAdvancedGuiHandler` automáticamente cuando JEI está presente en tiempo de ejecución:
- Reporta áreas de exclusión de `GuiBaseContainer` y de todos los `IGuiOverlay` activos en `GuiOverlayManager`.
- Evita que el panel lateral de ingredientes de JEI se superponga sobre paneles inyectados o ventanas modales extendidas.
- No requiere configuración manual adicional salvo implementar correctamente `getExclusionAreas()` cuando se creen overlays personalizados.

---

## 2. Convenciones de Nomenclatura y Arquitectura

El prefijo `Gui` está reservado para **componentes visuales** que heredan de `GuiComponent` o pantallas (`GuiBaseScreen`, `GuiBaseContainer`, `IGuiOverlay`):

| Categoría | Nomenclatura Correcta | Qué Evitar |
| :--- | :--- | :--- |
| Widgets y Contenedores | `GuiButton`, `GuiTextInput`, `GuiToggle`, `GuiPanel`, `GuiScrollPanel` | Nombres genéricos sin rol visual claro |
| Gestores sin renderizado propio | `OverlayDockManager`, `MediaManager`, `ScreenRegistry` | Prefijar con `Gui` clases puramente lógicas |
| Estado y Red | `State<T>`, `UIStateBus`, `UINetwork`, `PacketGuiRpc`, `ActionGuard` | Mezclar estado/paquetes con clases `client.gui.*` |

---

## 3. Desacoplamiento de Vistas (*Dumb Views*)

Los componentes visuales no deben recibir objetos pesados del mundo (`World`, `EntityPlayer`, `TileEntity`) en sus constructores cuando solo necesitan mostrar o editar datos puntuales. Pasar `State<T>` o usar `UIStateBus` desacopla la vista del modelo y facilita el soporte server-optional:

```java
// Recomendado: vista desacoplada mediante State<T>
public class EnergyCard extends GuiPanel {
    public EnergyCard(State<Integer> energyState) {
        super(0, 0, 0, 40);
        GuiLabel label = new GuiLabel(0, 0, "0 RF", 0xFFFFFFFF);
        label.bindState(energyState, rf -> label.setText(rf + " RF"));
        addChild(label);
    }
}
```

---

## 4. Gestión de Memoria y Ciclo de Vida

1. **Suscripciones reactivas:** utilizar siempre `component.bindState(state, callback)` para que `GuiComponent.destroy()` desvincule el listener al cerrar la pantalla.
2. **Capturas en lambdas:** evitar capturar instancias completas de `GuiScreen` dentro de listeners globales (`Scope.GLOBAL` o `Scope.SESSION`); preferir `Scope.SCREEN` o `syncedState(...)` en `GuiBaseScreen`.
3. **Inicialización única:** instanciar componentes, fuentes (`FontRegistry`) y descargas (`MediaPipeline`) durante la fase de inicialización, nunca dentro de `update()` o `renderSelf()`.
4. **Logs estructurados:** utilizar `org.apache.logging.log4j.LogManager` en lugar de `System.out.println` / `printStackTrace()`.
5. **Punto de entrada y composición sin casts:** preferir `GuiBuilder.screen(...)`, `GuiBuilder.modal(...)`, `GuiBuilder.open(...)` y `GuiBuilder.close()` en lugar de invocar `Minecraft.getMinecraft().displayGuiScreen(...)` directamente, y componer widgets mediante `parent.add(child, cfg)` junto con factories `.of(...)`.
[/ES]

[EN]
# 08 - Integrations & Best Practices

This document covers X4UI's architectural conventions (`r1.0b7`), native Just Enough Items (JEI) integration, and recommended practices for consumer mods.

---

## 1. Native JEI Integration (`JeiPlugin`)

X4UI automatically activates `JeiPlugin` and `JeiAdvancedGuiHandler` when JEI is loaded:
- Reports exclusion rectangles from `GuiBaseContainer` and all active `IGuiOverlay` instances in `GuiOverlayManager`.
- Prevents JEI's ingredient list from overlapping injected overlays or extended modal containers.
- Requires no extra setup beyond keeping accurate `getExclusionAreas()` bounds on custom overlays.

---

## 2. Naming & Architectural Conventions

The `Gui` prefix is reserved for **visual components** extending `GuiComponent` or screen contracts (`GuiBaseScreen`, `GuiBaseContainer`, `IGuiOverlay`):

| Category | Standard Naming | Avoid |
| :--- | :--- | :--- |
| Widgets & Containers | `GuiButton`, `GuiTextInput`, `GuiToggle`, `GuiPanel`, `GuiScrollPanel` | Ambiguous names without visual role |
| Non-visual Managers | `OverlayDockManager`, `MediaManager`, `ScreenRegistry` | Prefixing pure logic/registry classes with `Gui` |
| State & Networking | `State<T>`, `UIStateBus`, `UINetwork`, `PacketGuiRpc`, `ActionGuard` | Coupling packets or shared state with `client.gui.*` |

---

## 3. Decoupled Views (*Dumb Views*)

Visual components should not accept heavy game objects (`World`, `EntityPlayer`, `TileEntity`) in their constructors when they only display or mutate specific fields. Passing `State<T>` or reading from `UIStateBus` keeps views decoupled and server-optional friendly:

```java
// Recommended: view decoupled via State<T>
public class EnergyCard extends GuiPanel {
    public EnergyCard(State<Integer> energyState) {
        super(0, 0, 0, 40);
        GuiLabel label = new GuiLabel(0, 0, "0 RF", 0xFFFFFFFF);
        label.bindState(energyState, rf -> label.setText(rf + " RF"));
        addChild(label);
    }
}
```

---

## 4. Memory & Lifecycle Discipline

1. **Reactive bindings:** always use `component.bindState(state, callback)` so `GuiComponent.destroy()` unbinds listeners automatically on screen close.
2. **Lambda captures:** avoid capturing `GuiScreen` instances inside `Scope.GLOBAL` or `Scope.SESSION` listeners; prefer `Scope.SCREEN` or `syncedState(...)` in `GuiBaseScreen`.
3. **Single-pass initialization:** instantiate components, register fonts (`FontRegistry`), and trigger media fetches (`MediaPipeline`) during initialization, never inside `update()` or `renderSelf()`.
4. **Structured logging:** use `org.apache.logging.log4j.LogManager` instead of `System.out.println` or `printStackTrace()`.
5. **Consumer entry point & cast-free wiring:** prefer `GuiBuilder.screen(...)`, `GuiBuilder.modal(...)`, `GuiBuilder.open(...)`, and `GuiBuilder.close()` instead of calling `Minecraft.getMinecraft().displayGuiScreen(...)` directly, and compose widgets via `parent.add(child, cfg)` with `.of(...)` factories.
[/EN]
