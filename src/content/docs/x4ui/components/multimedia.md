---
title: "Multimedia"
project: "X4UI"
category: "Components"
categoryOrder: 4
---

[ES]
# Multimedia

Este documento cubre los componentes de visualización de medios: `GuiImage`, `GuiSprite`, `GuiVideo` y `GuiAudio`.

Para cargar medios desde URLs remotas, consulta `remote-assets.md`.

---

## GuiImage

Renderiza una imagen estática desde un `ResourceLocation` o URL. Soporta transparencia alpha y tinción de color.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiImage`

### Constructor

```java
new GuiImage(int x, int y, int width, int height)
```

### Recurso Local

```java
import com.x4yi.x4ui.client.gui.component.GuiImage;
import net.minecraft.util.ResourceLocation;

GuiImage logo = new GuiImage(10, 10, 200, 100);
logo.setResource(new ResourceLocation("mymod", "textures/gui/logo.png"));

rootPanel.addChild(logo);
```

### URL Remota

```java
GuiImage avatar = new GuiImage(10, 120, 64, 64);
avatar.setUrl("https://example.com/avatar.png");
```

La imagen se descarga de forma asíncrona mediante `ThreadDownloadImageData` de Minecraft y se almacena en caché en `.minecraft/x4ui_cache/`. Se dibuja un rectángulo de placeholder hasta que la imagen se carga.

### Alpha y Tinción de Color

```java
GuiImage faded = new GuiImage(10, 200, 150, 50);
faded.setResource(new ResourceLocation("mymod", "textures/gui/banner.png"));
faded.setAlpha(0.5f);
faded.setColor(1.0f, 0.5f, 0.0f);
```

### Mapeo UV (Región de Textura)

Mostrar solo una porción de una textura:

```java
GuiImage icon = new GuiImage(10, 260, 16, 16);
icon.setResource(new ResourceLocation("mymod", "textures/gui/icons.png"));
icon.setUV(0.0f, 0.0f, 0.25f, 0.25f);
```

### API Fluent

Todos los setters devuelven `this` para encadenamiento:

```java
GuiImage image = new GuiImage(0, 0, 100, 50)
    .setResource(new ResourceLocation("mymod", "tex.png"))
    .setAlpha(0.8f)
    .setColor(1.0f, 1.0f, 1.0f)
    .setUV(0, 0, 1, 1);
```

### Propiedades

| Método | Tipo | Descripción |
|--------|------|-------------|
| `setResource(ResourceLocation)` | `GuiImage` | Establece la textura local |
| `setUrl(String)` | `GuiImage` | Carga imagen remota desde URL |
| `setAlpha(float)` | `GuiImage` | Establece la transparencia alpha (0-1) |
| `setColor(float, float, float)` | `GuiImage` | Establece la tinción de color RGB |
| `setUV(float, float, float, float)` | `GuiImage` | Establece la región de textura (u1, v1, u2, v2) |

---

## GuiSprite

Renderiza una textura usando la técnica de 9-slice (9-parche). Las esquinas mantienen su relación de aspecto, los bordes se estiran en una dirección y el centro se estira uniformemente.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiSprite`

### Constructor

```java
new GuiSprite(int x, int y, int width, int height, ResourceLocation texture, int textureWidth, int textureHeight)
```

- `textureWidth` y `textureHeight` son las dimensiones originales en píxeles del archivo de textura.

### Uso Básico

```java
import com.x4yi.x4ui.client.gui.component.GuiSprite;
import net.minecraft.util.ResourceLocation;

GuiSprite frame = new GuiSprite(0, 0, 300, 200,
    new ResourceLocation("mymod", "textures/gui/frame.png"),
    64, 64
);
frame.setSliceSize(8);

rootPanel.addChild(frame);
```

### Tamaño del Slice

El `sliceSize` define el ancho del borde en píxeles. Las 9 regiones son:

```
+---+-------------------+---+
| 1 |         2         | 3 |   <- fila superior
+---+-------------------+---+
|   |                   |   |
| 4 |         5         | 6 |   <- fila media (estirada)
|   |                   |   |
+---+-------------------+---+
| 7 |         8         | 9 |   <- fila inferior
+---+-------------------+---+
```

- Esquinas (1, 3, 7, 9): Dibujadas en tamaño original
- Bordes (2, 4, 6, 8): Estirados en una dirección
- Centro (5): Estirado en ambas direcciones

```java
frame.setSliceSize(12);
```

### Renderizado

- Usa `Tessellator` y `BufferBuilder` con formato de vértice `POSITION_TEX`
- Dibuja 9 quads usando `GL_QUADS` (modo begin 7)
- Retrocede a un quad simple estirado si `sliceSize * 2` excede las dimensiones del componente

