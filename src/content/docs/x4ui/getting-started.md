---
title: "Getting Started"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 0
---

[ES]
# 00 - Primeros Pasos

X4UI (`r1.0b6`) es un framework de interfaz gráfica en modo retenido, estado reactivo y red servidor–cliente para **Minecraft Forge 1.12.2 (Java 8 + LWJGL 2)** y **CleanroomMC (Java 25 + LWJGL 3)**.

> *Nota: Únicamente la documentación de X4UI fue redactada con IA (Gemini), siendo revisada y aprobada mediante pruebas humanas (X4yi).*

---

## 1. Requisitos y Compatibilidad

- **Entorno de ejecución:** Minecraft Forge `1.12.2` (`14.23.5.2847` o superior, Java 8) o CleanroomMC (Java 25).
- **Compilación de mods consumidores:** `sourceCompatibility = 1.8` y `targetCompatibility = 1.8` para garantizar portabilidad de bytecode en ambos runtimes.
- **Artefacto de distribución:** utilizar siempre el JAR reobfuscado generado por `reobfJar` (`x4ui-r1.0b6.jar`) en entornos de producción o servidores; `*-dev.jar` es exclusivo para desarrollo desofuscado.

### Dependencia en `build.gradle`

```gradle
repositories {
    maven { url "https://jitpack.io" }
}

dependencies {
    deobfCompile "com.github.x4yi:X4UI:r1.0b6"
}
```

---

## 2. Arquitectura de Paquetes

X4UI separa estrictamente contratos públicos (`api`), código seguro para servidor dedicado (`common`), capa de cliente (`client`) e implementaciones internas (`impl`):

| Paquete | Responsabilidad |
| :--- | :--- |
| `com.x4yi.x4ui.api.client.gui` | Contrato de renderizado inmediato (`IGraphics`). |
| `com.x4yi.x4ui.api.client.font` | Contrato de tipografía (`IFont`). |
| `com.x4yi.x4ui.api.client.media` | Interfaces de audio/video (`IMediaService`, `IVideoDecoder`, `IAudioDecoder`, `MediaRegistry`). |
| `com.x4yi.x4ui.client.gui` | Registro remoto de pantallas en cliente (`ScreenRegistry`). |
| `com.x4yi.x4ui.client.gui.base` | Pantallas base (`GuiBaseScreen`, `GuiBaseContainer`). |
| `com.x4yi.x4ui.client.gui.component` | Widgets (`GuiPanel`, `GuiButton`, `GuiLabel`, `GuiImage`, `GuiVideo`, `GuiVirtualList`, etc.). |
| `com.x4yi.x4ui.client.gui.component.layout` | Motor flexbox (`FlexLayout`, `FlexDirection`, `FlexAlign`, `ILayoutManager`). |
| `com.x4yi.x4ui.client.gui.component.slider` | Sliders tipados (`GuiSlider`, `GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`). |
| `com.x4yi.x4ui.client.gui.component.sprite` | Animación 2D (`ISpriteSource`, `SpriteSheetSource`, `SequenceSource`, `LoopMode`). |
| `com.x4yi.x4ui.client.gui.component.image` | Configuración 9-slice (`NineSliceConfig`). |
| `com.x4yi.x4ui.client.gui.component.toast` | Notificaciones toast (`GuiToast`, `GuiToastManager`, `ToastAnchor`). |
| `com.x4yi.x4ui.client.gui.animation` | Interpolación temporal (`GuiAnimator`). |
| `com.x4yi.x4ui.client.gui.input` | Abstracción de entrada LWJGL 2/3 (`KeyCodes`, `UIInput`). |
| `com.x4yi.x4ui.client.gui.overlay` | Inyección en GUIs (`IGuiOverlay`, `GuiOverlayManager`, `OverlayDockManager`, `ContainerAnchor`). |
| `com.x4yi.x4ui.client.gui.bus` | Bus reactivo de estados (`UIStateBus`). |
| `com.x4yi.x4ui.client.gui.utils` | Temas y constructores (`ITheme`, `DefaultTheme`, `ThemeRegistry`, `GuiBuilder`, `Insets`). |
| `com.x4yi.x4ui.client.gui.compat.jei` | Integración con Just Enough Items (`JeiPlugin`, `JeiAdvancedGuiHandler`). |
| `com.x4yi.x4ui.common` | Estado reactivo portable (`State<T>`). |
| `com.x4yi.x4ui.common.network` | Red server-optional (`UINetwork`, `UIChannels`, `ActionGuard`, `PacketGuiRpc`, `PacketStateBatch`). |
| `com.x4yi.x4ui.common.platform` | Puente Multi-Release Java 8 ↔ Java 25 (`PlatformBridge`). |
| `com.x4yi.x4ui.common.sync` | Sincronización de `Container` (`NetworkSyncHelper`, `StateContainerListener`). |
| `com.x4yi.x4ui.impl.client.*` | Implementaciones (`GLGraphics`, `TrueTypeFont`, `FontRegistry`, `MediaPipeline`, `SecurityUtils`). |
| `com.x4yi.x4ui.proxy` | Aislamiento estricto de sidedness (`ClientProxy`, `CommonProxy`). |

