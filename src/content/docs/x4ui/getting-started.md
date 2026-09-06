---
title: "Getting Started"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 0
---

[ES]
# 00 - Primeros Pasos

X4UI es un framework moderno de interfaz gráfica para Minecraft Forge 1.12.2. Proporciona una arquitectura completa basada en árbol de componentes retenidos, diseños flexbox responsivos, una capa gráfica inmediata abstracta (`IGraphics`), soporte nativo de fuentes vectoriales TrueType/OpenType (`IFont`), propagación jerárquica de eventos, enlace reactivo de estado (`State<T>`), animaciones fluidas y soporte de temas desacoplados.

## Requisitos

- Minecraft Forge 1.12.2 (`1.12.2-14.23.5.2847` o superior)
- Java 8 (OpenJDK u Oracle JDK)

## Instalación

Agregue la dependencia de X4UI en `build.gradle` usando uno de los siguientes repositorios:

### Modrinth (Recomendado)
```gradle
repositories {
    maven { url "https://api.modrinth.com/maven" }
}

dependencies {
    deobfCompile "maven.modrinth:x4ui:1.0b5"
}
```

### CurseForge
```gradle
repositories {
    maven { url "https://cursemaven.com" }
}

dependencies {
    deobfCompile "curse.maven:x4ui-PROJECT_ID:FILE_ID"
}
```

### GitHub Packages / JitPack
```gradle
repositories {
    maven { url "https://jitpack.io" }
}

dependencies {
    deobfCompile "com.github.x4yi:X4UI:1.0b5"
}
```

## Estructura de Paquetes

Todas las clases de X4UI se encuentran bajo `com.x4yi.x4ui`. La arquitectura separa interfaces públicas de implementación:

