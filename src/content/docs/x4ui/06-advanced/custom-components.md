---
title: "Custom Components"
project: "X4UI"
category: "Advanced"
categoryOrder: 6
---

[ES]
# Custom Components (Componentes Personalizados)

Si necesitas hacer algo muy específico para tu mod que no está incluido en los componentes por defecto (por ejemplo, dibujar una barra de maná circular), puedes crear tu propio componente.

## Crear un Componente Nuevo

Para hacer esto, debes crear una clase que herede de `GuiComponent` y sobreescribir el método `drawSelf()`.

### Plantilla Básica
```java
import com.x4yi.x4ui.client.gui.component.GuiComponent;

public class BarraDeMana extends GuiComponent {
    private int manaActual;

    public BarraDeMana(int x, int y, int width, int height) {
        super(x, y, width, height);
    }

    public void setMana(int mana) {
        this.manaActual = mana;
    }

    @Override
    protected void drawSelf(int mouseX, int mouseY, float partialTicks) {
        // REGLA DE ORO: Siempre usa las posiciones Absolutas
        int globalX = getAbsoluteX();
        int globalY = getAbsoluteY();

        // Usa los métodos normales de Minecraft para dibujar (Ej: Renderizado de la barra)
        drawRect(globalX, globalY, globalX + (manaActual * width / 100), globalY + height, 0xFF0000FF); 
    }
}
```

## Reglas Importantes

### 1. Avisar de Cambios (`markDirty()`)
Si tu componente cambia de tamaño (`width` o `height`) mientras estás en el menú, debes llamar a `markDirty()`. Esto le dice al panel padre que debe reorganizar el espacio.

### 2. Recibir Clics
Si quieres que tu componente reaccione a los clics del ratón, sobreescribe `mouseClicked`. 
Es **muy importante** que devuelvas `true` si el clic te pertenece, para que el sistema deje de comprobar otros botones que puedan estar detrás.

```java
@Override
public boolean mouseClicked(int mouseX, int mouseY, int mouseButton) {
    // 1. Primero, dale la oportunidad a los hijos (si este componente tiene hijos)
    if (super.mouseClicked(mouseX, mouseY, mouseButton)) return true;

    // 2. Comprobar si el ratón está encima y es clic izquierdo
    if (isMouseOver(mouseX, mouseY) && enabled && mouseButton == 0) {
        System.out.println("Clic en la barra de maná!");
        
        // 3. Devuelve true para consumir el clic
        return true; 
    }
    return false; // El clic no era para nosotros
}
```

### 3. Tooltips
Si quieres que tu componente muestre un tooltip al pasar el ratón, llama a `setTooltip()`:

```java
public BarraDeMana(int x, int y, int width, int height) {
    super(x, y, width, height);
    setTooltip("Maná: 100/100");
}
```

El tooltip se renderiza automáticamente por `GuiBaseScreen` y `GuiBaseContainer` cuando `getHoveredComponent()` encuentra un componente con texto de tooltip.

### 4. Arrastre (Drag and Drop)
Cualquier componente puede ser arrastrable. Usa `setDraggable(true)` para activar el arrastre libre, o usa `setDragConstraint(DragConstraint.PARENT_BOUNDS)` para restringir el arrastre dentro del área con padding del padre:

```java
public class PanelArrastrable extends GuiComponent {
    public PanelArrastrable(int x, int y, int width, int height) {
        super(x, y, width, height);
        setDraggable(true);
        setDragConstraint(DragConstraint.PARENT_BOUNDS);
    }

    @Override
    protected void drawSelf(int mouseX, int mouseY, float partialTicks) {
        drawRect(getAbsoluteX(), getAbsoluteY(), getAbsoluteX() + width, getAbsoluteY() + height, 0xFF333333);
    }
}
```

El sistema de arrastre maneja `mouseClicked`, `mouseClickMove` y `mouseReleased` automáticamente. No necesitas sobreescribirlos para un arrastre básico.

[/ES]

[EN]
# Custom Components

If you need to do something very specific for your mod that isn't included in the default components (for example, drawing a circular mana bar), you can create your own component.

## Creating a New Component

To do this, you must create a class that inherits from `GuiComponent` and override the `drawSelf()` method.

### Basic Template
```java
import com.x4yi.x4ui.client.gui.component.GuiComponent;

public class ManaBar extends GuiComponent {
    private int currentMana;

    public ManaBar(int x, int y, int width, int height) {
        super(x, y, width, height);
    }

    public void setMana(int mana) {
        this.currentMana = mana;
    }

    @Override
    protected void drawSelf(int mouseX, int mouseY, float partialTicks) {
        // GOLDEN RULE: Always use Absolute positions
        int globalX = getAbsoluteX();
        int globalY = getAbsoluteY();

        // Use standard Minecraft methods to draw (e.g. rendering the bar)
        drawRect(globalX, globalY, globalX + (currentMana * width / 100), globalY + height, 0xFF0000FF); 
    }
}
```

## Important Rules

### 1. Notify Changes (`markDirty()`)
If your component changes size (`width` or `height`) while in the menu, you must call `markDirty()`. This tells the parent panel that it needs to reorganize the layout.

### 2. Receive Clicks
If you want your component to react to mouse clicks, override `mouseClicked`. 
It is **very important** that you return `true` if the click belongs to you, so the system stops checking other buttons that might be behind it.

```java
@Override
public boolean mouseClicked(int mouseX, int mouseY, int mouseButton) {
    // 1. First, give the children a chance (if this component has children)
    if (super.mouseClicked(mouseX, mouseY, mouseButton)) return true;

    // 2. Check if the mouse is hovering and it's a left click
    if (isMouseOver(mouseX, mouseY) && enabled && mouseButton == 0) {
        System.out.println("Mana bar clicked!");
        
        // 3. Return true to consume the click
        return true; 
    }
    return false; // The click was not for us
}
```

### 3. Tooltips
If you want your component to show a tooltip when the mouse hovers over it, call `setTooltip()`:

```java
public BarraDeMana(int x, int y, int width, int height) {
    super(x, y, width, height);
    setTooltip("Mana: 100/100");
}
```

The tooltip is rendered automatically by `GuiBaseScreen` and `GuiBaseContainer` when `getHoveredComponent()` finds a component with a tooltip text.

### 4. Drag and Drop
Any component can be made draggable. Use `setDraggable(true)` to enable free dragging, or use `setDragConstraint(DragConstraint.PARENT_BOUNDS)` to constrain the drag within the parent's padded area:

```java
public class DraggablePanel extends GuiComponent {
    public DraggablePanel(int x, int y, int width, int height) {
        super(x, y, width, height);
        setDraggable(true);
        setDragConstraint(DragConstraint.PARENT_BOUNDS);
    }

    @Override
    protected void drawSelf(int mouseX, int mouseY, float partialTicks) {
        drawRect(getAbsoluteX(), getAbsoluteY(), getAbsoluteX() + width, getAbsoluteY() + height, 0xFF333333);
    }
}
```

The drag system handles `mouseClicked`, `mouseClickMove`, and `mouseReleased` automatically. You don't need to override them for basic dragging.

[/EN]
