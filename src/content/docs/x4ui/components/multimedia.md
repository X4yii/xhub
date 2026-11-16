---
title: "Multimedia"
project: "X4UI"
category: "Components"
categoryOrder: 1
order: 2
---

[ES]
# Componentes Multimedia (`GuiImage`, `GuiVideo`, `GuiAudio`, `GuiSprite`)

Los componentes multimedia encapsulan su carga asíncrona sobre `MediaPipeline` y `MediaManager` dentro de los límites del propio widget, sin bloquear el hilo de renderizado ni emitir notificaciones globales.

---

## 1. `GuiImage` (Recursos Locales, URLs y 9-Slice)

`GuiImage` soporta texturas empaquetadas (`ResourceLocation`), descarga remota asíncrona (`setUrl`) y escalado con bordes protegidos (`NineSliceConfig`):

```java
GuiImage banner = (GuiImage) new GuiImage(0, 0, 0, 150).withPercentWidth(1.0f);
banner.setUrl("https://example.com/banner.png");

// O textura local con 9-slice
banner.setResource(new ResourceLocation("mymod", "textures/gui/panel.png"));
banner.withNineSlice(new NineSliceConfig(4, 4, 4, 4));
banner.setNineSliceEnabled(true);
```

---

## 2. `GuiVideo` (Reproductor Asíncrono y Manejo de Errores)

`GuiVideo` reproduce video y audio de forma asíncrona (usando `ffmpeg` del OS o fallback automático a JCodec), con barra de progreso, controles configurables y estado de error visible:

```java
GuiVideo video = (GuiVideo) new GuiVideo(0, 0, 0, 240).withPercentWidth(1.0f);

video.setVideoUrl("https://example.com/intro.mp4");
video.setVolume(0.5f);
video.setControlsEnabled(true);
video.withOnError(errorMsg -> {
    // Reacción opcional ante fallo de red, validación SSRF o decodificación
});
video.play();
```

- Durante la carga, `GuiVideo` muestra su barra de progreso interna.
- Si ocurre un fallo, libera recursos de forma segura, muestra el diagnóstico en el propio componente (`getVideoError()`) e invoca `withOnError(...)`.

---

## 3. `GuiAudio` y `GuiSprite`

- **`GuiAudio`:** reproducción de audio remoto con control de volumen (`setVolume`) y silencio (`setMuted`).
- **`GuiSprite`:** animación 2D por hoja de sprites (`SpriteSheetSource`) o secuencia (`SequenceSource`) con `withFPS(...)`, `withLoopMode(LoopMode.LOOP)` y `withUVScrollSpeed(...)`.

---

## 4. Qué Evitar en Multimedia

| Antipatrón | Causa Técnica del Problema | Solución Correcta |
| :--- | :--- | :--- |
| Usar URLs locales/privadas o rutas sin validar | Bloqueado por `SecurityUtils` (protección SSRF y *path traversal*) | Usar URLs HTTP/HTTPS públicas o `ResourceLocation` |
| Omitir `withOnError(...)` o respaldo MP4 H.264 | Fallos silenciosos o incompatibilidad en clientes Android | Configurar `withOnError(...)` y proveer `.mp4` (H.264) |
[/ES]

[EN]
# Multimedia Components (`GuiImage`, `GuiVideo`, `GuiAudio`, `GuiSprite`)

Multimedia components encapsulate asynchronous loading on top of `MediaPipeline` and `MediaManager` within their own bounds, keeping the render thread non-blocking and avoiding global toast spam.

---

## 1. `GuiImage` (Local Assets, URLs & 9-Slice)

`GuiImage` supports packaged textures (`ResourceLocation`), asynchronous remote URLs (`setUrl`), and protected 9-slice border scaling (`NineSliceConfig`):

```java
GuiImage banner = (GuiImage) new GuiImage(0, 0, 0, 150).withPercentWidth(1.0f);
banner.setUrl("https://example.com/banner.png");

// Or local asset with 9-slice borders
banner.setResource(new ResourceLocation("mymod", "textures/gui/panel.png"));
banner.withNineSlice(new NineSliceConfig(4, 4, 4, 4));
banner.setNineSliceEnabled(true);
```

---

## 2. `GuiVideo` (Asynchronous Player & Error Handling)

`GuiVideo` plays video and audio asynchronously (using OS-discovered `ffmpeg` or automatic JCodec fallback), featuring an integrated loading bar, optional playback controls, and visible error recovery:

```java
GuiVideo video = (GuiVideo) new GuiVideo(0, 0, 0, 240).withPercentWidth(1.0f);

video.setVideoUrl("https://example.com/intro.mp4");
video.setVolume(0.5f);
video.setControlsEnabled(true);
video.withOnError(errorMsg -> {
    // Optional handler for network, SSRF validation, or codec failures
});
video.play();
```

- While buffering or downloading, `GuiVideo` renders an internal progress bar.
- On failure, it safely disposes resources, displays the diagnostic error state (`getVideoError()`), and invokes `withOnError(...)`.

---

## 3. `GuiAudio` & `GuiSprite`

- **`GuiAudio`:** asynchronous remote audio playback with `setVolume(...)` and `setMuted(...)`.
- **`GuiSprite`:** 2D sprite animation driven by `SpriteSheetSource` or `SequenceSource` with `withFPS(...)`, `withLoopMode(LoopMode.LOOP)`, and `withUVScrollSpeed(...)`.

---

## 4. What to Avoid with Multimedia

| Anti-Pattern | Technical Root Cause | Correct Approach |
| :--- | :--- | :--- |
| Passing local/private network URLs | Rejected by `SecurityUtils` (SSRF and path traversal protection) | Use public HTTP/HTTPS URLs or `ResourceLocation` |
| Omitting `withOnError(...)` or H.264 MP4 fallbacks | Leaves failures unhandled or breaks playback on Android launchers | Register `withOnError(...)` and provide `.mp4` (H.264) sources |
[/EN]
