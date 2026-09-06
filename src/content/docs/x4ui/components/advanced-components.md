---
title: "Advanced Components"
project: "X4UI"
category: "Components"
categoryOrder: 4
---

[ES]
# Componentes Avanzados

Este documento cubre los componentes especializados de X4UI: `GuiMarkdown` (renderizado de texto enriquecido), `GuiModelRender` (visualización 3D de entidades e ítems), `GuiDropdown` (selectores con scroll y apertura adaptativa) y el sistema jerárquico de Tooltips.

---

## GuiMarkdown

Un motor ligero de análisis sintáctico y renderizado de Markdown dentro del juego para guías, tutoriales y documentación interactiva.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiMarkdown`

### Uso Básico
```java
import com.x4yi.x4ui.client.gui.component.GuiMarkdown;

String doc = "# Guía de Usuario\n\n"
           + "Bienvenido a la documentación de **X4UI**.\n\n"
           + "- Arquitectura fluida\n"
           + "- Tipografía vectorial\n"
           + "- [Ver Repositorio](https://github.com/X4yi/X4UI)";

GuiMarkdown viewer = new GuiMarkdown(10, 10, 260, doc);
viewer.onLinkClicked = url -> System.out.println("Enlace abierto: " + url);
rootPanel.addChild(viewer);
```

---

## GuiModelRender

Renderiza entidades vivas (`EntityLivingBase`) o pilas de objetos (`ItemStack`) en tres dimensiones dentro del espacio 2D de la interfaz gráfica.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiModelRender`

### Renderizado de Entidades 3D
```java
import com.x4yi.x4ui.client.gui.component.GuiModelRender;
import net.minecraft.entity.passive.EntitySheep;

GuiModelRender entityPreview = new GuiModelRender(20, 20, 120, 120);
entityPreview.setEntity(new EntitySheep(mc.world));
entityPreview.setScale(35.0f);
entityPreview.setLookAtCursor(true);       // Rota la cabeza hacia el cursor del mouse
entityPreview.setAllowDragRotation(true);  // Permite al usuario rotar arrastrando
rootPanel.addChild(entityPreview);
```

### Aislamiento de Profundidad (Z-Buffer) en r1.0b5
En X4UI r1.0b5, `GuiModelRender` aísla su búfer de profundidad (`GL_DEPTH_TEST`) mediante `IGraphics`, permitiendo que modelos complejos se rendericen sin que las caras traseras se traspasen sobre las frontales ni contaminen el resto de la interfaz 2D.

---

## GuiDropdown

Un selector desplegable genérico enlazado reactivamente a un `State<T>`.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiDropdown`

### Constructor y Operación
```java
import com.x4yi.x4ui.client.gui.component.GuiDropdown;
import com.x4yi.x4ui.common.State;
import java.util.Arrays;

State<String> selectedMode = new State<>("Normal");
GuiDropdown<String> dropdown = new GuiDropdown<>(
    10, 10, 160, 20,
    selectedMode,
    Arrays.asList("Fácil", "Normal", "Difícil", "Extremo", "Creativo", "Aventura")
);

rootPanel.addChild(dropdown);
```

### Características en r1.0b5:
- **Desplazamiento por Rueda de Ratón:** Cuando la lista de opciones excede el máximo visible (por defecto 5), el menú habilita desplazamiento por rueda y muestra un indicador de barra de scroll interactiva.
- **Apertura Adaptativa:** Si el selector se encuentra cerca del borde inferior de la pantalla, se despliega automáticamente hacia arriba para no salirse de la ventana.
- **Elevación de Capa Automática:** Al abrirse, eleva automáticamente su capa visual (`layer + 100`) para renderizarse por encima de los componentes adyacentes, restaurándola al cerrarse.

---

## Sistema de Tooltips

Permite desplegar información flotante contextual al pasar el ratón por encima de cualquier componente:

### 1. Tooltip de Texto Simple y Multilínea
```java
button.setTooltip("Guardar datos en disco");
statusIcon.setTooltip("Estado: Óptimo\nLatencia: 15 ms\nPaquetes: 0 perdidos");
```

### 2. Tooltip de Componente Personalizado
Puede asignar un `GuiPanel` enriquecido con etiquetas, imágenes o íconos como tooltip:

```java
GuiPanel richTooltip = new GuiPanel(0, 0, 140, 50);
richTooltip.addChild(new GuiLabel(4, 4, "Espada de Diamante", 0xFF00FFFF));
richTooltip.addChild(new GuiLabel(4, 20, "+7 Daño de Ataque", 0xFFAAAAAA));

