---
title: "02 Remote Assets"
project: "X4UI"
category: "General"
categoryOrder: 2
---

[ES]
# 02 - Recursos Remotos (`RemoteResourceManager`)

X4UI incluye un gestor de recursos remotos para descargar y cachear medios desde URLs HTTP/HTTPS. Utiliza canales NIO para transferencias zero-copy en hilos de fondo sin afectar el rendimiento del juego.

## Crear un Namespace

Una instancia de `RemoteResourceManager` está vinculada a un Mod ID específico. Cada mod debe crear su propia instancia para aislar los archivos en caché.

```java
import com.x4yi.x4ui.api.client.resource.RemoteResourceManager;

public class MyClientProxy {
    public static final RemoteResourceManager ASSETS = RemoteResourceManager.create("mymod");
}
```

Los archivos se almacenan en `.minecraft/x4ui/cache/<modid>/` con nombres de archivo hasheados con SHA-256.

## Cargar Medios Remotos

Use `getMedia(url)` para obtener una ruta de archivo local. Si el archivo no está en caché, se descarga de forma asíncrona y se retorna `null` en la primera llamada. Las llamadas subsiguientes retornan la ruta en caché.

```java
String cachedPath = MyClientProxy.ASSETS.getMedia("https://example.com/image.png");

if (cachedPath != null) {
    // El archivo está listo, usarlo
    GuiImage image = new GuiImage(0, 0, 200, 100);
    image.setResource(new ResourceLocation("file://" + cachedPath));
} else {
    // El archivo se está descargando, mostrar un marcador temporal
    GuiLabel loading = new GuiLabel(0, 0, "Loading...", 0xFFAAAAAA);
}
```

## Usar URLs Remotas con GuiImage

`GuiImage` tiene soporte integrado de URLs que maneja la descarga y caché internamente:

```java
import com.x4yi.x4ui.client.gui.component.GuiImage;

GuiImage logo = new GuiImage(10, 10, 200, 100);
logo.setUrl("https://example.com/logo.png");
```

La imagen se descarga de forma asíncrona mediante `ThreadDownloadImageData` de Minecraft y se cachea en `.minecraft/x4ui_cache/`. El método `setUrl()` se puede llamar antes de que el componente se agregue al árbol.

## Usar URLs Remotas con GuiVideo

```java
import com.x4yi.x4ui.client.gui.component.GuiVideo;

GuiVideo video = new GuiVideo(0, 0, 640, 480);
video.setVideoUrl("https://example.com/intro.mp4");
video.play();

// Detener la reproducción al cerrar la pantalla
@Override
public void onGuiClosed() {
    super.onGuiClosed();
    video.stop();
}
```

`GuiVideo` inicializa perezosamente el decodificador en la primera llamada a `play()`. El decodificador es o bien `FFmpegProcessDecoder` (FFmpeg nativo) o `JCodecVideoDecoder` (alternativa en Java puro).

## Gestión de la Caché

Elimine archivos en caché más antiguos que un número específico de días:

```java
// Eliminar archivos no accedidos en los últimos 30 días
MyClientProxy.ASSETS.cleanOldCache(30);
```

Llame a esto durante `FMLPostInitializationEvent` o en cualquier punto del ciclo de vida del mod.

## Detalles de Implementación

- **Gestor de Descargas**: `DownloadManager` es un singleton con un pool de ejecutores de 2 hilos. Las descargas usan `FileChannel` de NIO para transferencias zero-copy.
- **Clave de Caché**: Los archivos se nombran usando el hash SHA-256 de la URL, asegurando rutas deterministas y deduplicación.
- **Seguridad de Hilos**: `getMedia()` se puede llamar desde cualquier hilo de forma segura. La descarga se ejecuta en un hilo de fondo.
- **Manejo de Errores**: Las descargas fallidas no crashean el juego. El archivo simplemente no se cachea y `getMedia()` retorna `null`.
[/ES]

[EN]
# 02 - Remote Assets (`RemoteResourceManager`)

X4UI includes a remote asset manager for downloading and caching media from HTTP/HTTPS URLs. It uses NIO channels for zero-copy transfers on background threads without impacting game performance.

## Creating a Namespace

A `RemoteResourceManager` instance is scoped to a specific mod ID. Each mod should create its own instance to isolate cache files.

```java
import com.x4yi.x4ui.api.client.resource.RemoteResourceManager;

public class MyClientProxy {
    public static final RemoteResourceManager ASSETS = RemoteResourceManager.create("mymod");
}
```

Files are stored in `.minecraft/x4ui/cache/<modid>/` with SHA-256 hashed filenames.

## Loading Remote Media

Use `getMedia(url)` to obtain a local file path. If the file is not cached, it is downloaded asynchronously and `null` is returned on the first call. Subsequent calls return the cached path.

```java
String cachedPath = MyClientProxy.ASSETS.getMedia("https://example.com/image.png");

if (cachedPath != null) {
    // File is ready, use it
    GuiImage image = new GuiImage(0, 0, 200, 100);
    image.setResource(new ResourceLocation("file://" + cachedPath));
} else {
    // File is downloading, show a placeholder
    GuiLabel loading = new GuiLabel(0, 0, "Loading...", 0xFFAAAAAA);
}
```

## Using Remote URLs with GuiImage

`GuiImage` has built-in URL support that handles downloading and caching internally:

```java
import com.x4yi.x4ui.client.gui.component.GuiImage;

GuiImage logo = new GuiImage(10, 10, 200, 100);
logo.setUrl("https://example.com/logo.png");
```

The image is downloaded asynchronously via Minecraft's `ThreadDownloadImageData` and cached to `.minecraft/x4ui_cache/`. The `setUrl()` method can be called before the component is added to the tree.

## Using Remote URLs with GuiVideo

```java
import com.x4yi.x4ui.client.gui.component.GuiVideo;

GuiVideo video = new GuiVideo(0, 0, 640, 480);
video.setVideoUrl("https://example.com/intro.mp4");
video.play();

// Stop playback when closing the screen
@Override
public void onGuiClosed() {
    super.onGuiClosed();
    video.stop();
}
```

`GuiVideo` lazily initializes the decoder on the first `play()` call. The decoder is either `FFmpegProcessDecoder` (native FFmpeg) or `JCodecVideoDecoder` (pure-Java fallback).

## Cache Management

Delete cached files older than a specified number of days:

```java
// Remove files not accessed in 30 days
MyClientProxy.ASSETS.cleanOldCache(30);
```

Call this during `FMLPostInitializationEvent` or at any point during the mod lifecycle.

## Implementation Details

- **Download Manager**: `DownloadManager` is a singleton with a 2-thread executor pool. Downloads use NIO `FileChannel` for zero-copy transfers.
- **Cache Key**: Files are named using the SHA-256 hash of the URL, ensuring deterministic paths and deduplication.
- **Thread Safety**: `getMedia()` is safe to call from any thread. The download runs on a background thread.
- **Error Handling**: Failed downloads do not crash the game. The file is simply not cached, and `getMedia()` returns `null`.
[/EN]