---

## 3. Pantallas Base (`GuiBaseScreen` y `GuiBaseContainer`)

### Pantalla Standalone (`GuiBaseScreen`)

Se utiliza para vistas sin inventario (menús, paneles administrativos, tiendas remotas, visores):

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseScreen;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiScreen;

public class SettingsScreen extends GuiBaseScreen {

    public SettingsScreen(GuiScreen parent) {
        super(parent, "Settings");
    }

    @Override
    protected void initComponents() {
        GuiPanel window = createCenteredWindow(360, 220);

        GuiPanel header = GuiPanel.row(8);
        header.addChild(new GuiLabel(0, 0, "Configuración", 0xFFFFFFFF));
        header.addChild(GuiPanel.spacer());
        header.addChild(new GuiButton(0, 0, 20, 20, "X", this::closeScreen));

        GuiPanel card = GuiPanel.card(10, 6);
        card.addChild(new GuiButton(0, 0, 0, 22, "Aplicar", this::onApply)
            .withPercentWidth(1.0f)
            .withVariant(GuiButton.Variant.PRIMARY));

        window.addChild(header);
        window.addChild(card);
        rootPanel.addChild(window);
    }

    private void onApply() {
        sendActionOrLocal("mymod:save_settings", null, () -> {});
    }

    public static void open(GuiScreen parent) {
        Minecraft.getMinecraft().displayGuiScreen(new SettingsScreen(parent));
    }
}
```

### Pantalla con Inventario (`GuiBaseContainer`)

Se utiliza cuando la interfaz está respaldada por un `Container` vanilla de inventario:

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseContainer;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import net.minecraft.inventory.Container;
import net.minecraft.inventory.Slot;

public class MachineScreen extends GuiBaseContainer {

    public MachineScreen(Container container) {
        super(container);
    }

    @Override
    protected void initComponents() {
        rootPanel.addChild(new GuiLabel(8, 6, "Inventario", 0xFFE6E8EC));

        for (Slot slot : inventorySlots.inventorySlots) {
            rootPanel.addChild(new GuiSlot(slot, this));
        }
    }
}
```

---

## 4. API Fluida de `GuiComponent` y `GuiBuilder`

Todos los componentes exponen métodos encadenables en `GuiComponent` para configurar dimensiones relativas, márgenes y capas sin coordenadas rígidas:

```java
GuiButton actionBtn = (GuiButton) new GuiButton(0, 0, 0, 22, "Confirmar", this::onConfirm)
    .withPercentWidth(1.0f)
    .withMargin(new Insets(4))
    .withLayer(5);
```

Para construcción declarativa de contenedores se dispone de `GuiBuilder`:

```java
GuiPanel panel = GuiBuilder.createPanel()
    .size(240, 180)
    .flexDirection(FlexDirection.VERTICAL)
    .gap(6)
    .padding(new Insets(8))
    .build();
```

---

## 5. Restricciones Iniciales

- No importar paquetes `com.x4yi.x4ui.client.*` o `com.x4yi.x4ui.impl.*` desde código común o de servidor dedicado.
- No instanciar componentes visuales dentro de `renderSelf()` ni recrear el árbol completo en `onScreenResize()`.
- Consultar la guía correspondiente según el subsistema:
  - Arquitectura y estado: `01-core-concepts.md`
  - Red y RPC: `03-networking-and-sync.md`
  - Diseño responsivo: `04-responsive-layout-and-scaling.md`
  - Compatibilidad Forge ↔ CleanroomMC: `09-forge-cleanroom-compatibility.md`
