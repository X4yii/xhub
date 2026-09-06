---
title: "Multimedia"
project: "X4UI"
category: "Components"
categoryOrder: 4
---

[ES]
# Componentes Multimedia

Este documento cubre los componentes de medios de X4UI: `GuiImage` (texturas, URLs y 9-slice), `GuiSprite` (motor de animación 2D), `GuiVideo` (reproducción de video) y `GuiAudio` (audio streaming).

---

## GuiImage (Texturas, URLs y 9-Slice)

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiImage`

### 1. Recurso Local y URL Remota
```java
import com.x4yi.x4ui.client.gui.component.GuiImage;
import net.minecraft.util.ResourceLocation;

// Textura local del mod
GuiImage icon = new GuiImage(10, 10, 64, 64, new ResourceLocation("mymod", "textures/icon.png"));

// Imagen remota por URL
GuiImage webBanner = new GuiImage(10, 80, 200, 100, "https://example.com/banner.png");
```

### 2. Soporte 9-Slice (Nine-Patch) en `GuiImage`
En X4UI r1.0b5, el escalado 9-slice se configura directamente en `GuiImage` mediante `NineSliceConfig`:

```java
import com.x4yi.x4ui.client.gui.component.image.NineSliceConfig;
import com.x4yi.x4ui.client.gui.utils.Insets;

GuiImage frame = new GuiImage(10, 10, 300, 200, new ResourceLocation("mymod", "textures/frame.png"))
    .withNineSlice(new NineSliceConfig(new Insets(8), 64, 64)); // Margen de corte 8 px en textura de 64x64

rootPanel.addChild(frame);
```

---

## GuiSprite (Motor de Animación 2D)

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiSprite`

### Fuentes de Animación (`ISpriteSource`)

#### 1. Sprite Sheet (`SpriteSheetSource`)
Divide una textura compuesta en fotogramas de cuadrícula:

```java
import com.x4yi.x4ui.client.gui.component.GuiSprite;
import com.x4yi.x4ui.client.gui.component.sprite.SpriteSheetSource;
import com.x4yi.x4ui.client.gui.component.sprite.LoopMode;

// Textura de 256x256 dividida en fotogramas de 64x64 (total 16 fotogramas)
SpriteSheetSource sheet = new SpriteSheetSource(
    new ResourceLocation("mymod", "textures/orb_sheet.png"),
    64, 64, 16
);

GuiSprite animatedOrb = new GuiSprite(10, 10, 64, 64, sheet);
animatedOrb.setFps(24.0f);
animatedOrb.setLoopMode(LoopMode.LOOP); // LOOP, ONCE, PING_PONG
rootPanel.addChild(animatedOrb);
```

#### 2. Secuencia de Texturas (`SequenceSource`)
Para animaciones compuestas por múltiples archivos de imagen independientes:

```java
import com.x4yi.x4ui.client.gui.component.sprite.SequenceSource;

List<ResourceLocation> frames = Arrays.asList(
    new ResourceLocation("mymod", "textures/anim/frame_0.png"),
    new ResourceLocation("mymod", "textures/anim/frame_1.png"),
    new ResourceLocation("mymod", "textures/anim/frame_2.png")
);

GuiSprite sequence = new GuiSprite(10, 80, 64, 64, new SequenceSource(frames));
```

### Controles de Línea de Tiempo y Efectos
```java
animatedOrb.play();
animatedOrb.pause();
animatedOrb.stop();

// Efectos de espejo y scroll continuo
animatedOrb.setFlipX(true); // Invertir horizontalmente
animatedOrb.setUvScrollSpeed(0.1f, 0.0f); // Desplazamiento continuo de textura
```

---

## GuiVideo

**Paquete:** `com.x4yi.x4ui.client.gui.component.GuiVideo`

```java
import com.x4yi.x4ui.client.gui.component.GuiVideo;

GuiVideo video = new GuiVideo(10, 10, 320, 180);
video.setVideoUrl("https://example.com/trailer.mp4");
video.play();
rootPanel.addChild(video);
```

---

## GuiAudio

```java
import com.x4yi.x4ui.client.gui.component.GuiAudio;

GuiAudio audio = new GuiAudio("https://example.com/soundtrack.ogg");
audio.play();
```

---

## Qué Evitar Hacer (Antipatrones Multimedia)

> [!CAUTION]
> **1. NUNCA usar el constructor obsoleto de `GuiSprite` para 9-slice.**
> El soporte de 9-slice fue trasladado a `GuiImage.withNineSlice()`. El constructor de `GuiSprite` para 9-slice está marcado como `@Deprecated` y se mantendrá únicamente por retrocompatibilidad.

> [!WARNING]
> **2. NUNCA olvidar detener la reproducción de `GuiVideo` o `GuiAudio` al cerrar la pantalla.**
> En el método `onGuiClosed()` de su pantalla, invoque siempre `video.stop()` para liberar los subprocesos de decodificación y los búferes OpenAL.

> [!WARNING]
> **3. NUNCA cargar sprite sheets gigantescas que excedan 2048x2048 px sin verificar la GPU.**
> En tarjetas gráficas antiguas o controladores limitados, texturas mayores a 2048 o 4096 px pueden provocar colapsos en OpenGL.
[/ES]

