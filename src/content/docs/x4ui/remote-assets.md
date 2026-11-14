---
title: "Remote Assets"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 2
---

[ES]
# 02 - Recursos Remotos y Asincronía (`MediaPipeline`)

Este documento describe cómo X4UI descarga, valida y procesa recursos multimedia externos en segundo plano mediante `MediaPipeline` y `MediaManager`, sin bloquear el hilo principal de renderizado.

*(Para usar los widgets listos en pantalla, consulta **Componentes Multimedia** en `components/multimedia.md`.)*

---

## 1. El Paradigma de Asincronía Desacoplada

`MediaPipeline` está completamente aislado de la UI. Retorna promesas en forma de `CompletableFuture`, permitiendo al invocador decidir **cuándo** y **cómo** reaccionar en la interfaz.

---

## 2. Uso de `MediaPipeline`

Cuando necesites descargar o procesar recursos externos en caché aislada por Mod ID (`.minecraft/x4ui/cache/<modid>/`), invoca `MediaPipeline`:

```java
import com.x4yi.x4ui.impl.client.media.MediaPipeline;

CompletableFuture<File> mediaFuture = MediaPipeline.getInstance().obtainMedia(
    "mimodid",
    "https://example.com/video.mp4",
    (status, percent) -> System.out.println("Progreso [" + status + "]: " + percent + "%")
);

mediaFuture.thenAccept(file -> {
    System.out.println("Disponible en: " + file.getAbsolutePath());
}).exceptionally(ex -> {
    ex.printStackTrace();
    return null;
});
```

---

## 3. Descubrimiento de FFmpeg en el OS y Seguridad

- **Búsqueda en el Sistema Operativo (`MediaManager`):** X4UI (`r1.0b6`) detecta automáticamente `ffmpeg` instalado en **Linux, macOS y Windows 10/11** (`PATH` y rutas estándar del sistema) sin descargar binarios dentro de `.minecraft/`. Si `ffmpeg` no está presente, usa automáticamente **JCodec** como respaldo.
- **Validación de URLs y Rutas (`SecurityUtils`):** Las descargas remotas validan protocolo HTTP/HTTPS, bloquean direcciones locales/privadas (protección SSRF) y previenen *path traversal* al escribir en caché.

---

## 4. Formatos Multimedia Soportados

### PC (Windows, Linux, macOS)
- **Video:** MP4, MKV, WebM, AVI, FLV
- **Audio:** MP3, AAC, OGG, WAV, FLAC

### Android (PojavLauncher, FoldCraft)
- **Video:** **SÓLO MP4 con codificación H.264** (*Baseline* o *Main*). Reproducir WebM o MKV en Android causará errores.
- Si tu mod usa `GuiVideo`, incluye una versión `.mp4` (H.264) como respaldo para jugadores móviles.

---

## 5. Qué Evitar Hacer (Antipatrones Críticos)

> [!CAUTION]
> **1. NUNCA bloquear el hilo esperando un `CompletableFuture`.**
> Jamás llames a `future.join()` ni `future.get()` dentro de `update()` o `render()`. Congelarás el cliente entero.

> [!CAUTION]
> **2. NUNCA inyectar Toasts globales desde gestores de fondo.**
> `MediaPipeline` no debe referenciar a `GuiToastManager`. Notifica el resultado dentro del callback de tu *Screen* o deja que `GuiVideo` muestre su estado interno.
[/ES]

[EN]
# 02 - Remote Assets & Asynchrony (`MediaPipeline`)

This document explains how X4UI downloads, validates, and processes external media in the background using `MediaPipeline` and `MediaManager` without blocking the main render thread.

*(For ready-to-use UI widgets, see **Multimedia Components** in `components/multimedia.md`.)*

---

## 1. The Decoupled Asynchrony Paradigm

`MediaPipeline` is completely decoupled from the UI. It returns `CompletableFuture` promises so the caller decides **when** and **how** to update the interface.

---

## 2. Using `MediaPipeline`

To download or process external media in a per-mod sandboxed cache (`.minecraft/x4ui/cache/<modid>/`), invoke `MediaPipeline`:

```java
import com.x4yi.x4ui.impl.client.media.MediaPipeline;

CompletableFuture<File> mediaFuture = MediaPipeline.getInstance().obtainMedia(
    "mymodid",
    "https://example.com/video.mp4",
    (status, percent) -> System.out.println("Progress [" + status + "]: " + percent + "%")
);

mediaFuture.thenAccept(file -> {
    System.out.println("Ready at: " + file.getAbsolutePath());
}).exceptionally(ex -> {
    ex.printStackTrace();
    return null;
});
```

---

## 3. OS-Level FFmpeg Discovery & Security

- **OS Binary Discovery (`MediaManager`):** Starting in `r1.0b6`, X4UI automatically locates `ffmpeg` installed on **Linux, macOS, and Windows 10/11** (`PATH` and standard OS locations) instead of downloading binaries into `.minecraft/`. If `ffmpeg` is unavailable, X4UI falls back to **JCodec** automatically.
- **URL & Path Validation (`SecurityUtils`):** Remote downloads enforce HTTP/HTTPS, block local/private network addresses (SSRF protection), and prevent path traversal when writing cache files.

---

## 4. Supported Media Formats

### PC (Windows, Linux, macOS)
- **Video:** MP4, MKV, WebM, AVI, FLV
- **Audio:** MP3, AAC, OGG, WAV, FLAC

### Android (PojavLauncher, FoldCraft)
- **Video:** **MP4 with H.264 encoding ONLY** (*Baseline* or *Main* profile). Attempting to play WebM or MKV on Android will fail.
- If your mod uses `GuiVideo`, include an `.mp4` (H.264) fallback for mobile players.

---

## 5. What To Avoid (Critical Anti-Patterns)

> [!CAUTION]
> **1. NEVER block the thread waiting for a `CompletableFuture`.**
> Never call `future.join()` or `future.get()` inside `update()` or `render()`. Minecraft will freeze completely.

> [!CAUTION]
> **2. NEVER inject global Toasts from background managers.**
> `MediaPipeline` must never reference `GuiToastManager`. Handle user notifications in your *Screen* callback or rely on `GuiVideo`'s built-in status display.
[/EN]
