---
title: "Multimedia"
project: "X4UI"
category: "Components"
categoryOrder: 1
order: 2
---

[ES]
# Componentes Multimedia (`GuiImage` y `GuiVideo`)

Los componentes multimedia de X4UI gestionan su carga asíncrona internamente dentro de sus propios límites, sin bloquear el hilo de renderizado.

---

## `GuiImage` (Imágenes Estáticas, Web y 9-Slice)

`GuiImage` soporta tanto texturas empaquetadas (`ResourceLocation`) como imágenes remotas descargadas asíncronamente mediante `setUrl(String)`:

```java
GuiImage banner = (GuiImage) new GuiImage(0, 0, 0, 150).withPercentWidth(1.0f);
banner.setUrl("https://ejemplo.com/fondo.png");

// O con ResourceLocation local y bordes 9-slice protegidos
banner.setResource(new ResourceLocation("mimod", "textures/gui/panel.png"));
banner.withNineSlice(new NineSliceConfig(4, 4, 4, 4));
banner.setNineSliceEnabled(true);
```

---

## `GuiVideo` (Reproductor Asíncrono)

`GuiVideo` reproduce video y audio de forma asíncrona sobre `MediaPipeline` (usando `ffmpeg` del sistema operativo o fallback a JCodec), con barra de estado, controles opcionales y manejo de errores integrado:

```java
GuiVideo introVideo = (GuiVideo) new GuiVideo(0, 0, 0, 240).withPercentWidth(1.0f);

introVideo.setVideoUrl("https://ejemplo.com/mi_intro.mp4");
introVideo.setVolume(0.5f);
introVideo.setControlsEnabled(true);
introVideo.withOnError(err -> {
    // Opcional: reaccionar si falla la descarga o decodificación
    System.err.println("Error de video: " + err);
});
introVideo.play();
```

### Estado de Carga y Errores
- Durante la descarga o preparación, `GuiVideo` muestra su barra de progreso interna dentro del componente.
- Si ocurre un fallo de red o de códec, `GuiVideo` libera sus recursos de forma segura, muestra el mensaje de error en pantalla (`getVideoError()`) e invoca el callback `withOnError(...)` si fue configurado.
[/ES]

[EN]
# Multimedia Components (`GuiImage` & `GuiVideo`)

X4UI's multimedia components manage asynchronous loading locally within their own bounds without blocking the render thread.

---

## `GuiImage` (Static, Remote & 9-Slice Images)

`GuiImage` supports both packaged textures (`ResourceLocation`) and asynchronously downloaded remote images via `setUrl(String)`:

```java
GuiImage banner = (GuiImage) new GuiImage(0, 0, 0, 150).withPercentWidth(1.0f);
banner.setUrl("https://example.com/banner.png");

// Or with a local ResourceLocation and 9-slice border scaling
banner.setResource(new ResourceLocation("mymod", "textures/gui/panel.png"));
banner.withNineSlice(new NineSliceConfig(4, 4, 4, 4));
banner.setNineSliceEnabled(true);
```

---

## `GuiVideo` (Asynchronous Video Player)

`GuiVideo` plays video and audio asynchronously on top of `MediaPipeline` (using OS-discovered `ffmpeg` or JCodec fallback), with built-in status display, optional controls, and error handling:

```java
GuiVideo introVideo = (GuiVideo) new GuiVideo(0, 0, 0, 240).withPercentWidth(1.0f);

introVideo.setVideoUrl("https://example.com/my_intro.mp4");
introVideo.setVolume(0.5f);
introVideo.setControlsEnabled(true);
introVideo.withOnError(err -> {
    // Optional: react when download or decoding fails
    System.err.println("Video error: " + err);
});
introVideo.play();
```

### Loading & Error Handling
- While downloading or preparing media, `GuiVideo` renders an internal progress bar inside its bounds.
- On network or codec failure, `GuiVideo` safely cleans up its resources, renders the diagnostic error state (`getVideoError()`), and invokes the `withOnError(...)` callback if registered.
[/EN]