button.setTooltipComponent(richTooltip);
```

---

## Qué Evitar Hacer (Antipatrones en Componentes Avanzados)

> [!CAUTION]
> **1. NUNCA dejar animaciones de entidad activas en `GuiModelRender` si no son necesarias.**
> Desactive las animaciones de reposo si renderiza modelos estáticos para ahorrar rendimiento (`setEnableEntityAnimations(false)`).

> [!WARNING]
> **2. NUNCA colocar `GuiDropdown` dentro de paneles recortados (con scroll) sin revisar elevación.**
> La lista emergente podría quedar cortada por el área del panel padre.

> [!IMPORTANT]
> **3. NUNCA re-parsear cadenas Markdown en cada fotograma.**
> Actualice `GuiMarkdown` únicamente cuando cambie el texto origen mediante `setText()`.
[/ES]

[EN]
# Advanced Components

This document details specialized X4UI components: `GuiMarkdown` (in-game rich text rendering), `GuiModelRender` (3D entity and item rendering), `GuiDropdown` (interactive selectors with scroll and adaptive positioning), and the hierarchical Tooltip subsystem.

---

## GuiMarkdown

A lightweight, in-game Markdown parsing and rendering component designed for manuals, documentation, and quest dialogs.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiMarkdown`

### Basic Usage
```java
import com.x4yi.x4ui.client.gui.component.GuiMarkdown;

String doc = "# User Manual\n\n"
           + "Welcome to **X4UI** documentation.\n\n"
           + "- Retained-mode tree\n"
           + "- Vector typography\n"
           + "- [View Repository](https://github.com/X4yi/X4UI)";

GuiMarkdown viewer = new GuiMarkdown(10, 10, 260, doc);
viewer.onLinkClicked = url -> System.out.println("Opened link: " + url);
rootPanel.addChild(viewer);
```

---

## GuiModelRender

Renders living entities (`EntityLivingBase`) or item stacks (`ItemStack`) in three dimensions within the 2D user interface.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiModelRender`

### 3D Entity Rendering
```java
import com.x4yi.x4ui.client.gui.component.GuiModelRender;
import net.minecraft.entity.passive.EntitySheep;

GuiModelRender entityPreview = new GuiModelRender(20, 20, 120, 120);
entityPreview.setEntity(new EntitySheep(mc.world));
entityPreview.setScale(35.0f);
entityPreview.setLookAtCursor(true);       // Tracks mouse pointer with head rotation
entityPreview.setAllowDragRotation(true);  // Allows player click-and-drag rotation
rootPanel.addChild(entityPreview);
```

### Depth Buffer Isolation (Z-Buffer) in r1.0b5
In X4UI r1.0b5, `GuiModelRender` isolates its depth testing pipeline (`GL_DEPTH_TEST`) via `IGraphics`, ensuring intricate 3D models render without back faces shining through front faces or contaminating the 2D GUI canvas.

---

## GuiDropdown

A generic selector popup dropdown reactively linked to a `State<T>`.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiDropdown`

### Constructor & Operations
```java
import com.x4yi.x4ui.client.gui.component.GuiDropdown;
import com.x4yi.x4ui.common.State;
import java.util.Arrays;

State<String> selectedMode = new State<>("Normal");
GuiDropdown<String> dropdown = new GuiDropdown<>(
    10, 10, 160, 20,
    selectedMode,
    Arrays.asList("Easy", "Normal", "Hard", "Extreme", "Creative", "Adventure")
);

rootPanel.addChild(dropdown);
```

### Features in r1.0b5:
- **Mouse-Wheel Scrolling:** When options exceed the visible limit (default 5), the dropdown activates wheel scrolling and displays an interactive scroll indicator.
- **Adaptive Upward Opening:** If positioned near the bottom of the screen, the popup automatically opens upward to avoid overflowing the window.
- **Automatic Layer Elevation:** Elevates its visual layer (`layer + 100`) upon opening so popup options render over sibling components, resetting layer on close.

---

## Tooltip Subsystem

Enables contextual floating tooltips upon hovering over any visual component:

### 1. Plain & Multiline Text Tooltips
```java
button.setTooltip("Save changes to disk");
statusIcon.setTooltip("Status: Optimal\nLatency: 15 ms\nPacket Loss: 0%");
```

### 2. Custom Component Tooltips
You can assign an entire `GuiPanel` featuring labels, images, or formatted icons as a tooltip:

```java
GuiPanel richTooltip = new GuiPanel(0, 0, 140, 50);
richTooltip.addChild(new GuiLabel(4, 4, "Diamond Sword", 0xFF00FFFF));
richTooltip.addChild(new GuiLabel(4, 20, "+7 Attack Damage", 0xFFAAAAAA));

button.setTooltipComponent(richTooltip);
```

---

## What to Avoid (Advanced Component Pitfalls)

> [!CAUTION]
> **1. NEVER leave entity idle animations running in `GuiModelRender` unnecessarily.**
> Call `setEnableEntityAnimations(false)` if static previews suffice to save CPU overhead.

> [!WARNING]
> **2. NEVER place `GuiDropdown` inside clipped panels without checking elevation.**
> Scissor clipping from parent scroll panels can truncate opened dropdowns.

> [!IMPORTANT]
> **3. NEVER re-parse Markdown strings on every render frame.**
> Update `GuiMarkdown` only when the source text changes via `setText()`.
[/EN]
