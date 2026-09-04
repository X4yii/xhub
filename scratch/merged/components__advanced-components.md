---
title: "Advanced Components"
project: "X4UI"
category: "Components"
categoryOrder: 4
---

[ES]
# Componentes Avanzados

Este documento cubre los componentes avanzados: `GuiMarkdown`, `GuiModelRender`, `GuiDropdown` y el sistema de tooltips.

---

## GuiMarkdown

Un parser y renderizador de markdown ligero para documentación dentro del juego. Parsea texto markdown crudo en un árbol de nodos renderizables.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiMarkdown`

### Constructor

```java
new GuiMarkdown(int x, int y, int width, String text)
```

La altura se calcula automáticamente basándose en el contenido parseado.

### Uso Básico

```java
import com.x4yi.x4ui.client.gui.component.GuiMarkdown;

String markdown = "# Title\n\nSome **bold** and _italic_ text.\n\n- Item 1\n- Item 2\n\n> This is a blockquote";

GuiMarkdown display = new GuiMarkdown(10, 10, 300, markdown);
rootPanel.addChild(display);
```

### En un Panel de Desplazamiento

```java
import com.x4yi.x4ui.client.gui.component.GuiScrollPanel;

GuiScrollPanel scroll = new GuiScrollPanel(10, 10, 350, 250);
GuiMarkdown text = new GuiMarkdown(0, 0, 330, loadMarkdownFile());
scroll.addChild(text);
rootPanel.addChild(scroll);
```

### Actualizar Contenido

```java
display.setText("# New Title\n\nUpdated content.");
```

### Sintaxis Soportada

#### Encabezados

```markdown
# Heading 1
## Heading 2
### Heading 3
```

Los encabezados se renderizan en negrita con colores distintivos:
- H1: `0xFF00E5FF` (cian)
- H2: `0xFF00E676` (verde)
- H3: `0xFFFFD600` (amarillo)

#### Negrita y Cursiva

```markdown
**bold text**
__also bold__
*italic text*
_and also italic_
```

#### Código Inline

```markdown
`code snippet`
```

Renderizado en `0xFFFFAB40` (ámbar).

#### Enlaces

```markdown
[link text](https://example.com)
```

Los enlaces se renderizan en `0xFF29B6F6` (azul claro) con subrayado. La detección de clics se maneja mediante `onLinkClicked`.

#### Citas

```markdown
> This is a blockquote
```

Renderizado con una barra izquierda (`0xFFAAAAAA`) e texto indentado.

#### Listas con Viñetas

```markdown
- Item 1
- Item 2
  - Nested item
    - Deeply nested
```

Soporta hasta 3 niveles de anidación con marcadores de viñeta coloreados:
- Nivel 0: `0xFF00C853` (verde)
- Nivel 1: `0xFF888892` (gris)
- Nivel 2: `0xFF555560` (gris oscuro)

#### Separadores

```markdown
---
***
___
```

Renderizado como una línea horizontal en `0xFF444450`.

#### Imágenes

```markdown
![alt text](mymod:textures/gui/image.png)
```

El texto `alt` puede especificar dimensiones: `![64x64](mymod:textures/icon.png)`. El tamaño predeterminado es 64x64.

### Manejo de Clics en Enlaces

```java
import com.x4yi.x4ui.client.gui.component.GuiMarkdown;

GuiMarkdown md = new GuiMarkdown(0, 0, 300, "Click [here](https://example.com) to learn more.");
md.onLinkClicked = url -> {
    System.out.println("Link clicked: " + url);
    // Abrir URL, navegar, etc.
};
```

### Navegación de Anclas

Los encabezados se registran automáticamente como anclas. El ID de la ancla es el texto del encabezado en minúsculas con caracteres no alfanuméricos reemplazados por guiones.

```java
// Para el encabezado: ## Getting Started
int yPosition = md.getAnchorY("getting-started");
```

### Campos Públicos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `onLinkClicked` | `Consumer<String>` | Callback para clics en enlaces |
| `textColor` | `int` | Color de texto predeterminado (0xFFE0E0E6) |
| `colorH1` | `int` | Color H1 (0xFF00E5FF) |
| `colorH2` | `int` | Color H2 (0xFF00E676) |
| `colorH3` | `int` | Color H3 (0xFFFFD600) |

### Renderizado

- El texto se ajusta por palabras en los límites de las palabras
- Cada palabra se mide mediante `FontWidthCache` para rendimiento
- Los enlaces se subrayan con una línea de 1px
- Las líneas vacías agregan 6px de espaciado vertical
- La altura de línea es de 10px

---

## GuiModelRender

Renderiza una entidad 3D o pila de objetos dentro de la GUI 2D. Soporta rotación por arrastre, rotación siguiendo el cursor y escala/desplazamiento configurable.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiModelRender`

### Constructor

```java
new GuiModelRender(int x, int y, int width, int height)
```

### Renderizar una Entidad

```java
import com.x4yi.x4ui.client.gui.component.GuiModelRender;
import net.minecraft.client.Minecraft;
import net.minecraft.entity.passive.EntitySheep;

GuiModelRender entityRender = new GuiModelRender(50, 50, 100, 100);

EntitySheep sheep = new EntitySheep(Minecraft.getMinecraft().world);
entityRender.setEntity(sheep);
entityRender.setScale(30f);

rootPanel.addChild(entityRender);
```

### Renderizar una Pila de Objetos

```java
import com.x4yi.x4ui.client.gui.component.GuiModelRender;
import net.minecraft.init.Items;

GuiModelRender itemRender = new GuiModelRender(200, 50, 64, 64);
itemRender.setItemStack(new ItemStack(Items.DIAMOND_SWORD));
itemRender.setScale(25f);

rootPanel.addChild(itemRender);
```

### Rotación Siguiendo el Cursor

La entidad rota para mirar el cursor del mouse:

```java
entityRender.setLookAtCursor(true);
```

### Rotación por Arrastre

El usuario puede hacer clic y arrastrar para rotar la entidad:

```java
entityRender.setAllowDragRotation(true);
```

### Rotación Estática

```java
entityRender.setRotation(0f, 45f, 0f);  // yaw, pitch, roll
```

### Desplazamiento de Traslación

```java
entityRender.setTranslation(0f, -10f, 0f);  // desplazamiento x, y, z en píxeles
```

### Deshabilitar Animaciones de Entidad

```java
entityRender.setEnableEntityAnimations(false);
```

Cuando está deshabilitado, las animaciones de reposo de la entidad (respiración, parpadeo) se congelan.

### API Fluent

```java
import com.x4yi.x4ui.client.gui.utils.GuiBuilder;

GuiModelRender render = GuiBuilder.createModelRender()
    .position(50, 50)
    .size(100, 100)
    .entity(sheep)
    .modelScale(30f)
    .modelRotation(0f, 45f, 0f)
    .modelDragRotation(true)
    .modelLookAtCursor(false)
    .build();
```

### Propiedades

| Método | Tipo | Descripción |
|--------|------|-------------|
| `setEntity(EntityLivingBase)` | `GuiModelRender` | Establece la entidad a renderizar (limpia itemStack) |
| `setItemStack(ItemStack)` | `GuiModelRender` | Establece el objeto a renderizar (limpia entity) |
| `setScale(float)` | `GuiModelRender` | Establece la escala de renderizado (predeterminada: 30) |
| `setRotation(float, float, float)` | `GuiModelRender` | Establece yaw, pitch, roll |
| `setTranslation(float, float, float)` | `GuiModelRender` | Establece el desplazamiento x, y, z |
| `setEnableEntityAnimations(boolean)` | `GuiModelRender` | Habilita/deshabilita animaciones de entidad |
| `setAllowDragRotation(boolean)` | `GuiModelRender` | Habilita rotación por arrastre |
| `setLookAtCursor(boolean)` | `GuiModelRender` | Habilita rotación siguiendo el cursor |

### Detalles de Renderizado

- Usa `RenderManager.renderEntity()` para entidades
- Usa `RenderItem.renderItemIntoGUI()` para objetos
- Guarda y restaura correctamente el estado de rotación de la entidad para prevenir efectos secundarios
- Aplica iluminación estándar de objetos mediante `RenderHelper.enableStandardItemLighting()`
- La sombra se deshabilita durante el renderizado (`setRenderShadow(false)`)

---

## GuiDropdown

Un componente genérico de desplegable/selección. Abre una lista emergente de opciones debajo del botón al hacer clic.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiDropdown`

### Constructor

```java
new GuiDropdown<T>(int x, int y, int width, int height, State<T> state, List<T> options)
```

### Uso Básico

```java
import com.x4yi.x4ui.client.gui.component.GuiDropdown;
import com.x4yi.x4ui.common.State;
import java.util.Arrays;

State<String> selected = new State<>("Option 1");

GuiDropdown<String> dropdown = new GuiDropdown<>(
    10, 10, 150, 20,
    selected,
    Arrays.asList("Option 1", "Option 2", "Option 3")
);

rootPanel.addChild(dropdown);

// Escuchar cambios de selección
selected.addListener(value -> System.out.println("Selected: " + value));
```

### Desplegable de Enum

```java
import com.x4yi.x4ui.client.gui.component.GuiDropdown;
import com.x4yi.x4ui.common.State;

enum Difficulty { EASY, NORMAL, HARD }

State<Difficulty> difficulty = new State<>(Difficulty.NORMAL);

GuiDropdown<Difficulty> diffDropdown = new GuiDropdown<>(
    10, 40, 150, 20,
    difficulty,
    Arrays.asList(Difficulty.values())
);

rootPanel.addChild(diffDropdown);
```

### Actualizar Opciones

```java
dropdown.setOptions(Arrays.asList("New A", "New B", "New C", "New D"));
```

### Comportamiento

- Hacer clic en el botón alterna la apertura/cierre de la ventana emergente
- Hacer clic en una opción la selecciona y cierra la ventana emergente
- Hacer clic fuera de la ventana emergente la cierra
- La ventana emergente deshabilita temporalmente OpenGL scissor para renderizar fuera de los límites del padre
- Máximo 5 elementos visibles en la ventana emergente (el desplazamiento no está soportado en la ventana emergente)
- La ventana emergente se renderiza en `layer = 100` por defecto (encima de la mayoría de los componentes)

### Renderizado

- Botón: Fondo oscuro (`0xFF16161E`) con borde (`0xFF2C2C36`)
- Valor actual: Dibujado a la izquierda del botón
- Flecha: Carácter de flecha Unicode a la derecha ("▼" cuando está cerrado, "▲" cuando está abierto)
- Ventana emergente: Mismo estilo que el botón, con resaltado de hover (`0xFF2C2C36`)
- Color de texto: `0xFFFFFFFF`

### Propiedades

| Método | Tipo | Descripción |
|--------|------|-------------|
| `setOptions(List<T>)` | `void` | Reemplaza la lista de opciones |
| `state` | `State<T>` | El estado enlazado (campo público) |

---

## Sistema de Tooltips

Los tooltips se renderizan mediante el tema y soportan tanto tooltips de texto como de componentes personalizados.

### Tooltips de Texto

Cualquier componente puede mostrar un tooltip de texto al pasar el cursor:

```java
button.setTooltip("Click to save");
```

Los tooltips de múltiples líneas usan `\n`:

```java
button.setTooltip("Line 1\nLine 2\nLine 3");
```

### Tooltips de Componentes Personalizados

Para tooltips enriquecidos con formato, iconos o elementos interactivos:

```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiImage;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

GuiPanel tooltip = new GuiPanel(0, 0, 180, 60);
tooltip.setFlexDirection(FlexDirection.VERTICAL);

tooltip.addChild(new GuiLabel(0, 0, "Diamond Sword", 0xFF00E5FF));
tooltip.addChild(new GuiLabel(0, 0, "Damage: 7", 0xFFAAAAAA));
tooltip.addChild(new GuiLabel(0, 0, "Durability: 1561", 0xFFAAAAAA));

button.setTooltipComponent(tooltip);
```

### Resolución de Tooltips

Los tooltips se resuelven subiendo por la cadena de padres. Si un hijo no tiene un tooltip, se usa el tooltip del padre:

```java
GuiPanel panel = new GuiPanel(0, 0, 200, 200);
panel.setTooltip("Panel tooltip");

GuiButton btn = new GuiButton(0, 0, 100, 20, "Button", null);
// btn no tiene tooltip, por lo que se muestra el tooltip del panel al pasar el cursor sobre btn
panel.addChild(btn);
```

### Integración con el Tema

Los tooltips se renderizan mediante `ITheme.drawTooltip()` e `ITheme.drawTooltipComponent()`. La implementación `DefaultTheme`:

- Dibuja un fondo oscuro con borde
- Posiciona el tooltip cerca del cursor
- Limita a los bordes de la pantalla para prevenir renderizado fuera de pantalla
- Almacena en caché y reutiliza un panel `GuiTooltip` para tooltips de texto
[/ES]

[EN]
# Advanced Components

This document covers the advanced components: `GuiMarkdown`, `GuiModelRender`, `GuiDropdown`, and the tooltip system.

---

## GuiMarkdown

A lightweight markdown parser and renderer for in-game documentation. Parses raw markdown text into a tree of renderable nodes.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiMarkdown`

### Constructor

```java
new GuiMarkdown(int x, int y, int width, String text)
```

The height is automatically calculated based on the parsed content.

### Basic Usage

```java
import com.x4yi.x4ui.client.gui.component.GuiMarkdown;

String markdown = "# Title\n\nSome **bold** and _italic_ text.\n\n- Item 1\n- Item 2\n\n> This is a blockquote";

GuiMarkdown display = new GuiMarkdown(10, 10, 300, markdown);
rootPanel.addChild(display);
```

### In a Scroll Panel

```java
import com.x4yi.x4ui.client.gui.component.GuiScrollPanel;

GuiScrollPanel scroll = new GuiScrollPanel(10, 10, 350, 250);
GuiMarkdown text = new GuiMarkdown(0, 0, 330, loadMarkdownFile());
scroll.addChild(text);
rootPanel.addChild(scroll);
```

### Updating Content

```java
display.setText("# New Title\n\nUpdated content.");
```

### Supported Syntax

#### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
```

Headings are rendered in bold with distinct colors:
- H1: `0xFF00E5FF` (cyan)
- H2: `0xFF00E676` (green)
- H3: `0xFFFFD600` (yellow)

#### Bold and Italic

```markdown
**bold text**
__also bold__
*italic text*
_and also italic_
```

#### Inline Code

```markdown
`code snippet`
```

Rendered in `0xFFFFAB40` (amber).

#### Links

```markdown
[link text](https://example.com)
```

Links are rendered in `0xFF29B6F6` (light blue) with an underline. Click detection is handled via `onLinkClicked`.

#### Blockquotes

```markdown
> This is a blockquote
```

Rendered with a left bar (`0xFFAAAAAA`) and indented text.

#### Bullet Lists

```markdown
- Item 1
- Item 2
  - Nested item
    - Deeply nested
```

Supports up to 3 levels of nesting with colored bullet markers:
- Level 0: `0xFF00C853` (green)
- Level 1: `0xFF888892` (gray)
- Level 2: `0xFF555560` (dark gray)

#### Separators

```markdown
---
***
___
```

Rendered as a horizontal line in `0xFF444450`.

#### Images

```markdown
![alt text](mymod:textures/gui/image.png)
```

The `alt` text can specify dimensions: `![64x64](mymod:textures/icon.png)`. Default size is 64x64.

### Link Click Handling

```java
import com.x4yi.x4ui.client.gui.component.GuiMarkdown;

GuiMarkdown md = new GuiMarkdown(0, 0, 300, "Click [here](https://example.com) to learn more.");
md.onLinkClicked = url -> {
    System.out.println("Link clicked: " + url);
    // Open URL, navigate, etc.
};
```

### Anchor Navigation

Headings are automatically registered as anchors. The anchor ID is the heading text lowercased with non-alphanumeric characters replaced by hyphens.

```java
// For heading: ## Getting Started
int yPosition = md.getAnchorY("getting-started");
```

### Public Fields

| Field | Type | Description |
|-------|------|-------------|
| `onLinkClicked` | `Consumer<String>` | Callback for link clicks |
| `textColor` | `int` | Default text color (0xFFE0E0E6) |
| `colorH1` | `int` | H1 color (0xFF00E5FF) |
| `colorH2` | `int` | H2 color (0xFF00E676) |
| `colorH3` | `int` | H3 color (0xFFFFD600) |

### Rendering

- Text is word-wrapped at word boundaries
- Each word is measured via `FontWidthCache` for performance
- Links are underlined with a 1px line
- Empty lines add 6px vertical spacing
- Line height is 10px

---

## GuiModelRender

Renders a 3D entity or item stack inside the 2D GUI. Supports drag rotation, cursor-following rotation, and configurable scale/offset.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiModelRender`

### Constructor

```java
new GuiModelRender(int x, int y, int width, int height)
```

### Rendering an Entity

```java
import com.x4yi.x4ui.client.gui.component.GuiModelRender;
import net.minecraft.client.Minecraft;
import net.minecraft.entity.passive.EntitySheep;

GuiModelRender entityRender = new GuiModelRender(50, 50, 100, 100);

EntitySheep sheep = new EntitySheep(Minecraft.getMinecraft().world);
entityRender.setEntity(sheep);
entityRender.setScale(30f);

rootPanel.addChild(entityRender);
```

### Rendering an Item Stack

```java
import com.x4yi.x4ui.client.gui.component.GuiModelRender;
import net.minecraft.init.Items;

GuiModelRender itemRender = new GuiModelRender(200, 50, 64, 64);
itemRender.setItemStack(new ItemStack(Items.DIAMOND_SWORD));
itemRender.setScale(25f);

rootPanel.addChild(itemRender);
```

### Cursor-Following Rotation

The entity rotates to face the mouse cursor:

```java
entityRender.setLookAtCursor(true);
```

### Drag Rotation

The user can click and drag to rotate the entity:

```java
entityRender.setAllowDragRotation(true);
```

### Static Rotation

```java
entityRender.setRotation(0f, 45f, 0f);  // yaw, pitch, roll
```

### Translation Offset

```java
entityRender.setTranslation(0f, -10f, 0f);  // x, y, z offset in pixels
```

### Disabling Entity Animations

```java
entityRender.setEnableEntityAnimations(false);
```

When disabled, the entity's idle animations (breathing, blinking) are frozen.

### Fluent API

```java
import com.x4yi.x4ui.client.gui.utils.GuiBuilder;

GuiModelRender render = GuiBuilder.createModelRender()
    .position(50, 50)
    .size(100, 100)
    .entity(sheep)
    .modelScale(30f)
    .modelRotation(0f, 45f, 0f)
    .modelDragRotation(true)
    .modelLookAtCursor(false)
    .build();
```

### Properties

| Method | Type | Description |
|--------|------|-------------|
| `setEntity(EntityLivingBase)` | `GuiModelRender` | Sets entity to render (clears itemStack) |
| `setItemStack(ItemStack)` | `GuiModelRender` | Sets item to render (clears entity) |
| `setScale(float)` | `GuiModelRender` | Sets render scale (default: 30) |
| `setRotation(float, float, float)` | `GuiModelRender` | Sets yaw, pitch, roll |
| `setTranslation(float, float, float)` | `GuiModelRender` | Sets x, y, z offset |
| `setEnableEntityAnimations(boolean)` | `GuiModelRender` | Enables/disables entity animations |
| `setAllowDragRotation(boolean)` | `GuiModelRender` | Enables drag-to-rotate |
| `setLookAtCursor(boolean)` | `GuiModelRender` | Enables cursor-following rotation |

### Rendering Details

- Uses `RenderManager.renderEntity()` for entities
- Uses `RenderItem.renderItemIntoGUI()` for items
- Properly saves and restores entity rotation state to prevent side effects
- Applies standard item lighting via `RenderHelper.enableStandardItemLighting()`
- Shadow is disabled during render (`setRenderShadow(false)`)

---

## GuiDropdown

A generic dropdown/select component. Opens a popup list of options below the button when clicked.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiDropdown`

### Constructor

```java
new GuiDropdown<T>(int x, int y, int width, int height, State<T> state, List<T> options)
```

### Basic Usage

```java
import com.x4yi.x4ui.client.gui.component.GuiDropdown;
import com.x4yi.x4ui.common.State;
import java.util.Arrays;

State<String> selected = new State<>("Option 1");

GuiDropdown<String> dropdown = new GuiDropdown<>(
    10, 10, 150, 20,
    selected,
    Arrays.asList("Option 1", "Option 2", "Option 3")
);

rootPanel.addChild(dropdown);

// Listen for selection changes
selected.addListener(value -> System.out.println("Selected: " + value));
```

### Enum Dropdown

```java
import com.x4yi.x4ui.client.gui.component.GuiDropdown;
import com.x4yi.x4ui.common.State;

enum Difficulty { EASY, NORMAL, HARD }

State<Difficulty> difficulty = new State<>(Difficulty.NORMAL);

GuiDropdown<Difficulty> diffDropdown = new GuiDropdown<>(
    10, 40, 150, 20,
    difficulty,
    Arrays.asList(Difficulty.values())
);

rootPanel.addChild(diffDropdown);
```

### Updating Options

```java
dropdown.setOptions(Arrays.asList("New A", "New B", "New C", "New D"));
```

### Behavior

- Clicking the button toggles the popup open/closed
- Clicking an option selects it and closes the popup
- Clicking outside the popup closes it
- The popup temporarily disables OpenGL scissor to render outside parent bounds
- Maximum 5 visible items in the popup (scrolling not supported in popup)
- The popup is rendered at `layer = 100` by default (above most components)

### Rendering

- Button: Dark background (`0xFF16161E`) with border (`0xFF2C2C36`)
- Current value: Drawn at the left of the button
- Arrow: Unicode arrow character at the right ("▼" when closed, "▲" when open)
- Popup: Same styling as button, with hover highlight (`0xFF2C2C36`)
- Text color: `0xFFFFFFFF`

### Properties

| Method | Type | Description |
|--------|------|-------------|
| `setOptions(List<T>)` | `void` | Replaces the option list |
| `state` | `State<T>` | The bound state (public field) |

---

## Tooltip System

Tooltips are rendered by the theme and support both text and custom component tooltips.

### Text Tooltips

Any component can display a text tooltip on hover:

```java
button.setTooltip("Click to save");
```

Multi-line tooltips use `\n`:

```java
button.setTooltip("Line 1\nLine 2\nLine 3");
```

### Custom Component Tooltips

For rich tooltips with formatting, icons, or interactive elements:

```java
import com.x4yi.x4ui.client.gui.component.GuiPanel;
import com.x4yi.x4ui.client.gui.component.GuiLabel;
import com.x4yi.x4ui.client.gui.component.GuiImage;
import com.x4yi.x4ui.client.gui.component.layout.FlexDirection;

GuiPanel tooltip = new GuiPanel(0, 0, 180, 60);
tooltip.setFlexDirection(FlexDirection.VERTICAL);

tooltip.addChild(new GuiLabel(0, 0, "Diamond Sword", 0xFF00E5FF));
tooltip.addChild(new GuiLabel(0, 0, "Damage: 7", 0xFFAAAAAA));
tooltip.addChild(new GuiLabel(0, 0, "Durability: 1561", 0xFFAAAAAA));

button.setTooltipComponent(tooltip);
```

### Tooltip Resolution

Tooltips are resolved by walking up the parent chain. If a child does not have a tooltip, the parent's tooltip is used:

```java
GuiPanel panel = new GuiPanel(0, 0, 200, 200);
panel.setTooltip("Panel tooltip");

GuiButton btn = new GuiButton(0, 0, 100, 20, "Button", null);
// btn has no tooltip, so panel's tooltip is displayed when hovering btn
panel.addChild(btn);
```

### Theme Integration

Tooltips are rendered via `ITheme.drawTooltip()` and `ITheme.drawTooltipComponent()`. The `DefaultTheme` implementation:

- Draws a dark background with border
- Positions the tooltip near the cursor
- Clamps to screen edges to prevent off-screen rendering
- Caches and reuses a `GuiTooltip` panel for text tooltips
[/EN]
