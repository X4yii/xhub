---
title: "Multimedia"
project: "X4UI"
category: "Components"
categoryOrder: 1
order: 2
---

[ES]
# Componentes Multimedia (Videos e Imágenes)

En X4UI, los componentes multimedia están diseñados bajo el estricto Principio de Sustitución de Liskov.

## GuiImage (Imágenes Estáticas y 9-Slice)

`GuiImage` maneja tanto texturas empaquetadas (ResourceLocation) como imágenes descargadas de la web, con soporte de dibujado normal y **NineSlice**.

### Carga de Texturas Web

```java
GuiImage banner = (GuiImage) new GuiImage(0, 0, 0, 150).withPercentWidth(1.0f);
// Descarga asíncrona; el juego no se congela
banner.setImage("https://ejemplo.com/fondo.jpg");
```

### Configuraciones 9-Slice
La manera de aplicar divisiones es instanciar un `NineSliceConfig`:

```java
// Configurar los márgenes 9-slice de la textura
banner.setNineSliceConfig(new NineSliceConfig(4, 4, 4, 4));
// Indicarle a GuiImage que dibuje usando los bordes protegidos
banner.setMode(GuiImage.ImageMode.NINESLICE);
```

## GuiVideo (Reproductor de FFmpeg)

`GuiVideo` es una entidad independiente que extiende de `GuiComponent`.
Gestiona su propio renderizador de *frames* asíncronos enlazado a las promesas del `MediaPipeline`.

```java
GuiVideo introVideo = (GuiVideo) new GuiVideo(0, 0, 0, 240).withPercentWidth(1.0f);

introVideo.setVideo("https://ejemplo.com/mi_intro.mp4");
introVideo.setLooping(true); // Repetir al acabar
introVideo.setVolume(0.5f);  // Volumen al 50%
```

### Barra de Carga Integrada
Al iniciar la descarga del video, el componente mostrará internamente un indicador de carga. No inyectará `Toasts` en el gestor global, manteniendo tu pantalla limpia de popups si estás iterando sobre menús pesados.
[/ES]

[EN]
# Multimedia Components (Videos and Images)

In X4UI, the multimedia components are designed under strict adherence to the Liskov Substitution Principle.

## GuiImage (Static Images and 9-Slice)

`GuiImage` handles both packaged textures (`ResourceLocation`) and images downloaded from the web, with support for normal rendering and **NineSlice** scaling.

### Loading Web Textures

```java
GuiImage banner = (GuiImage) new GuiImage(0, 0, 0, 150).withPercentWidth(1.0f);
// Asynchronous download; the game thread is not blocked
banner.setImage("https://example.com/background.jpg");
```

### 9-Slice Configurations
The way to apply slice margins is by instantiating a `NineSliceConfig`:

```java
// Configure the 9-slice margins for the texture
banner.setNineSliceConfig(new NineSliceConfig(4, 4, 4, 4));
// Instruct GuiImage to draw using the protected borders
banner.setMode(GuiImage.ImageMode.NINESLICE);
```

## GuiVideo (FFmpeg Player)

`GuiVideo` is a fully independent entity extending `GuiComponent`.
It manages its own asynchronous frame renderer tied directly to the `MediaPipeline` promises.

```java
GuiVideo introVideo = (GuiVideo) new GuiVideo(0, 0, 0, 240).withPercentWidth(1.0f);

introVideo.setVideo("https://example.com/my_intro.mp4");
introVideo.setLooping(true); // Repeat when finished
introVideo.setVolume(0.5f);  // Volume at 50%
```

### Integrated Loading Bar
Upon starting the video download, the component will internally render a loading spinner. It will NOT inject `Toasts` into the global manager, keeping your screen entirely clean of popups even if you are iterating over heavy multimedia menus.
[/EN]