[EN]
# Multimedia Components

This document details media display widgets in X4UI: `GuiImage` (static textures, remote URLs, and 9-slice borders), `GuiSprite` (2D animated sprite engine), `GuiVideo` (video playback), and `GuiAudio` (audio streaming).

---

## GuiImage (Textures, URLs & 9-Slice)

Displays static mod textures, remote web images, or expandable nine-patch (9-slice) frames.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiImage`

### 1. Local Resource & Remote URL
```java
import com.x4yi.x4ui.client.gui.component.GuiImage;
import net.minecraft.util.ResourceLocation;

// Local mod texture
GuiImage icon = new GuiImage(10, 10, 64, 64, new ResourceLocation("mymod", "textures/icon.png"));

// Remote URL
GuiImage webBanner = new GuiImage(10, 80, 200, 100, "https://example.com/banner.png");
```

### 2. 9-Slice (Nine-Patch) Support in `GuiImage`
In X4UI r1.0b5, 9-slice border scaling is natively integrated into `GuiImage` via `NineSliceConfig`:

```java
import com.x4yi.x4ui.client.gui.component.image.NineSliceConfig;
import com.x4yi.x4ui.client.gui.utils.Insets;

GuiImage frame = new GuiImage(10, 10, 300, 200, new ResourceLocation("mymod", "textures/frame.png"))
    .withNineSlice(new NineSliceConfig(new Insets(8), 64, 64)); // 8 px border slice on a 64x64 texture

rootPanel.addChild(frame);
```
Corners maintain their native proportions, edges stretch unidirectionally, and the center fills smoothly.

---

## GuiSprite (2D Animation Engine)

In X4UI r1.0b5, `GuiSprite` is architected as a real-time 2D animated sprite engine for UI graphics.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiSprite`

### Animation Sources (`ISpriteSource`)

#### 1. Sprite Sheet (`SpriteSheetSource`)
Subdivides a combined texture grid into sequential animation frames:

```java
import com.x4yi.x4ui.client.gui.component.GuiSprite;
import com.x4yi.x4ui.client.gui.component.sprite.SpriteSheetSource;
import com.x4yi.x4ui.client.gui.component.sprite.LoopMode;

// 256x256 texture split into 64x64 frames (16 total frames)
SpriteSheetSource sheet = new SpriteSheetSource(
    new ResourceLocation("mymod", "textures/orb_sheet.png"),
    64, 64, 16
);

GuiSprite animatedOrb = new GuiSprite(10, 10, 64, 64, sheet);
animatedOrb.setFps(24.0f);
animatedOrb.setLoopMode(LoopMode.LOOP); // LOOP, ONCE, PING_PONG
rootPanel.addChild(animatedOrb);
```

#### 2. Texture Sequence (`SequenceSource`)
Animates across multiple independent resource files:

```java
import com.x4yi.x4ui.client.gui.component.sprite.SequenceSource;

List<ResourceLocation> frames = Arrays.asList(
    new ResourceLocation("mymod", "textures/anim/frame_0.png"),
    new ResourceLocation("mymod", "textures/anim/frame_1.png"),
    new ResourceLocation("mymod", "textures/anim/frame_2.png")
);

GuiSprite sequence = new GuiSprite(10, 80, 64, 64, new SequenceSource(frames));
```

### Timeline Controls & Visual Effects
```java
animatedOrb.play();
animatedOrb.pause();
animatedOrb.stop();

// Mirroring and UV scrolling
animatedOrb.setFlipX(true); // Horizontal flip
animatedOrb.setUvScrollSpeed(0.1f, 0.0f); // Continuous scrolling
```

---

## GuiVideo

Embeds video playback into user interfaces.

**Package:** `com.x4yi.x4ui.client.gui.component.GuiVideo`

```java
import com.x4yi.x4ui.client.gui.component.GuiVideo;

GuiVideo video = new GuiVideo(10, 10, 320, 180);
video.setVideoUrl("https://example.com/trailer.mp4");
video.play();
rootPanel.addChild(video);
```

---

## GuiAudio

Provides synchronized audio streaming through OpenAL (`OpenALAudioSink`):

```java
import com.x4yi.x4ui.client.gui.component.GuiAudio;

GuiAudio audio = new GuiAudio("https://example.com/soundtrack.ogg");
audio.play();
```

---

## What to Avoid (Multimedia Anti-Patterns)

> [!CAUTION]
> **1. NEVER use legacy `GuiSprite` constructors for 9-slice borders.**
> 9-slice border functionality has moved to `GuiImage.withNineSlice()`. The legacy `GuiSprite` constructor is `@Deprecated` and preserved solely for backwards compatibility.

> [!WARNING]
> **2. NEVER forget to stop `GuiVideo` or `GuiAudio` on screen close.**
> In your screen's `onGuiClosed()` method, invoke `video.stop()` to gracefully terminate background processes and release native memory.

> [!WARNING]
> **3. NEVER load oversized sprite sheets exceeding GPU limits (e.g. above 2048x2048).**
> Older graphics hardware or restricted drivers may crash when attempting to bind textures exceeding hardware limits.
[/EN]
