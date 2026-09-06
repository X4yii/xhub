---
title: "Media Limitations"
project: "X4UI"
category: "General"
categoryOrder: 3
order: 4
---

[ES]
# Formatos Multimedia Soportados

El componente `GuiVideo` soporta de manera segura los siguientes formatos dependiendo de la plataforma de juego.

## PC (Windows, Linux, macOS)
- **Formatos de Vídeo:** MP4, MKV, WebM, AVI, FLV
- **Formatos de Audio:** MP3, AAC, OGG, WAV, FLAC

## Android (PojavLauncher, FoldCraft)
- **Formatos de Vídeo:** **SÓLO MP4 con codificación H.264**
- **Perfil Recomendado:** *Baseline* o *Main*
- **Nota:** Intentar reproducir WebM o MKV en Android causará errores.

Si tu mod utiliza `GuiVideo`, asegúrate de incluir siempre una versión `.mp4` (H.264) como respaldo para que los jugadores de móviles puedan ver tu contenido.
[/ES]

[EN]
# Supported Media Formats

The `GuiVideo` component safely supports the following formats depending on the target platform.

## PC (Windows, Linux, macOS)
- **Video Formats:** MP4, MKV, WebM, AVI, FLV
- **Audio Formats:** MP3, AAC, OGG, WAV, FLAC

## Android (PojavLauncher, FoldCraft)
- **Video Formats:** **MP4 with H.264 encoding ONLY**
- **Recommended Profile:** *Baseline* or *Main*
- **Note:** Attempting to play WebM or MKV on Android will throw an error.

If your mod makes heavy use of `GuiVideo`, always include a fallback `.mp4` (H.264) version so Android players do not miss your content.
[/EN]