### Utilidad Estática

`GuiSprite.drawTexturedRect()` es un método público estático para dibujar quads con textura:

```java
GuiSprite.drawTexturedRect(x, y, width, height, u1, v1, u2, v2);
```

Esto se usa internamente por `GuiImage` para el renderizado.

---

## GuiVideo

Reproduce video MP4 con selección automática del decodificador. Usa FFmpeg por defecto, recurriendo a JCodec (puro Java) cuando FFmpeg no está disponible.

> **Nota:** Este componente se encuentra en una fase muy temprana de desarrollo. Su API puede cambiar sin previo aviso en futuras versiones.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiVideo`

### Constructor

```java
new GuiVideo(int x, int y, int width, int height)
```

Extiende `GuiImage`. Hereda todos los métodos de imagen más métodos específicos de video.

### Uso Básico

```java
import com.x4yi.x4ui.client.gui.component.GuiVideo;

GuiVideo video = new GuiVideo(0, 0, 640, 480);
video.setVideoUrl("https://example.com/intro.mp4");
video.play();

rootPanel.addChild(video);
```

### Archivo Local

```java
GuiVideo localVideo = new GuiVideo(0, 0, 320, 240);
localVideo.setVideoUrl("C:/path/to/video.mp4");
localVideo.play();
```

### Controles de Reproducción

```java
video.play();     // Iniciar o reanudar reproducción
video.pause();    // Pausar reproducción
video.stop();     // Detener y liberar recursos
```

### Clic para Alternar

Hacer clic en el componente de video alterna reproducción/pausa (implementado mediante `onMouseClick`).

### Limpieza al Cerrar Pantalla

Los decodificadores de video se ejecutan en hilos de fondo. Siempre llama a `stop()` al cerrar la pantalla:

```java
@Override
public void onGuiClosed() {
    super.onGuiClosed();
    video.stop();
}
```

### Alpha y Color

```java
video.setAlpha(0.8f);
video.setColor(1.0f, 1.0f, 1.0f);
```

### Selección del Decodificador

La selección e instanciación del decodificador se delega automáticamente al servicio central de medios (`X4UI.getMediaService()`).

1. **DirectMemoryVideoDecoder** (principal, Zero-Copy): Decodificador nativo que ejecuta un subproceso de FFmpeg y canaliza frames crudos BGRA directamente a un buffer de memoria mapeada (`DirectByteBuffer`). Evita la memoria Heap de Java, logrando `0 MB` de huella extra y cero lags por recolección de basura, soportando hasta 1280x720 nativo.
2. **JCodecVideoDecoder** (respaldo): Decodificador H.264 puro Java usando JCodec. Demuxing MP4, decodificación de NALs H.264, conversión YUV420 a ARGB. Se activa cuando FFmpeg no está disponible (Android, sistema de archivos no ejecutable, binario faltante).

El respaldo es automático y transparente.

### Renderizado

- Cada frame se obtiene del decodificador basándose en el reloj maestro (`MediaPlayer.getPlaybackTimeSec()`)
- **Optimización de PCIe:** El sistema omite el renderizado si el PTS del vídeo no requiere un nuevo frame.
- **Zero-Copy Upload:** Si se usa FFmpeg, los píxeles en la memoria nativa se suben directamente a la VRAM vía `glTexSubImage2D(..., byteBuffer.asIntBuffer())`.
- Muestra texto "Cargando..." mientras el decodificador se inicializa
- Muestra mensaje de error en rojo si el decodificador falla

### Propiedades

| Método | Tipo | Descripción |
|--------|------|-------------|
| `setVideoUrl(String)` | `GuiVideo` | Establece la URL del video y resetea el estado |
| `play()` | `void` | Inicia la reproducción |
| `pause()` | `void` | Pausa la reproducción |
| `stop()` | `void` | Detiene y libera recursos |
| `setAlpha(float)` | `GuiVideo` | Establece alpha (heredado de GuiImage) |
| `setColor(float, float, float)` | `GuiVideo` | Establece tinción de color (heredado de GuiImage) |

---

## GuiAudio

Componente de reproducción de audio. Actualmente es un stub -- la implementación del decodificador de audio está planificada para una fase futura.

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiAudio`

### Constructor

```java
new GuiAudio(int x, int y, int width, int height)
```

### Estado Actual

`GuiAudio` tiene la API pública definida pero el método interno `initAudio()` está vacío. El componente no producirá salida de audio en la versión actual.

```java
import com.x4yi.x4ui.client.gui.component.GuiAudio;

GuiAudio audio = new GuiAudio(0, 0, 200, 50);
audio.setAudioUrl("https://example.com/music.mp3");
audio.play();
```

