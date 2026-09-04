---
title: "00 Getting Started"
project: "X4UI"
category: "General"
categoryOrder: 0
---

[ES]
# 00 - Primeros Pasos

X4UI es un framework de interfaz gráfica de modo retenido para Minecraft Forge 1.12.2. Reemplaza el renderizado de modo inmediato de `GuiScreen` nativo con una arquitectura basada en árbol de componentes, diseños flexbox, propagación de eventos, enlace reactivo de estado y soporte de temas.

## Requisitos

- Minecraft Forge 1.12.2 (`1.12.2-14.23.5.2847`)
- Java 8

## Instalación

Agregue la dependencia de X4UI en `build.gradle`:

```gradle
repositories {
    maven { url "https://maven.x4yi.com/" }
}

dependencies {
    deobfCompile "com.x4yi:X4UI-1.12.2:1.0b4"
}
```

## Estructura de Paquetes

Todas las clases de X4UI se encuentran bajo `com.x4yi.x4ui`. Los paquetes relevantes para el desarrollo de GUI del lado del cliente son:

| Paquete | Propósito |
|---------|-----------|
| `com.x4yi.x4ui.client.gui.base` | Clases abstractas base de pantalla (`GuiBaseScreen`, `GuiBaseContainer`) |
| `com.x4yi.x4ui.client.gui.component` | Todos los componentes UI (`GuiPanel`, `GuiButton`, `GuiLabel`, etc.) |
| `com.x4yi.x4ui.client.gui.component.layout` | Motores de diseño (`FlexLayout`, `FlexDirection`) |
| `com.x4yi.x4ui.client.gui.component.slider` | Deslizadores tipados (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`) |
| `com.x4yi.x4ui.client.gui.utils` | Utilidades (`GuiBuilder`, `ITheme`, `DefaultTheme`, `Insets`) |
| `com.x4yi.x4ui.common` | Primitivas de estado compartidas (`State<T>`) |
| `com.x4yi.x4ui.api.client.resource` | Gestión de recursos remotos (`RemoteResourceManager`) |

## Crear una Pantalla Standalone

Extienda `GuiBaseScreen` para pantallas que no interactúan con contenedores de inventario (por ejemplo, menús de configuración, paneles de información, reproductores de video).

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseScreen;
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import net.minecraft.client.gui.GuiScreen;

public class MySettingsScreen extends GuiBaseScreen {

    public MySettingsScreen(GuiScreen parent) {
        super(parent, "Settings");
    }

    @Override
    protected void initComponents() {
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(5);

        rootPanel.addChild(new GuiLabel(0, 0, "Settings", 0xFFFFFFFF).setCentered(true));

        rootPanel.addChild(new GuiButton(0, 0, 150, 20, "Option A", () -> {
            System.out.println("Option A clicked");
        }));

        rootPanel.addChild(new GuiButton(0, 0, 150, 20, "Option B", () -> {
            System.out.println("Option B clicked");
        }));

        rootPanel.addChild(new GuiButton(0, 0, 150, 20, "Close", () -> this.closeScreen()));
    }
}
```

Puntos clave:
- `rootPanel` se crea automáticamente en `initGui()` y ocupa toda la pantalla (`width` x `height`).
- `initComponents()` se llama después de que `rootPanel` se haya creado. Toda la configuración de componentes ocurre aquí.
- `closeScreen()` regresa a la pantalla padre pasada en el constructor.

### Abrir la Pantalla

```java
Minecraft.getMinecraft().displayGuiScreen(new MySettingsScreen(Minecraft.getMinecraft().currentScreen));
```

### Sobrescribir el Renderizado de Fondo

Sobrescriba `drawBackground` para renderizar fondos personalizados antes del árbol de componentes:

```java
@Override
protected void drawBackground(int mouseX, int mouseY, float partialTicks) {
    drawDefaultBackground();
}
```

## Crear una Pantalla de Contenedor

Extienda `GuiBaseContainer` para pantallas que envuelven un `Container` de Minecraft (por ejemplo, GUIs de cofres, mesas de trabajo, inventarios personalizados).

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseContainer;
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import net.minecraft.inventory.Container;
import net.minecraft.inventory.Slot;

public class MyContainerScreen extends GuiBaseContainer {

    public MyContainerScreen(Container container) {
        super(container);
    }

    @Override
    protected void initComponents() {
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(2);

        rootPanel.addChild(new GuiLabel(0, 0, "My Inventory", 0xFFFFFFFF).setCentered(true));

        for (Slot slot : inventorySlots.inventorySlots) {
            rootPanel.addChild(new GuiSlot(slot, this));
        }
    }
}
```

Puntos clave:
- El constructor recibe una instancia de `Container`, que se pasa al super-constructor de `GuiContainer`.
- `getGuiLeft()` y `getGuiTop()` exponen los offsets del contenedor vanilla para el posicionamiento de slots.
- `GuiSlot` sincroniza automáticamente su posición con `Slot.xPos`/`Slot.yPos` de vanilla cada tick.
- Las áreas de recetas JEI se pueden registrar mediante `getJeiRecipeAreas()`.

## Uso de la API Builder

`GuiBuilder<T>` proporciona una API fluida para construir componentes sin constructores verbosos:

```java
import com.x4yi.x4ui.client.gui.utils.GuiBuilder;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.common.State;

// Panel con diseño flex
GuiPanel panel = GuiBuilder.createPanel()
    .position(10, 10)
    .size(200, 300)
    .flexDirection(FlexDirection.VERTICAL)
    .gap(5)
    .padding(new Insets(10))
    .build();

// Botón con tooltip y manejador de clics
GuiButton btn = GuiBuilder.createButton("Save")
    .position(0, 0)
    .size(120, 25)
    .tooltip("Save configuration")
    .onClick(() -> System.out.println("Saved!"))
    .build();

// Etiqueta enlazada a un State reactivo
State<String> nameState = new State<>("Player");
GuiLabel label = GuiBuilder.createLabel("")
    .position(0, 0)
    .bindLabelText(nameState)
    .build();

// Deslizador con estado reactivo
State<Integer> volume = new State<>(50);
GuiSliderInt slider = GuiBuilder.createSliderInt(volume, 0, 100, 5)
    .position(0, 0)
    .size(150, 15)
    .build();
```

## Aplicar un Tema

Los temas controlan todos los estilos visuales (colores, bordes, tooltips). Aplique un tema al panel raíz para dar estilo a toda la pantalla:

```java
import com.x4yi.x4ui.client.gui.utils.DefaultTheme;

@Override
protected void initComponents() {
    setTheme(DefaultTheme.INSTANCE);
    // ... agregar componentes
}
```

Los temas personalizados implementan `ITheme` y se pueden aplicar por componente o por subárbol:

```java
import com.x4yi.x4ui.client.gui.utils.ITheme;

ITheme myTheme = new ITheme() {
    @Override public int getPrimaryColor() { return 0xFFFF5722; }
    @Override public int getBackgroundColor() { return 0xFF263238; }
    @Override public int getTextColor() { return 0xFFFFFFFF; }
    // ... implementar todos los métodos
};

panel.setTheme(myTheme);
```

## Enviar Acciones al Servidor

Para la comunicación cliente-a-servidor, configure un `IGuiActionSender` en la pantalla:

```java
import com.x4yi.x4ui.common.sync.IGuiActionSender;
import net.minecraft.nbt.NBTTagCompound;

IGuiActionSender sender = (actionId, data) -> {
    // Enviar paquete de red al servidor
    MyModNetwork.CHANNEL.sendToServer(new MyPacket(actionId, data));
};

setActionSender(sender);
```
[/ES]

[EN]
# 00 - Getting Started

X4UI is a retained-mode GUI framework for Minecraft Forge 1.12.2. It replaces vanilla's immediate-mode `GuiScreen` rendering with a component tree architecture, flexbox layouts, event bubbling, reactive state binding, and theme support.

## Requirements

- Minecraft Forge 1.12.2 (`1.12.2-14.23.5.2847`)
- Java 8

## Installation

Add the X4UI dependency to `build.gradle`:

```gradle
repositories {
    maven { url "https://maven.x4yi.com/" }
}

dependencies {
    deobfCompile "com.x4yi:X4UI-1.12.2:1.0b4"
}
```

## Package Structure

All X4UI classes reside under `com.x4yi.x4ui`. The relevant packages for client-side GUI development are:

| Package | Purpose |
|---------|---------|
| `com.x4yi.x4ui.client.gui.base` | Abstract screen base classes (`GuiBaseScreen`, `GuiBaseContainer`) |
| `com.x4yi.x4ui.client.gui.component` | All UI components (`GuiPanel`, `GuiButton`, `GuiLabel`, etc.) |
| `com.x4yi.x4ui.client.gui.component.layout` | Layout engines (`FlexLayout`, `FlexDirection`) |
| `com.x4yi.x4ui.client.gui.component.slider` | Typed sliders (`GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`) |
| `com.x4yi.x4ui.client.gui.utils` | Utilities (`GuiBuilder`, `ITheme`, `DefaultTheme`, `Insets`) |
| `com.x4yi.x4ui.common` | Shared state primitives (`State<T>`) |
| `com.x4yi.x4ui.api.client.resource` | Remote asset management (`RemoteResourceManager`) |

## Creating a Standalone Screen

Extend `GuiBaseScreen` for screens that do not interact with inventory containers (e.g., settings menus, info panels, video players).

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseScreen;
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import net.minecraft.client.gui.GuiScreen;

public class MySettingsScreen extends GuiBaseScreen {

    public MySettingsScreen(GuiScreen parent) {
        super(parent, "Settings");
    }

    @Override
    protected void initComponents() {
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(5);

        rootPanel.addChild(new GuiLabel(0, 0, "Settings", 0xFFFFFFFF).setCentered(true));

        rootPanel.addChild(new GuiButton(0, 0, 150, 20, "Option A", () -> {
            System.out.println("Option A clicked");
        }));

        rootPanel.addChild(new GuiButton(0, 0, 150, 20, "Option B", () -> {
            System.out.println("Option B clicked");
        }));

        rootPanel.addChild(new GuiButton(0, 0, 150, 20, "Close", () -> this.closeScreen()));
    }
}
```

Key points:
- `rootPanel` is created automatically in `initGui()` and fills the entire screen (`width` x `height`).
- `initComponents()` is called after `rootPanel` is created. All component setup happens here.
- `closeScreen()` returns to the parent screen passed in the constructor.

### Opening the Screen

```java
Minecraft.getMinecraft().displayGuiScreen(new MySettingsScreen(Minecraft.getMinecraft().currentScreen));
```

### Overriding Background Rendering

Override `drawBackground` to render custom backgrounds before the component tree:

```java
@Override
protected void drawBackground(int mouseX, int mouseY, float partialTicks) {
    drawDefaultBackground();
}
```

## Creating a Container Screen

Extend `GuiBaseContainer` for screens that wrap a Minecraft `Container` (e.g., chest GUIs, crafting tables, custom inventories).

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseContainer;
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import net.minecraft.inventory.Container;
import net.minecraft.inventory.Slot;

public class MyContainerScreen extends GuiBaseContainer {

    public MyContainerScreen(Container container) {
        super(container);
    }

    @Override
    protected void initComponents() {
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(2);

        rootPanel.addChild(new GuiLabel(0, 0, "My Inventory", 0xFFFFFFFF).setCentered(true));

        for (Slot slot : inventorySlots.inventorySlots) {
            rootPanel.addChild(new GuiSlot(slot, this));
        }
    }
}
```

Key points:
- The constructor receives a `Container` instance, passed to `GuiContainer`'s super constructor.
- `getGuiLeft()` and `getGuiTop()` expose the vanilla container offsets for slot positioning.
- `GuiSlot` automatically syncs its position with the vanilla `Slot.xPos`/`Slot.yPos` each tick.
- JEI recipe areas can be registered via `getJeiRecipeAreas()`.

## Using the Builder API

`GuiBuilder<T>` provides a fluent API for constructing components without verbose constructors:

```java
import com.x4yi.x4ui.client.gui.utils.GuiBuilder;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import com.x4yi.x4ui.common.State;

// Panel with flex layout
GuiPanel panel = GuiBuilder.createPanel()
    .position(10, 10)
    .size(200, 300)
    .flexDirection(FlexDirection.VERTICAL)
    .gap(5)
    .padding(new Insets(10))
    .build();

// Button with tooltip and click handler
GuiButton btn = GuiBuilder.createButton("Save")
    .position(0, 0)
    .size(120, 25)
    .tooltip("Save configuration")
    .onClick(() -> System.out.println("Saved!"))
    .build();

// Label bound to a reactive State
State<String> nameState = new State<>("Player");
GuiLabel label = GuiBuilder.createLabel("")
    .position(0, 0)
    .bindLabelText(nameState)
    .build();

// Slider with reactive state
State<Integer> volume = new State<>(50);
GuiSliderInt slider = GuiBuilder.createSliderInt(volume, 0, 100, 5)
    .position(0, 0)
    .size(150, 15)
    .build();
```

## Applying a Theme

Themes control all visual styles (colors, borders, tooltips). Apply a theme to the root panel to style the entire screen:

```java
import com.x4yi.x4ui.client.gui.utils.DefaultTheme;

@Override
protected void initComponents() {
    setTheme(DefaultTheme.INSTANCE);
    // ... add components
}
```

Custom themes implement `ITheme` and can be applied per-component or per-subtree:

```java
import com.x4yi.x4ui.client.gui.utils.ITheme;

ITheme myTheme = new ITheme() {
    @Override public int getPrimaryColor() { return 0xFFFF5722; }
    @Override public int getBackgroundColor() { return 0xFF263238; }
    @Override public int getTextColor() { return 0xFFFFFFFF; }
    // ... implement all methods
};

panel.setTheme(myTheme);
```

## Sending Actions to the Server

For client-to-server communication, set an `IGuiActionSender` on the screen:

```java
import com.x4yi.x4ui.common.sync.IGuiActionSender;
import net.minecraft.nbt.NBTTagCompound;

IGuiActionSender sender = (actionId, data) -> {
    // Send network packet to server
    MyModNetwork.CHANNEL.sendToServer(new MyPacket(actionId, data));
};

setActionSender(sender);
```
[/EN]
