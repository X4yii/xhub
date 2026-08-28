---
title: "Screens"
project: "X4UI"
category: "Components"
categoryOrder: 5
---

[ES]
# Base Screens (Pantallas Base)

En Minecraft las interfaces se cargan usando `GuiScreen`. X4UI reemplaza esto con sus propias pantallas base para gestionar los componentes.

## GuiBaseScreen

Usa esta clase para cualquier menú normal que **no** tenga un inventario real con items (como un menú de pausa o de configuraciones).

### Cómo funciona
Al crear tu pantalla, X4UI crea automáticamente un `GuiPanel` principal llamado `rootPanel`, que ocupa toda la pantalla.
Debes escribir tu código dentro de `initComponents()`. Ahí es donde añades tus botones, textos, etc., al `rootPanel`.

## GuiBaseContainer

Usa esta clase cuando necesites crear una interfaz con inventarios (Cofres, Máquinas, etc.). Reemplaza al clásico `GuiContainer` de Minecraft.

### Cómo funciona
- Dibuja automáticamente el `rootPanel` detrás de los items reales del juego.
- Incluye soporte básico para integrarse con mods como JEI (Just Enough Items) a través de `getJeiRecipeAreas()`.
- Tiene una pequeña animación de zoom al abrir la pantalla para una apariencia más fluida.

### Métodos Clave
- `getGuiLeft()` / `getGuiTop()`: Devuelven el offset de la esquina superior izquierda del inventario. Útil para posicionar componentes `GuiSlot` correctamente.
- `getJeiRecipeAreas()`: Devuelve una lista de áreas `Rectangle` que JEI puede usar para superponer recetas.

[/ES]

[EN]
# Base Screens

In Minecraft, interfaces are loaded using `GuiScreen`. X4UI replaces this with its own base screens to manage components automatically.

## GuiBaseScreen

Use this class for any normal menu that **does not** have a real inventory with items (like a pause menu or configuration screen).

### How it works
When creating your screen, X4UI automatically creates a main `GuiPanel` called `rootPanel`, which takes up the entire screen.
You must write your code inside `initComponents()`. That's where you add your buttons, texts, etc., to the `rootPanel`.

## GuiBaseContainer

Use this class when you need to create an interface with inventories (Chests, Machines, etc.). It replaces the classic Minecraft `GuiContainer`.

### How it works
- It automatically draws the `rootPanel` behind the real game items.
- It includes basic support to integrate with mods like JEI (Just Enough Items) through `getJeiRecipeAreas()`.
- It has a small zoom-in animation when the screen opens, for a smoother appearance.

### Key Methods
- `getGuiLeft()` / `getGuiTop()`: Return the inventory's top-left offset. Useful for positioning `GuiSlot` components correctly.
- `getJeiRecipeAreas()`: Returns a list of `Rectangle` areas that JEI can use for recipe overlays.

[/EN]