### Propiedades

| Método | Tipo | Descripción |
|--------|------|-------------|
| `setAudioUrl(String)` | `GuiAudio` | Establece la URL del audio |
| `play()` | `void` | Inicia la reproducción (sin efecto en la versión actual) |
| `pause()` | `void` | Pausa la reproducción |
| `stop()` | `void` | Detiene la reproducción |

### Renderizado

- Si el decodificador reporta un error, se dibuja un rectángulo oscuro con mensaje de error
- De lo contrario, el componente es invisible (el audio no tiene representación visual)
[/ES]

[EN]
# Multimedia

This document covers the media display components: `GuiImage`, `GuiSprite`, `GuiVideo`, and `GuiAudio`.

For loading media from remote URLs, see `remote-assets.md`.

---

## GuiImage

Renders a static image from a `ResourceLocation` or URL. Supports alpha transparency and color tinting.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiImage`

### Constructor

```java
new GuiImage(int x, int y, int width, int height)
```

### Local Resource

```java
import com.x4yi.x4ui.client.gui.component.GuiImage;
import net.minecraft.util.ResourceLocation;

GuiImage logo = new GuiImage(10, 10, 200, 100);
logo.setResource(new ResourceLocation("mymod", "textures/gui/logo.png"));

rootPanel.addChild(logo);
```

### Remote URL

```java
GuiImage avatar = new GuiImage(10, 120, 64, 64);
avatar.setUrl("https://example.com/avatar.png");
```

The image is downloaded asynchronously via Minecraft's `ThreadDownloadImageData` and cached to `.minecraft/x4ui_cache/`. A placeholder rect is drawn until the image loads.

### Alpha and Color Tint

```java
GuiImage faded = new GuiImage(10, 200, 150, 50);
faded.setResource(new ResourceLocation("mymod", "textures/gui/banner.png"));
faded.setAlpha(0.5f);
faded.setColor(1.0f, 0.5f, 0.0f);
```

### UV Mapping (Texture Region)

Display only a portion of a texture:

```java
GuiImage icon = new GuiImage(10, 260, 16, 16);
icon.setResource(new ResourceLocation("mymod", "textures/gui/icons.png"));
icon.setUV(0.0f, 0.0f, 0.25f, 0.25f);
```

### Fluent API

All setters return `this` for chaining:

```java
GuiImage image = new GuiImage(0, 0, 100, 50)
    .setResource(new ResourceLocation("mymod", "tex.png"))
    .setAlpha(0.8f)
    .setColor(1.0f, 1.0f, 1.0f)
    .setUV(0, 0, 1, 1);
```

### Properties

| Method | Type | Description |
|--------|------|-------------|
| `setResource(ResourceLocation)` | `GuiImage` | Sets local texture |
| `setUrl(String)` | `GuiImage` | Loads remote image from URL |
| `setAlpha(float)` | `GuiImage` | Sets alpha transparency (0-1) |
| `setColor(float, float, float)` | `GuiImage` | Sets RGB color tint |
| `setUV(float, float, float, float)` | `GuiImage` | Sets texture region (u1, v1, u2, v2) |

---

## GuiSprite

Renders a texture using 9-slice (9-patch) technique. Corners maintain their aspect ratio, edges stretch in one direction, and the center stretches uniformly.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiSprite`

### Constructor

```java
new GuiSprite(int x, int y, int width, int height, ResourceLocation texture, int textureWidth, int textureHeight)
```

- `textureWidth` and `textureHeight` are the original pixel dimensions of the texture file.

### Basic Usage

```java
import com.x4yi.x4ui.client.gui.component.GuiSprite;
import net.minecraft.util.ResourceLocation;

GuiSprite frame = new GuiSprite(0, 0, 300, 200,
    new ResourceLocation("mymod", "textures/gui/frame.png"),
    64, 64
);
frame.setSliceSize(8);

rootPanel.addChild(frame);
```

### Slice Size

The `sliceSize` defines the border width in pixels. The 9 regions are:

```
+---+-------------------+---+
| 1 |         2         | 3 |   <- top row
+---+-------------------+---+
|   |                   |   |
| 4 |         5         | 6 |   <- middle row (stretched)
|   |                   |   |
+---+-------------------+---+
| 7 |         8         | 9 |   <- bottom row
+---+-------------------+---+
```

- Corners (1, 3, 7, 9): Drawn at original size
- Edges (2, 4, 6, 8): Stretched in one direction
- Center (5): Stretched in both directions

```java
frame.setSliceSize(12);
```

### Rendering