[/ES]

[EN]
# 00 - Getting Started

X4UI (`r1.0b6`) is a retained-mode UI, reactive state, and server–client framework for **Minecraft Forge 1.12.2 (Java 8 + LWJGL 2)** and **CleanroomMC (Java 25 + LWJGL 3)**.

> *Note: Only the X4UI documentation was drafted with AI (Gemini); all technical specifications and examples were reviewed and approved through human testing (X4yi).*

---

## 1. Requirements & Compatibility

- **Runtime environments:** Minecraft Forge `1.12.2` (`14.23.5.2847` or later, Java 8) or CleanroomMC (Java 25).
- **Consumer build target:** `sourceCompatibility = 1.8` and `targetCompatibility = 1.8` to ensure bytecode portability across both runtimes.
- **Distribution artifact:** always ship and test the `reobfJar` output (`x4ui-r1.0b6.jar`) in production or server environments; `*-dev.jar` is strictly for deobfuscated workspaces.

### Dependency in `build.gradle`

```gradle
repositories {
    maven { url "https://jitpack.io" }
}

dependencies {
    deobfCompile "com.github.x4yi:X4UI:r1.0b6"
}
```

---

## 2. Package Architecture

X4UI enforces strict boundaries between public contracts (`api`), dedicated-server-safe primitives (`common`), client UI (`client`), and internal backends (`impl`):

| Package | Responsibility |
| :--- | :--- |
| `com.x4yi.x4ui.api.client.gui` | Immediate rendering contract (`IGraphics`). |
| `com.x4yi.x4ui.api.client.font` | Typography contract (`IFont`). |
| `com.x4yi.x4ui.api.client.media` | Media service & decoder contracts (`IMediaService`, `IVideoDecoder`, `IAudioDecoder`, `MediaRegistry`). |
| `com.x4yi.x4ui.client.gui` | Client-side remote screen registry (`ScreenRegistry`). |
| `com.x4yi.x4ui.client.gui.base` | Base screen classes (`GuiBaseScreen`, `GuiBaseContainer`). |
| `com.x4yi.x4ui.client.gui.component` | UI widgets (`GuiPanel`, `GuiButton`, `GuiLabel`, `GuiImage`, `GuiVideo`, `GuiVirtualList`, etc.). |
| `com.x4yi.x4ui.client.gui.component.layout` | Flexbox engine (`FlexLayout`, `FlexDirection`, `FlexAlign`, `ILayoutManager`). |
| `com.x4yi.x4ui.client.gui.component.slider` | Typed sliders (`GuiSlider`, `GuiSliderInt`, `GuiSliderFloat`, `GuiSliderDouble`). |
| `com.x4yi.x4ui.client.gui.component.sprite` | 2D animation (`ISpriteSource`, `SpriteSheetSource`, `SequenceSource`, `LoopMode`). |
| `com.x4yi.x4ui.client.gui.component.image` | 9-slice border configuration (`NineSliceConfig`). |
| `com.x4yi.x4ui.client.gui.component.toast` | Toast notifications (`GuiToast`, `GuiToastManager`, `ToastAnchor`). |
| `com.x4yi.x4ui.client.gui.animation` | Time-based interpolation (`GuiAnimator`). |
| `com.x4yi.x4ui.client.gui.input` | LWJGL 2/3 input abstraction (`KeyCodes`, `UIInput`). |
| `com.x4yi.x4ui.client.gui.overlay` | Screen injection (`IGuiOverlay`, `GuiOverlayManager`, `OverlayDockManager`, `ContainerAnchor`). |
| `com.x4yi.x4ui.client.gui.bus` | Reactive state bus (`UIStateBus`). |
| `com.x4yi.x4ui.client.gui.utils` | Themes & builders (`ITheme`, `DefaultTheme`, `ThemeRegistry`, `GuiBuilder`, `Insets`). |
| `com.x4yi.x4ui.client.gui.compat.jei` | Just Enough Items integration (`JeiPlugin`, `JeiAdvancedGuiHandler`). |
| `com.x4yi.x4ui.common` | Portable reactive state (`State<T>`). |
| `com.x4yi.x4ui.common.network` | Server-optional networking (`UINetwork`, `UIChannels`, `ActionGuard`, `PacketGuiRpc`, `PacketStateBatch`). |
| `com.x4yi.x4ui.common.platform` | Multi-Release Java 8 ↔ Java 25 bridge (`PlatformBridge`). |
| `com.x4yi.x4ui.common.sync` | `Container` property synchronization (`NetworkSyncHelper`, `StateContainerListener`). |
| `com.x4yi.x4ui.impl.client.*` | Implementations (`GLGraphics`, `TrueTypeFont`, `FontRegistry`, `MediaPipeline`, `SecurityUtils`). |
| `com.x4yi.x4ui.proxy` | Strict sidedness isolation (`ClientProxy`, `CommonProxy`). |