| Paquete | Propósito |
|---------|-----------|
| `com.x4yi.x4ui.api.client.gui` | Abstracción gráfica inmediata (`IGraphics`) |
| `com.x4yi.x4ui.impl.client.gui` | Implementación de bajo nivel de renderizado (`GLGraphics`) |
| `com.x4yi.x4ui.api.client.font` | Abstracción del motor de tipografía (`IFont`) |
| `com.x4yi.x4ui.impl.client.font` | Rasterizador TrueType (`TrueTypeFont`), registro de fuentes (`FontRegistry`) |
| `com.x4yi.x4ui.client.gui.base` | Clases abstractas de pantalla (`GuiBaseScreen`, `GuiBaseContainer`) |
| `com.x4yi.x4ui.client.gui.component` | Componentes visuales (`GuiPanel`, `GuiButton`, `GuiLabel`, `GuiImage`, etc.) |
| `com.x4yi.x4ui.client.gui.component.layout` | Motores de diseño (`FlexLayout`, `FlexDirection`) |
| `com.x4yi.x4ui.client.gui.component.slider` | Deslizadores modulares tipados (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`) |
| `com.x4yi.x4ui.client.gui.component.sprite` | Motor de animación 2D (`ISpriteSource`, `SpriteSheetSource`, `SequenceSource`) |
| `com.x4yi.x4ui.client.gui.component.image` | Configuración de bordes 9-slice (`NineSliceConfig`) |
| `com.x4yi.x4ui.client.gui.overlay` | Superposiciones e inyecciones en GUIs (`GuiOverlayManager`, `OverlayDockManager`) |
| `com.x4yi.x4ui.client.gui.compat.jei` | Integración con Just Enough Items (`JeiPlugin`) |
| `com.x4yi.x4ui.client.gui.bus` | Bus reactivo de estados desacoplados (`UIStateBus`) |
| `com.x4yi.x4ui.client.gui.utils` | Utilidades (`GuiBuilder`, `ITheme`, `DefaultTheme`, `ThemeRegistry`, `Insets`) |
| `com.x4yi.x4ui.common` | Primitivas de estado compartidas seguras para servidor (`State<T>`) |
| `com.x4yi.x4ui.common.sync` | Sincronización de propiedades de container (`NetworkSyncHelper`) |
| `com.x4yi.x4ui.proxy` | Aislamiento estricto de sidedness (`ClientProxy`, `CommonProxy`) |

---

## Crear una Pantalla Standalone (`GuiBaseScreen`)

Extienda `GuiBaseScreen` para pantallas que no interactúan con contenedores de inventario (menús de configuración, paneles de información, visores de estadísticas):

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseScreen;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.client.gui.utils.Insets;
import net.minecraft.client.gui.GuiScreen;

public class MySettingsScreen extends GuiBaseScreen {

    public MySettingsScreen(GuiScreen parent) {
        super(parent, "Configuración");
    }

    @Override
    protected void initComponents() {
        // rootPanel se inicializa automáticamente abarcando toda la ventana
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(8);
        rootPanel.setPadding(new Insets(16));

        rootPanel.addChild(new GuiLabel(0, 0, "Opciones Principales", 0xFFFFFFFF)
            .setCentered(true));

        rootPanel.addChild(new GuiButton(0, 0, 160, 24, "Guardar Cambios", () -> {
            System.out.println("Configuración guardada");
        }));

        rootPanel.addChild(new GuiButton(0, 0, 160, 24, "Cerrar", this::closeScreen));
    }
}
```

### Abrir la Pantalla

```java
Minecraft.getMinecraft().displayGuiScreen(
    new MySettingsScreen(Minecraft.getMinecraft().currentScreen)
);
```

---

## Crear una Pantalla de Contenedor (`GuiBaseContainer`)

Extienda `GuiBaseContainer` para pantallas conectadas a un `Container` de inventario (bloques con inventario, cofres, máquinas):

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseContainer;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import net.minecraft.inventory.Container;
import net.minecraft.inventory.Slot;

public class MyContainerScreen extends GuiBaseContainer {

    public MyContainerScreen(Container container) {
        super(container);
    }

    @Override
    protected void initComponents() {
        rootPanel.addChild(new GuiLabel(8, 6, "Inventario de Máquina", 0xFF404040));

        // GuiSlot sincroniza automáticamente su posición en pantalla con el Slot vanilla
        for (Slot slot : inventorySlots.inventorySlots) {
            rootPanel.addChild(new GuiSlot(slot, this));
        }
    }
}
```

---

## Métodos Fluent en `GuiComponent`

En X4UI r1.0b5, los componentes cuentan con métodos fluidos encadenables directamente en su jerarquía base (`GuiComponent`):

```java
GuiButton btn = new GuiButton(0, 0, 120, 20, "Aceptar", this::onConfirm)
    .withPosition(10, 20)
    .withSize(140, 24)
    .withMargin(new Insets(4))
    .withLayer(5)
    .withPercentWidth(0.8f); // 80% del ancho del contenedor padre
```

También se puede usar `GuiBuilder` para construcción declarativa estática:

```java
GuiPanel panel = GuiBuilder.createPanel()
    .position(10, 10)
    .size(200, 300)
    .flexDirection(FlexDirection.VERTICAL)
    .gap(5)
    .padding(new Insets(8))
    .build();
```

---

## Qué Evitar Hacer (Antipatrones y Errores Críticos)

> [!CAUTION]
> **1. NUNCA importar clases de `client.gui` o `impl.client` en código del servidor o común.**
> Toda la interfaz gráfica está marcada con `@SideOnly(Side.CLIENT)`. Usar estas clases en paquetes comunes causará `ClassNotFoundException` en servidores dedicados. Para código común use únicamente `com.x4yi.x4ui.common.State<T>`.

> [!WARNING]
> **2. NUNCA ejecutar llamadas directas a OpenGL (`GL11`, `GlStateManager`, `Tessellator`).**
> Utilice siempre los métodos de `IGraphics`. Mezclar llamadas crudas de OpenGL con el renderizador de X4UI romperá el estado interno (matrices, recortes, etc).

> [!WARNING]
> **3. NUNCA hardcodear dimensiones mayores a 320 px de ancho sin prever el GUI Scale 4.**
> Coloque siempre contenidos largos dentro de un `GuiScrollPanel` y use dimensiones porcentuales (`withPercentWidth`) para soportar resoluciones pequeñas.

> [!IMPORTANT]
> **4. NUNCA crear instancias nuevas de `TrueTypeFont` repetidamente o en cada fotograma.**
> Registre las fuentes una única vez en `FontRegistry` al cargar el juego. Hacerlo durante el renderizado colapsará el rendimiento.

> [!IMPORTANT]
> **5. NUNCA olvidar desvincular escuchadores manuales de `State<T>`.**
> Utilice siempre `component.bindState(state, callback)` en lugar de `state.addListener()`. Esto asegura que el escuchador se desvincule automáticamente cuando el componente sea destruido.
[/ES]

[EN]
# 00 - Getting Started

X4UI is a modern, retained-mode user interface framework for Minecraft Forge 1.12.2. It provides a complete component tree architecture, responsive flexbox layout managers, an immediate graphics abstraction layer (`IGraphics`), hardware-accelerated TrueType/OpenType vector typography (`IFont`), hierarchical event propagation, reactive state binding (`State<T>`), smooth animations, and decoupled theming.

## Requirements

- Minecraft Forge 1.12.2 (`1.12.2-14.23.5.2847` or later)
- Java 8 (OpenJDK or Oracle JDK)

## Installation

Add the X4UI dependency to your `build.gradle` using any of the following repositories:

### Modrinth (Recommended)
```gradle
repositories {
    maven { url "https://api.modrinth.com/maven" }
}

dependencies {
    deobfCompile "maven.modrinth:x4ui:1.0b5"
}
```

### CurseForge
```gradle
repositories {
    maven { url "https://cursemaven.com" }
}

dependencies {
    deobfCompile "curse.maven:x4ui-PROJECT_ID:FILE_ID"
}
```

### GitHub Packages / JitPack
```gradle
repositories {
    maven { url "https://jitpack.io" }
}

dependencies {
    deobfCompile "com.github.x4yi:X4UI:1.0b5"
}
```

## Package Structure

All X4UI classes reside under `com.x4yi.x4ui`. The architecture cleanly isolates public APIs from internal implementations:

| Package | Purpose |
|---------|---------|
| `com.x4yi.x4ui.api.client.gui` | Immediate rendering abstraction (`IGraphics`) |
| `com.x4yi.x4ui.impl.client.gui` | Low-level OpenGL graphics implementation (`GLGraphics`) |
| `com.x4yi.x4ui.api.client.font` | Typography abstraction interface (`IFont`) |
| `com.x4yi.x4ui.impl.client.font` | Vector rasterizer (`TrueTypeFont`), registry (`FontRegistry`) |
| `com.x4yi.x4ui.client.gui.base` | Abstract screen bases (`GuiBaseScreen`, `GuiBaseContainer`) |
| `com.x4yi.x4ui.client.gui.component` | UI widgets (`GuiPanel`, `GuiButton`, `GuiLabel`, `GuiImage`, etc.) |
| `com.x4yi.x4ui.client.gui.component.layout` | Layout managers (`FlexLayout`, `FlexDirection`) |
| `com.x4yi.x4ui.client.gui.component.slider` | Modular typed sliders (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`) |
| `com.x4yi.x4ui.client.gui.component.sprite` | 2D animation engine (`ISpriteSource`, `SpriteSheetSource`, `SequenceSource`) |
| `com.x4yi.x4ui.client.gui.component.image` | 9-slice border configurations (`NineSliceConfig`) |
| `com.x4yi.x4ui.client.gui.overlay` | Non-intrusive screen overlays (`GuiOverlayManager`, `OverlayDockManager`) |
| `com.x4yi.x4ui.client.gui.compat.jei` | Native JEI integration (`JeiPlugin`) |
| `com.x4yi.x4ui.client.gui.bus` | Reactive inter-mod state bus (`UIStateBus`) |
| `com.x4yi.x4ui.client.gui.utils` | Utilities (`GuiBuilder`, `ITheme`, `DefaultTheme`, `ThemeRegistry`, `Insets`) |
| `com.x4yi.x4ui.common` | Server-safe reactive state primitives (`State<T>`) |
| `com.x4yi.x4ui.common.sync` | Container window property synchronization (`NetworkSyncHelper`) |
| `com.x4yi.x4ui.proxy` | Strict sided proxy separation (`ClientProxy`, `CommonProxy`) |

