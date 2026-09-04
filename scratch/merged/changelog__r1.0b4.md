---
title: "X4UI Framework r1.0b4"
date: 2026-09-02
project: "X4UI"
version: "r1.0b4"
---

# X4UI r1.0b4

[ES]
### Arquitectura y Seguridad (Client/Server)
- **Separación Estricta Cliente/Servidor:** Reestructuración de la jerarquía de paquetes. Interfaces en `api.client.*`, implementaciones en `impl.client.*`. Previene `ClassNotFoundException` en Servidores Dedicados.
- **State\<T\>:** Reubicado en `com.x4yi.x4ui.common` para uso seguro en servidores. Employa `CopyOnWriteArrayList` y deduplicación de valores por `Objects.equals()`.
- **NetworkSyncHelper:** Permite vincular propiedades de `Container` (vía `IContainerListener`) a objetos `State<Integer>`, `State<Boolean>` y `State<Float>` con escala configurable.

### Assets y Multimedia
- **RemoteResourceManager:** Sistema de descarga asíncrona de recursos multimedia (imágenes, audio, vídeo) desde URLs HTTP/HTTPS. Caché local aislada por Mod ID con hash SHA-256.
- **DownloadManager:** Singleton con executor de 2 hilos. Transferencias NIO zero-copy en subprocesos de fondo sin penalizar rendimiento.
- **Motor de Audio (OpenAL):** `OpenALAudioSink` para reproducción de audio con 8 buffers streaming y tracking de tiempo de reproducción por muestra. Integrado al ciclo de vida de la GUI.
- **GuiVideo - Decoder Dual:** FFmpegProcessDecoder (nativo) como decodificador primario. JCodecVideoDecoder (pure-Java) como respaldo automático para Android (PojavLauncher) y sistemas sin ejecución de procesos.
- **GuiImage/GuiVideo:** Soporte para canal alfa (`setAlpha()`) y tintes de color (`setColor(r, g, b)`).

### Interfaz y Componentes
- **Rediseño de la API Pública:** Métodos renombrados para desvinculación de Mojang: `update()` → `tick(float)`, `drawSelf()` → `renderSelf(int, int, float)`, `mouseClicked` → `onMouseClick`.
- **Sistema de Layout Optimizado:** Flags `requestLayout()` y `requestRender()` para evitar recálculos costosos al mutar propiedades puramente visuales.
- **Insets:** Clase inmutable para padding/margin con soporte asimétrico: `new Insets(top, right, bottom, left)`.
- **ITheme / DefaultTheme:** Sistema de temas inyectable por componente. Estilos no son globales. `DefaultTheme`提供 tema oscuro con colores Material Design.
- **GuiBuilder\<T\>:** API fluent para construcción declarativa de componentes con chainable setters.
- **Tooltips Nativos:** Sistema de tooltips reescrito utilizando `GuiPanel` directamente. Resolución por cadena de padres. Soporte para texto y componentes personalizados.
- **GuiDropdown\<T\>:** Selector genérico con popup, enlace reactivo a `State<T>`, y renderizado fuera de scissor.
- **GuiVirtualList\<T\>:** Lista virtualizada que solo instancía componentes visibles en el viewport. Ventana/reciclaje automático al hacer scroll.

### Layout y Eventos
- **FlexLayout:** Motor de layout tipo CSS Flexbox. Direcciones VERTICAL, HORIZONTAL, ABSOLUTE. Soporte para `gap`, `flexWrap`, `padding` y `margin`.
- **Propagación de Eventos:** Iteración en orden inverso de render (componente de mayor capa primero). Retorno `true` detiene la propagación.
- **Gestión de Foco:** Modelo de foco único almacenado en el componente raíz. `requestFocus()`, `clearFocus()`, `isFocused()`.
- **Sistema de Capas:** Componente `layer` entero para orden Z. Los hijos se renderizan en orden ascendente de capa.

### Multimedia y Decodificación
- **FFmpegProcessDecoder:** Subproceso FFmpeg con pipes NIO. Probes de metadatos vía `ffmpeg -i`. DecoderThread con RingBuffer para frames BGRA.
- **JCodecVideoDecoder:** Decodificador pure-Java usando `H264Decoder` de JCodec. Demuxing MP4, decodificación de NALs H.264, conversión YUV420 a ARGB.
- **MediaPlayer:** Orquestador de reproducción con reloj maestro de audio y fallback a reloj del sistema.