---

## 3. Base Screens (`GuiBaseScreen` & `GuiBaseContainer`)

### Standalone Screen (`GuiBaseScreen`)

Used for non-inventory interfaces (settings menus, administrative panels, remote shops, media viewers):

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseScreen;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiScreen;

public class SettingsScreen extends GuiBaseScreen {

    public SettingsScreen(GuiScreen parent) {
        super(parent, "Settings");
    }

    @Override
    protected void initComponents() {
        GuiPanel window = createCenteredWindow(360, 220);

        GuiPanel header = GuiPanel.row(8);
        header.addChild(new GuiLabel(0, 0, "Settings", 0xFFFFFFFF));
        header.addChild(GuiPanel.spacer());
        header.addChild(new GuiButton(0, 0, 20, 20, "X", this::closeScreen));

        GuiPanel card = GuiPanel.card(10, 6);
        card.addChild(new GuiButton(0, 0, 0, 22, "Apply", this::onApply)
            .withPercentWidth(1.0f)
            .withVariant(GuiButton.Variant.PRIMARY));

        window.addChild(header);
        window.addChild(card);
        rootPanel.addChild(window);
    }

    private void onApply() {
        sendActionOrLocal("mymod:save_settings", null, () -> {});
    }

    public static void open(GuiScreen parent) {
        Minecraft.getMinecraft().displayGuiScreen(new SettingsScreen(parent));
    }
}
```

### Inventory Container Screen (`GuiBaseContainer`)

Used when a screen is backed by a vanilla inventory `Container`:

```java
package com.example.mymod.client.gui;

import com.x4yi.x4ui.client.gui.base.GuiBaseContainer;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiSlot;
import net.minecraft.inventory.Container;
import net.minecraft.inventory.Slot;

public class MachineScreen extends GuiBaseContainer {

    public MachineScreen(Container container) {
        super(container);
    }

    @Override
    protected void initComponents() {
        rootPanel.addChild(new GuiLabel(8, 6, "Inventory", 0xFFE6E8EC));

        for (Slot slot : inventorySlots.inventorySlots) {
            rootPanel.addChild(new GuiSlot(slot, this));
        }
    }
}
```

---

## 4. Fluent API on `GuiComponent` & `GuiBuilder`

All components expose chainable builder methods on `GuiComponent` for percentage sizing, spacing, and z-layer ordering:

```java
GuiButton actionBtn = (GuiButton) new GuiButton(0, 0, 0, 22, "Confirm", this::onConfirm)
    .withPercentWidth(1.0f)
    .withMargin(new Insets(4))
    .withLayer(5);
```

For declarative container construction, `GuiBuilder` is also available:

```java
GuiPanel panel = GuiBuilder.createPanel()
    .size(240, 180)
    .flexDirection(FlexDirection.VERTICAL)
    .gap(6)
    .padding(new Insets(8))
    .build();
```

---

## 5. Initial Constraints

- Do not import `com.x4yi.x4ui.client.*` or `com.x4yi.x4ui.impl.*` in common or dedicated-server classes.
- Do not instantiate visual components inside `renderSelf()` or rebuild the component tree inside `onScreenResize()`.
- Refer to the dedicated guide for each subsystem:
  - Architecture & state: `01-core-concepts.md`
  - Networking & RPC: `03-networking-and-sync.md`
  - Responsive design: `04-responsive-layout-and-scaling.md`
  - Forge ↔ CleanroomMC compatibility: `09-forge-cleanroom-compatibility.md`
[/EN]