- Uses `Tessellator` and `BufferBuilder` with `POSITION_TEX` vertex format
- Draws 9 quads using `GL_QUADS` (begin mode 7)
- Falls back to a single stretched quad if `sliceSize * 2` exceeds the component dimensions

### Static Utility

`GuiSprite.drawTexturedRect()` is a public static method for drawing textured quads:

```java
GuiSprite.drawTexturedRect(x, y, width, height, u1, v1, u2, v2);
```

This is used internally by `GuiImage` for rendering.

---

## GuiVideo

Plays MP4 video with automatic decoder selection. Uses FFmpeg by default, falling back to JCodec (pure-Java) when FFmpeg is unavailable.

> **Note:** This component is in a very early stage of development. Its API may change without notice in future versions.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiVideo`

### Constructor

```java
new GuiVideo(int x, int y, int width, int height)
```

Extends `GuiImage`. Inherits all image methods plus video-specific methods.

### Basic Usage

```java
import com.x4yi.x4ui.client.gui.component.GuiVideo;

GuiVideo video = new GuiVideo(0, 0, 640, 480);
video.setVideoUrl("https://example.com/intro.mp4");
video.play();

rootPanel.addChild(video);
```

### Local File

```java
GuiVideo localVideo = new GuiVideo(0, 0, 320, 240);
localVideo.setVideoUrl("C:/path/to/video.mp4");
localVideo.play();
```

### Playback Controls

```java
video.play();     // Start or resume playback
video.pause();    // Pause playback
video.stop();     // Stop and release resources
```

### Click to Toggle

Clicking the video component toggles play/pause (implemented via `onMouseClick`).

### Cleanup on Screen Close

Video decoders run on background threads. Always call `stop()` when closing the screen:

```java
@Override
public void onGuiClosed() {
    super.onGuiClosed();
    video.stop();
}
```

### Alpha and Color

```java
video.setAlpha(0.8f);
video.setColor(1.0f, 1.0f, 1.0f);
```

### Decoder Selection

Decoder selection and instantiation are automatically delegated to the central media service (`X4UI.getMediaService()`).

1. **DirectMemoryVideoDecoder** (primary, Zero-Copy): Native decoder that executes an FFmpeg subprocess and pipes raw BGRA frames directly into a memory-mapped buffer (`DirectByteBuffer`). Bypasses the Java Heap entirely, achieving `0 MB` extra footprint and zero Garbage Collection lag, supporting up to 1280x720 natively.
2. **JCodecVideoDecoder** (fallback): Pure-Java H.264 decoder using JCodec. Handles MP4 demuxing, H.264 NAL decoding, and YUV420 to ARGB conversion. Activates when FFmpeg is unavailable (Android, non-executable filesystem, missing binary).

The fallback is automatic and transparent.

### Rendering

- Each frame is fetched from the decoder based on the master clock (`MediaPlayer.getPlaybackTimeSec()`)
- **PCIe Optimization:** The system skips rendering if the video's PTS does not require a new frame.
- **Zero-Copy Upload:** If FFmpeg is used, the pixels in native memory are uploaded directly to VRAM via `glTexSubImage2D(..., byteBuffer.asIntBuffer())`.
- Displays "Loading..." text while the decoder initializes
- Displays error message in red if the decoder fails

### Properties

| Method | Type | Description |
|--------|------|-------------|
| `setVideoUrl(String)` | `GuiVideo` | Sets the video URL and resets state |
| `play()` | `void` | Starts playback |
| `pause()` | `void` | Pauses playback |
| `stop()` | `void` | Stops and releases resources |
| `setAlpha(float)` | `GuiVideo` | Sets alpha (inherited from GuiImage) |
| `setColor(float, float, float)` | `GuiVideo` | Sets color tint (inherited from GuiImage) |

---

## GuiAudio

Audio playback component. Currently a stub -- the audio decoder implementation is planned for a future phase.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiAudio`

### Constructor

```java
new GuiAudio(int x, int y, int width, int height)
```

### Current Status

`GuiAudio` has the public API defined but the internal `initAudio()` method is empty. The component will not produce audio output in the current version.

```java
import com.x4yi.x4ui.client.gui.component.GuiAudio;

GuiAudio audio = new GuiAudio(0, 0, 200, 50);
audio.setAudioUrl("https://example.com/music.mp3");
audio.play();
```

### Properties

| Method | Type | Description |
|--------|------|-------------|
| `setAudioUrl(String)` | `GuiAudio` | Sets the audio URL |
| `play()` | `void` | Starts playback (no-op in current version) |
| `pause()` | `void` | Pauses playback |
| `stop()` | `void` | Stops playback |

### Rendering

- If the decoder reports an error, a dark rect with an error message is drawn
- Otherwise, the component is invisible (audio has no visual representation)
[/EN]
