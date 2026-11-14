---
title: "Vector Typography & Fonts (IFont)"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 6
---

[ES]
# 06 - Sistema de Tipografía y Fuentes Vectoriales (`IFont`)

X4UI r1.0b5 introduce un sistema completo de tipografía vectorial acelerado por hardware centrado en la interfaz `IFont` (`com.x4yi.x4ui.api.client.font.IFont`) y el registro central `FontRegistry`. Permite renderizar fuentes TrueType/OpenType (`.ttf`/`.otf`) con anti-aliasing continuo, soporte nativo de códigos de formato vanilla (`§0`-`§f`, `§l`, etc.) y recarga dinámica en caliente.

---

## 1. La Abstracción `IFont`

Cualquier componente visual de X4UI puede trabajar indistintamente con fuentes de Minecraft o con fuentes vectoriales personalizadas a través de `IFont`:

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `drawString(text, x, y, color, shadow)` | `float` | Dibuja la cadena de texto y retorna el avance horizontal en X |
| `getStringWidth(text)` | `int` | Calcula el ancho en píxeles ignorando códigos de formato (`§`) |
| `getFontHeight()` | `int` | Retorna la altura de línea de la tipografía |
| `splitText(text, maxWrapWidth)` | `List<String>` | Divide el texto en múltiples líneas respetando saltos de palabra |
| `trimStringToWidth(text, width)` | `String` | Trunca la cadena de texto hasta que quepa en el ancho especificado |

---

## 2. Implementaciones Integradas

### `VanillaFont`
Envuelve el `FontRenderer` nativo de Minecraft, asegurando retrocompatibilidad absoluta con el estilo gráfico tradicional del juego.

### `TrueTypeFont`
Motor de rasterización tipográfica acelerada por hardware:
- Rasteriza glifos bajo demanda en un atlas de texturas dinámico en VRAM.
- Anti-aliasing bicúbico para alta legibilidad en pantallas de alta densidad (HiDPI / 4K).
- Procesa integralmente códigos de color vanilla (`§a`, `§c`, etc.) y estilos de negrita (`§l`), cursiva (`§o`) o subrayado (`§n`).
- Dibuja sombras en una única llamada combinada por lotes con desplazamiento de 1 px.

---

## 3. Registro Central (`FontRegistry`)

El registro `FontRegistry` centraliza la carga, almacenamiento en caché y recarga dinámica de fuentes:

### Registrar una Fuente TrueType desde Recursos del Mod
Coloque su archivo `.ttf` u `.otf` en `src/main/resources/assets/mymod/fonts/`:

```java
// En su ClientProxy (durante FMLPreInitializationEvent)
FontRegistry.registerTrueType(
    "roboto_regular",
    new ResourceLocation("mymod", "fonts/roboto-regular.ttf"),
    14.0f // Tamaño en puntos
);

FontRegistry.registerTrueType(
    "jetbrains_mono",
    new ResourceLocation("mymod", "fonts/jetbrains-mono.ttf"),
    12.0f
);
```

### Registrar una Fuente del Sistema Operativo
```java
FontRegistry.registerSystem("arial", "Arial", Font.PLAIN, 14.0f);
```

### Obtener Fuentes Registradas
```java
IFont roboto = FontRegistry.get("roboto_regular");
IFont mono = FontRegistry.getOrDefault("jetbrains_mono", FontRegistry.getDefault());
```

---

## 4. Asignar Fuentes a Componentes

Puede aplicar fuentes a nivel de componente individual o propagarlas a todo un contenedor mediante el método fluido `withFont()`:

```java
// Asignar tipografía a una etiqueta
GuiLabel title = new GuiLabel(10, 10, "Configuración del Sistema", 0xFFFFFFFF)
    .withFont(FontRegistry.get("roboto_regular"));

// Asignar tipografía a un botón
GuiButton actionBtn = new GuiButton(10, 40, 120, 24, "Aplicar", this::onApply)
    .withFont(FontRegistry.get("roboto_regular"));

// Al asignar una fuente a un GuiPanel, todos los hijos la heredan por defecto
headerPanel.withFont(FontRegistry.get("roboto_regular"));
```

---

## 5. Recarga en Caliente de Recursos (`F3 + T`)

`FontRegistry` está conectado al bus de eventos de Minecraft. Cuando el jugador recarga los paquetes de recursos (`F3 + T`), todas las fuentes registradas mediante `ResourceLocation` se liberan y vuelven a cargar desde los nuevos paquetes de recursos activos de forma transparente.

---

## Qué Evitar Hacer (Antipatrones y Fugas de Memoria en Fuentes)

> [!CAUTION]
> **1. NUNCA instanciar `new TrueTypeFont(...)` en cada tick o dentro de `renderSelf()`.**
> Registre siempre las fuentes una sola vez en `FontRegistry`. Crearlas repetidamente colapsará la memoria gráfica por recarga de texturas.

> [!WARNING]
> **2. NUNCA depender exclusivamente de fuentes del sistema operativo (`registerSystem`).**
> Si la fuente no existe en la PC del jugador, se verá mal. Incluya siempre fuentes `.ttf` en su mod.