---

## Creating a Standalone Screen (`GuiBaseScreen`)

Extend `GuiBaseScreen` for screens that do not interact with inventory containers (e.g., configuration menus, dialogs, media players):

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseScreen;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.client.gui.utils.Insets;
import net.minecraft.client.gui.GuiScreen;

public class MySettingsScreen extends GuiBaseScreen {

    public MySettingsScreen(GuiScreen parent) {
        super(parent, "Settings");
    }

    @Override
    protected void initComponents() {
        // rootPanel is automatically created spanning the full display window
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(8);
        rootPanel.setPadding(new Insets(16));

        rootPanel.addChild(new GuiLabel(0, 0, "Main Settings", 0xFFFFFFFF)
            .setCentered(true));

        rootPanel.addChild(new GuiButton(0, 0, 160, 24, "Save Changes", () -> {
            System.out.println("Settings saved");
        }));

        rootPanel.addChild(new GuiButton(0, 0, 160, 24, "Close", this::closeScreen));
    }
}
```

### Opening the Screen

```java
Minecraft.getMinecraft().displayGuiScreen(
    new MySettingsScreen(Minecraft.getMinecraft().currentScreen)
);
```

---

## Creating an Inventory Container Screen (`GuiBaseContainer`)

Extend `GuiBaseContainer` for screens bound to a Minecraft `Container` (chest GUIs, machine inventories, crafting tables):

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseContainer;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import net.minecraft.inventory.Container;
import net.minecraft.inventory.Slot;

public class MyContainerScreen extends GuiBaseContainer {

    public MyContainerScreen(Container container) {
        super(container);
    }

    @Override
    protected void initComponents() {
        rootPanel.addChild(new GuiLabel(8, 6, "Machine Inventory", 0xFF404040));

        // GuiSlot automatically mirrors screen coordinates with the vanilla Slot
        for (Slot slot : inventorySlots.inventorySlots) {
            rootPanel.addChild(new GuiSlot(slot, this));
        }
    }
}
```