### Documentación
- Reescritura completa del directorio `Docs/`. Formato de Wiki técnica de API con tono estrictamente objetivo y profesional (en-us y es-latam).

---
[/ES]

[EN]
### Architecture & Security (Client/Server)
- **Strict Client/Server Separation:** Refactored package hierarchy. Interfaces in `api.client.*`, implementations in `impl.client.*`. Prevents `ClassNotFoundException` on Dedicated Servers.
- **State\<T\>:** Relocated to `com.x4yi.x4ui.common` for safe server-side usage. Uses `CopyOnWriteArrayList` and value deduplication via `Objects.equals()`.
- **NetworkSyncHelper:** Binds `Container` properties (via `IContainerListener`) to `State<Integer>`, `State<Boolean>`, and `State<Float>` objects with configurable scale.

### Assets & Multimedia
- **RemoteResourceManager:** Asynchronous media downloading from HTTP/HTTPS URLs. Local cache isolated by Mod ID with SHA-256 hashing.
- **DownloadManager:** Singleton with 2-thread executor pool. NIO zero-copy transfers on background threads without impacting game performance.
- **Audio Engine (OpenAL):** `OpenALAudioSink` for audio playback with 8-buffer streaming and per-sample playback time tracking. Integrated with GUI lifecycle.
- **GuiVideo - Dual Decoder:** FFmpegProcessDecoder (native) as primary decoder. JCodecVideoDecoder (pure-Java) as automatic fallback for Android (PojavLauncher) and systems without process execution.
- **GuiImage/GuiVideo:** Alpha channel support (`setAlpha()`) and color tinting (`setColor(r, g, b)`).

### Interface & Components
- **Public API Redesign:** Renamed methods for Mojang decoupling: `update()` → `tick(float)`, `drawSelf()` → `renderSelf(int, int, float)`, `mouseClicked` → `onMouseClick`.
- **Optimized Layout System:** `requestLayout()` and `requestRender()` flags to avoid expensive recalculations when mutating purely visual properties.
- **Insets:** Immutable class for padding/margin with asymmetric support: `new Insets(top, right, bottom, left)`.
- **ITheme / DefaultTheme:** Injectable theming system per component. Styles are no longer global. `DefaultTheme` provides a dark theme with Material Design colors.
- **GuiBuilder\<T\>:** Fluent API for declarative component construction with chainable setters.
- **Native Tooltips:** Tooltip system rewritten using `GuiPanel` directly. Resolution via parent chain. Support for text and custom component tooltips.
- **GuiDropdown\<T\>:** Generic selector with popup, reactive binding to `State<T>`, and rendering outside scissor bounds.
- **GuiVirtualList\<T\>:** Virtualized list that only instantiates components visible in the viewport. Windowing/recycling during scroll.

### Layout & Events
- **FlexLayout:** CSS Flexbox-like layout engine. VERTICAL, HORIZONTAL, ABSOLUTE directions. Supports `gap`, `flexWrap`, `padding`, and `margin`.
- **Event Propagation:** Reverse render order iteration (highest-layer component first). Returning `true` stops propagation.
- **Focus Management:** Single-focus model stored on root component. `requestFocus()`, `clearFocus()`, `isFocused()`.
- **Layer System:** Integer `layer` property for Z-ordering. Children render in ascending layer order.

### Multimedia & Decoding
- **FFmpegProcessDecoder:** FFmpeg subprocess with NIO pipes. Metadata probing via `ffmpeg -i`. Background DecoderThread with RingBuffer for BGRA frames.
- **JCodecVideoDecoder:** Pure-Java decoder using JCodec's `H264Decoder`. MP4 demuxing, H.264 NAL decoding, YUV420 to ARGB conversion.
- **MediaPlayer:** Playback orchestrator with audio master clock and system clock fallback.

### Documentation
- Complete rewrite of the `Docs/` directory. Technical API Wiki format with strictly objective and professional tone (en-us and es-latam).
[/EN]