> [!WARNING]
> **3. NUNCA registrar tamaños de fuente desproporcionados (ej. mayores a 72 pt).**
> Consumirán demasiada VRAM. Para títulos gigantes, registre una fuente normal (ej. 24pt) y use `gfx.scale(2.0f, 2.0f)` al dibujar.

> [!IMPORTANT]
> **4. NUNCA omitir el método `dispose()` si gestiona fuentes manualmente.**
> Si crea fuentes fuera de `FontRegistry`, invoque `font.dispose()` cuando ya no las use.
[/ES]

[EN]
# 06 - Vector Typography & Fonts (`IFont`)

X4UI r1.0b5 features a hardware-accelerated vector typography engine centered on the `IFont` interface (`com.x4yi.x4ui.api.client.font.IFont`) and the centralized `FontRegistry`. It enables crisp TrueType/OpenType (`.ttf`/`.otf`) text rendering with continuous anti-aliasing, native support for vanilla formatting codes (`§0`-`§f`, `§l`, etc.), and dynamic hot-reloading.

---

## 1. The `IFont` Abstraction

Visual components in X4UI seamlessly interact with either vanilla bitmap fonts or custom vector typefaces via `IFont`:

| Method | Return | Description |
|--------|--------|-------------|
| `drawString(text, x, y, color, shadow)` | `float` | Renders text string and returns horizontal advance in X |
| `getStringWidth(text)` | `int` | Computes pixel width while stripping formatting codes (`§`) |
| `getFontHeight()` | `int` | Returns font line height |
| `splitText(text, maxWrapWidth)` | `List<String>` | Wraps string into lines based on word boundaries |
| `trimStringToWidth(text, width)` | `String` | Truncates text string to fit target pixel width |

---

## 2. Built-in Implementations

### `VanillaFont`
Wraps Minecraft's native `FontRenderer`, ensuring exact visual fidelity and pixel-perfect backward compatibility with vanilla text rendering.

### `TrueTypeFont`
Hardware-accelerated dynamic vector font engine:
- On-demand glyph rasterization into dynamic OpenGL texture atlases in VRAM.
- Bicubic anti-aliasing for superior legibility on HiDPI and 4K displays.
- Full support for vanilla color codes (`§a`, `§c`, etc.) and styles (`§l` bold, `§o` italic, `§n` underline).
- Batched drop-shadow rendering in a single draw pass with 1 px offset.

---

## 3. Central Registry (`FontRegistry`)

`FontRegistry` centralizes loading, caching, and hot-reloading:

### Registering TrueType Fonts from Mod Assets
Place your `.ttf` or `.otf` files under `src/main/resources/assets/mymod/fonts/`:

```java
// Inside your ClientProxy (during FMLPreInitializationEvent)
FontRegistry.registerTrueType(
    "roboto_regular",
    new ResourceLocation("mymod", "fonts/roboto-regular.ttf"),
    14.0f // Point size
);

FontRegistry.registerTrueType(
    "jetbrains_mono",
    new ResourceLocation("mymod", "fonts/jetbrains-mono.ttf"),
    12.0f
);
```

### Registering Operating System Fonts
```java
FontRegistry.registerSystem("arial", "Arial", Font.PLAIN, 14.0f);
```

### Querying Registered Fonts
```java
IFont roboto = FontRegistry.get("roboto_regular");
IFont mono = FontRegistry.getOrDefault("jetbrains_mono", FontRegistry.getDefault());
```

---

## 4. Applying Fonts to Components

Fonts can be assigned to individual components or propagated down entire container subtrees using the fluent `withFont()` builder:

```java
// Assign font to a label
GuiLabel title = new GuiLabel(10, 10, "System Settings", 0xFFFFFFFF)
    .withFont(FontRegistry.get("roboto_regular"));

// Assign font to a button
GuiButton actionBtn = new GuiButton(10, 40, 120, 24, "Apply", this::onApply)
    .withFont(FontRegistry.get("roboto_regular"));

// Setting a font on a parent container propagates to all children by default
headerPanel.withFont(FontRegistry.get("roboto_regular"));
```

---

## 5. Resource Pack Hot-Reloading (`F3 + T`)

`FontRegistry` subscribes to Minecraft's resource reload bus. When players press `F3 + T` to reload resource packs, all fonts registered via `ResourceLocation` automatically dispose their GPU texture atlases and reload from the newly active resource packs.

---

## What to Avoid (Font Pitfalls & Memory Leaks)

> [!CAUTION]
> **1. NEVER instantiate `new TrueTypeFont(...)` per tick or inside `renderSelf()`.**
> Always register fonts once in `FontRegistry`. Re-creating fonts continuously will exhaust GPU memory and crash the client.

> [!WARNING]
> **2. NEVER depend solely on OS system fonts (`registerSystem`).**
> If a font is absent on a player's machine, the UI spacing will break. Always bundle `.ttf` files in your mod.

> [!WARNING]
> **3. NEVER register excessively large font sizes (e.g., above 72 pt).**
> Huge sizes consume significant VRAM. For massive headings, prefer a 24 pt font scaled via `gfx.scale(2.0f, 2.0f)`.

> [!IMPORTANT]
> **4. NEVER forget to invoke `dispose()` on unmanaged fonts.**
> If you manually instantiate a font outside `FontRegistry`, call `font.dispose()` when it's no longer used.
[/EN]
