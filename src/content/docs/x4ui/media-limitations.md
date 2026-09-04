---
title: "Media Limitations"
project: "X4UI"
category: "General"
categoryOrder: 3
order: 4
---

[ES]
# Limitaciones del Motor Multimedia

El componente `GuiVideo` y `GuiAudio` de X4UI está diseñado para ofrecer la máxima compatibilidad posible entre entornos de PC tradicionales y launchers de Android (como PojavLauncher o FoldCraftLauncher). Sin embargo, debido a las restricciones de seguridad y arquitectura de estos sistemas operativos, existen diferencias fundamentales en el funcionamiento.

## PC (Windows, Linux, macOS)

En entornos de escritorio, X4UI utiliza un motor **Híbrido de Alto Rendimiento** basado en FFmpeg.

- **Rendimiento:** Soporte completo de Aceleración y decodificación multi-hilo nativa.
- **Formatos de Vídeo:** Soporte casi universal (MP4, MKV, WebM, AVI, FLV, etc).
- **Formatos de Audio:** Soporte universal (MP3, AAC, OGG, WAV, FLAC, etc).
- **Resoluciones:** 1080p a 60fps (y superior, dependiendo del procesador).

## Android (PojavLauncher, FoldCraft)

En dispositivos Android (especialmente Android 10 y superior), el sistema operativo impone políticas estrictas de seguridad (SELinux) y marca el almacenamiento externo (donde suele estar la carpeta `.minecraft`) con la bandera `noexec`. Esto impide la ejecución de binarios de decodificación externos.

Para garantizar que el mod nunca cause un *Crash* (cierre forzoso) bajo estas restricciones, X4UI activa automáticamente un mecanismo de defensa (**Graceful Degradation**) y cambia a un decodificador **Pure-Java** interno.

### Limitaciones en Modo Pure-Java (Android):

1. **Formatos Soportados:** **SÓLO MP4 con codificación H.264**. *Si intentas reproducir WebM o MKV en Android, no funcionará o lanzará error.*
2. **Audio:** Depende de los bindings nativos de OpenAL del launcher. Si el launcher no expone correctamente AL10 a la JVM, el audio podría fallar.
3. **Rendimiento (CPU Software Decoding):** El decodificador Java no tiene aceleración por hardware nativa. La fluidez del vídeo (FPS) estará estrictamente limitada a la potencia bruta del procesador del teléfono. Se recomiendan vídeos de 720p a 30fps para dispositivos de gama media-baja.
4. **Perfil H.264:** Se recomienda encarecidamente usar el perfil *Baseline* o *Main* al codificar vídeos para que el decodificador Pure-Java los procese sin errores de memoria.

---

**Nota para Desarrolladores:**

Si tu mod hace uso intensivo de `GuiVideo`, asegúrate de incluir versiones comprimidas en `.mp4` (H.264) de tus cinemáticas o menús animados, de modo que los jugadores de Android no se queden sin ver tu contenido.
[/ES]

[EN]
# Media Engine Limitations

X4UI's `GuiVideo` and `GuiAudio` components are designed to offer maximum compatibility between traditional PC environments and Android launchers (such as PojavLauncher or FoldCraftLauncher). However, due to security restrictions and architecture differences in these operating systems, there are fundamental differences in behavior.

## PC (Windows, Linux, macOS)

On desktop environments, X4UI uses a **High-Performance Hybrid Engine** based on FFmpeg.

- **Performance:** Full hardware acceleration support and native multi-threaded decoding.
- **Video Formats:** Near-universal support (MP4, MKV, WebM, AVI, FLV, etc).
- **Audio Formats:** Universal support (MP3, AAC, OGG, WAV, FLAC, etc).
- **Resolutions:** 1080p at 60fps (and higher, depending on the CPU).

## Android (PojavLauncher, FoldCraft)

On Android devices (especially Android 10 and above), the operating system enforces strict security policies (SELinux) and flags external storage (where `.minecraft` is typically located) with the `noexec` flag. This prevents execution of external decoding binaries.

To guarantee the mod never causes a *Crash* (forced close) under these restrictions, X4UI automatically activates a defense mechanism (**Graceful Degradation**) and switches to a pure-Java internal decoder.

### Limitations in Pure-Java Mode (Android):

1. **Supported Formats:** **MP4 with H.264 encoding ONLY**. *Attempting to play WebM or MKV on Android will fail or throw an error.*
2. **Audio:** Depends on the launcher's native OpenAL bindings. If the launcher does not correctly expose AL10 to the JVM, audio may fail.
3. **Performance (CPU Software Decoding):** The Java decoder has no native hardware acceleration. Video fluidity (FPS) will be strictly limited to the phone's raw CPU power. 720p at 30fps is recommended for mid-to-low range devices.
4. **H.264 Profile:** It is strongly recommended to use the *Baseline* or *Main* profile when encoding videos so the pure-Java decoder processes them without memory errors.

---

**Note for Developers:**

If your mod makes heavy use of `GuiVideo`, make sure to include compressed `.mp4` (H.264) versions of your cinematics or animated menus, so Android players don't miss your content.
[/EN]