---

## Fluent Methods on `GuiComponent`

In X4UI r1.0b5, components expose chainable builder methods directly on `GuiComponent`:

```java
GuiButton btn = new GuiButton(0, 0, 120, 20, "Confirm", this::onConfirm)
    .withPosition(10, 20)
    .withSize(140, 24)
    .withMargin(new Insets(4))
    .withLayer(5)
    .withPercentWidth(0.8f); // 80% of parent width
```

Static declarative creation is also available via `GuiBuilder`:

```java
GuiPanel panel = GuiBuilder.createPanel()
    .position(10, 10)
    .size(200, 300)
    .flexDirection(FlexDirection.VERTICAL)
    .gap(5)
    .padding(new Insets(8))
    .build();
```

---

## What to Avoid (Pitfalls & Anti-Patterns)

> [!CAUTION]
> **1. NEVER import `client.gui` or `impl.client` classes in common or server code.**
> All X4UI graphical components are `@SideOnly(Side.CLIENT)`. Using them in common packages will crash dedicated servers with `ClassNotFoundException`. In common code, only use `com.x4yi.x4ui.common.State<T>`.

> [!WARNING]
> **2. NEVER execute raw OpenGL calls (`GL11`, `GlStateManager`, `Tessellator`).**
> Always use `IGraphics` drawing methods. Emitting raw OpenGL vertices disrupts X4UI's internal rendering state (matrices, scissor bounds, etc).

> [!WARNING]
> **3. NEVER hardcode absolute positions exceeding 320 px without testing in GUI Scale 4.**
> Always encapsulate tall layouts in a `GuiScrollPanel` and use relative sizing (`withPercentWidth`) to support smaller resolutions.

> [!IMPORTANT]
> **4. NEVER create new `TrueTypeFont` instances repeatedly or per tick.**
> Register fonts once in `FontRegistry` at load time. Doing this during rendering will severely impact performance.

> [!IMPORTANT]
> **5. NEVER leave manual `State<T>` listeners uncleaned.**
> Prefer `component.bindState(state, callback)` over `state.addListener()`. This ensures the listener is automatically unbound upon component destruction.
[/EN]
