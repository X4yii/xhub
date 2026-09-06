---
title: "Remote Assets"
project: "X4UI"
category: "General"
categoryOrder: 2
order: 2
---

[ES]
# 02 - Recursos Remotos (`RemoteResourceManager`)

X4UI incluye un subsistema de recursos remotos para descargar y almacenar en caché archivos multimedia (imágenes, audio, video) desde URLs HTTP/HTTPS públicas de forma asíncrona en segundo plano.

---

## 1. Crear un Espacio de Nombres (Namespace)

Cada mod debe crear su propia instancia de `RemoteResourceManager` vinculada a su Mod ID. Esto aísla el directorio de caché local:

```java
package com.example.mymod.client;

import com.x4yi.x4ui.api.client.resource.RemoteResourceManager;

public class MyClientProxy {
    public static final RemoteResourceManager ASSETS = RemoteResourceManager.create("mymod");
}
```

Los archivos se guardan en `.minecraft/x4ui/cache/<modid>/` nombrados mediante el hash SHA-256 de su URL.

---

## 2. Descarga y Obtención Asíncrona

El método `getMedia(url)` devuelve la ruta local en disco del archivo si ya se encuentra en caché. Si aún no se ha descargado, inicia la descarga en segundo plano y retorna `null`:

```java
String localPath = MyClientProxy.ASSETS.getMedia("https://example.com/assets/banner.png");

if (localPath != null) {
    // El archivo ya está disponible en disco
    guiImage.setResource(new ResourceLocation("file://" + localPath));
} else {
    // Descargando en segundo plano, mostrar estado de carga
    statusLabel.setText("Descargando recurso...");
}
```

---

## 3. Integración Directa con Componentes

### `GuiImage` con URL Remota
`GuiImage` integra internamente el pipeline de descarga asíncrona:

```java
GuiImage webBanner = new GuiImage(10, 10, 200, 100);
webBanner.setUrl("https://example.com/images/banner.png");
rootPanel.addChild(webBanner);
```
Mientras se descarga, renderiza un placeholder transparente.

### `GuiVideo` con URL Remota
```java
GuiVideo player = new GuiVideo(0, 0, 640, 360);
player.setVideoUrl("https://example.com/media/intro.mp4");
player.play();
rootPanel.addChild(player);
```

---

## 4. Mantenimiento y Limpieza de Caché

Para evitar la acumulación indefinida de archivos en disco, utilice `cleanOldCache(int maxAgeDays)`:

```java
// Eliminar archivos que no se hayan accedido en los últimos 15 días
MyClientProxy.ASSETS.cleanOldCache(15);
```
Se recomienda invocar este método durante `FMLPostInitializationEvent` en el cliente.

---

## Qué Evitar Hacer (Antipatrones y Limitaciones)

> [!CAUTION]
> **1. NUNCA realizar descargas HTTP síncronas en el hilo principal.**
> Nunca utilice `new URL().openStream()` directamente. Utilice siempre `RemoteResourceManager` para evitar congelar el juego.

> [!WARNING]
> **2. NUNCA asumir que `getMedia()` retornará una ruta en el primer cuadro.**
> Si un archivo no está descargado, retornará `null`. Programe estados de carga.

> [!WARNING]
> **3. NUNCA suministrar videos en formatos no soportados.**
> Utilice SÓLO contenedores MP4 con video **H.264** y audio **AAC**. Otros formatos fallarán.

> [!IMPORTANT]
> **4. NUNCA descargar archivos gigantescos sin advertir al jugador.**
> Respete el ancho de banda del usuario en conexiones limitadas.
[/ES]

[EN]
# 02 - Remote Assets (`RemoteResourceManager`)

X4UI features a remote asset management subsystem designed to asynchronously download and cache multimedia assets (images, audio, video) from public HTTP/HTTPS URLs in the background.

---

## 1. Creating a Mod Namespace

Each mod must instantiate its own `RemoteResourceManager` instance tied to its unique Mod ID. This guarantees an isolated local cache namespace:

```java
package com.example.mymod.client;

import com.x4yi.x4ui.api.client.resource.RemoteResourceManager;

public class MyClientProxy {
    public static final RemoteResourceManager ASSETS = RemoteResourceManager.create("mymod");
}
```

Files are stored in `.minecraft/x4ui/cache/<modid>/` and hashed using SHA-256 for deterministic caching and deduplication.

---

## 2. Asynchronous Retrieval

The `getMedia(url)` method returns the local absolute file path if the file is already cached. If the file is still downloading or not present, it triggers a background download and returns `null`:

```java
String localPath = MyClientProxy.ASSETS.getMedia("https://example.com/assets/banner.png");

if (localPath != null) {
    // File is ready on disk
    guiImage.setResource(new ResourceLocation("file://" + localPath));
} else {
    // Downloading in background; show placeholder or loading state
    statusLabel.setText("Downloading asset...");
}
```

---

## 3. Direct Component Integration

### `GuiImage` with Remote URLs
`GuiImage` handles the async download lifecycle out of the box:

```java
GuiImage webBanner = new GuiImage(10, 10, 200, 100);
webBanner.setUrl("https://example.com/images/banner.png");
rootPanel.addChild(webBanner);
```
While downloading, it renders a transparent placeholder.

### `GuiVideo` with Remote URLs
```java
GuiVideo player = new GuiVideo(0, 0, 640, 360);
player.setVideoUrl("https://example.com/media/intro.mp4");
player.play();
rootPanel.addChild(player);
```

---

## 4. Cache Maintenance & Cleanup

To avoid unbounded disk usage, use `cleanOldCache(int maxAgeDays)`:

```java
// Delete cached files not accessed in the last 15 days
MyClientProxy.ASSETS.cleanOldCache(15);
```
Calling this during `FMLPostInitializationEvent` on the client is recommended.

---

## What to Avoid (Pitfalls & Limitations)

> [!CAUTION]
> **1. NEVER execute synchronous HTTP network calls on the main thread.**
> Never call `new URL().openStream()` directly. Always use `RemoteResourceManager` to avoid freezing the game.

> [!WARNING]
> **2. NEVER assume `getMedia()` returns a non-null path immediately.**
> If an asset is not yet downloaded, it returns `null`. Always design UI loading states.

> [!WARNING]
> **3. NEVER supply unsupported video formats.**
> ONLY use MP4 containers with **H.264** video and **AAC** audio. Other formats will fail.

> [!IMPORTANT]
> **4. NEVER trigger massive multi-hundred-megabyte downloads unprompted.**
> Be considerate of players on limited internet connections.
[/EN]
