---
title: "First Ui"
project: "X4UI"
category: "Getting Started"
categoryOrder: 1
---

[ES]
# Primera UI (Hello World)

En Vanilla extiendes `GuiScreen`. En X4UI usas `GuiBaseScreen`, el cual gestiona automáticamente un contenedor raíz (`rootPanel`).

## 1. Crear la Pantalla

Crea una clase que herede de `GuiBaseScreen` y sobreescribe `initComponents()`:

```java
import com.x4yi.x4ui.client.gui.base.GuiBaseScreen;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import net.minecraft.client.gui.GuiScreen;
import net.minecraft.client.Minecraft;

public class GuiOpcionesMod extends GuiBaseScreen {

    public GuiOpcionesMod(GuiScreen parent) {
        // Enviar null si no hay pantalla anterior
        super(parent, "Opciones del Mod");
    }

    @Override
    protected void initComponents() {
        // Apilar hijos verticalmente
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(10);
        
        // Crear componentes
        GuiLabel titulo = new GuiLabel(0, 0, "Opciones de mi Mod", 0xFFFFFF);
        
        GuiButton btnCerrar = new GuiButton(0, 0, 100, 20, "Volver al Juego", () -> {
            Minecraft.getMinecraft().player.closeScreen();
        });
        
        // Añadir hijos al panel raíz
        rootPanel.addChild(titulo);
        rootPanel.addChild(btnCerrar);
    }
}
```

## 2. Mostrar la Pantalla

Abre la interfaz desde tu mod, por ejemplo desde un manejador de teclas (KeyBinding):

```java
import net.minecraft.client.Minecraft;

Minecraft.getMinecraft().displayGuiScreen(new GuiOpcionesMod(null));
```

## ¿Qué sucede aquí?

1. `GuiBaseScreen` crea automáticamente `rootPanel` (un `GuiPanel`) del tamaño de la pantalla.
2. Como usamos `FlexDirection.VERTICAL`, el título y el botón se colocan automáticamente uno debajo del otro, ignorando sus coordenadas locales iniciales.

[/ES]

[EN]
# First UI (Hello World)

In Vanilla, you extend `GuiScreen`. In X4UI, you use `GuiBaseScreen`, which automatically manages a root container (`rootPanel`).

## 1. Create the Screen

Create a class extending `GuiBaseScreen` and override `initComponents()`:

```java
import com.x4yi.x4ui.client.gui.base.GuiBaseScreen;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiButton;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;
import net.minecraft.client.gui.GuiScreen;
import net.minecraft.client.Minecraft;

public class GuiModOptions extends GuiBaseScreen {

    public GuiModOptions(GuiScreen parent) {
        // Pass null if there is no previous screen
        super(parent, "Mod Options");
    }

    @Override
    protected void initComponents() {
        // Stack children vertically
        rootPanel.setFlexDirection(FlexDirection.VERTICAL);
        rootPanel.setGap(10);
        
        // Create components
        GuiLabel title = new GuiLabel(0, 0, "My Mod Options", 0xFFFFFF);
        
        GuiButton btnClose = new GuiButton(0, 0, 100, 20, "Back to Game", () -> {
            Minecraft.getMinecraft().player.closeScreen();
        });
        
        // Add children to the root panel
        rootPanel.addChild(title);
        rootPanel.addChild(btnClose);
    }
}
```

## 2. Show the Screen

Open the interface from your mod, for example from a KeyBinding event handler:

```java
import net.minecraft.client.Minecraft;

Minecraft.getMinecraft().displayGuiScreen(new GuiModOptions(null));
```

## What happens here?

1. `GuiBaseScreen` automatically creates `rootPanel` (a `GuiPanel`) the size of the screen.
2. Since we used `FlexDirection.VERTICAL`, the title and the button are automatically stacked one below the other, ignoring their initial local coordinates.

[/EN]
