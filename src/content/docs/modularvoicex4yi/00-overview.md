---
title: "Visión General e Instalación"
project: "ModularVoiceX4yi"
category: "Introducción"
categoryOrder: 0
order: 0
---

[ES]
# ModularVoiceX4yi (MVX) — Visión General

**Tu micrófono físico convertido en un estudio vocal en tiempo real sobre PipeWire.**

**ModularVoiceX4yi (`mvx`)** es un sistema nativo para Linux escrito en Rust que transforma tu micrófono físico en un procesador de voz modular de ultra baja latencia. Corre como un daemon en segundo plano (`mvxd`), crea un micrófono virtual nativo de PipeWire (`mvx_mic`) y se controla mediante una interfaz TUI interactiva, un cliente CLI (`mvx ctl`), o un icono en la bandeja del sistema (`mvx-tray`).

![Interfaz TUI de MVX](/xhub/img/mvx-tui-main.png)

---

## Características Principales

- **Rack DSP en Tiempo Real (<15 ms base):** Cambio de tono (*pitch*) y formantes independientes mediante *Signalsmith Stretch*, ecualizador de 3 bandas (Low Shelf, Peaking Mid, High Shelf), filtro paso-alto (`HighPass`), puerta de ruido (`NoiseGate`), compresor dinámico, *Chorus*, *Robotizer*, *Ring Modulator*, distorsión con *bitcrusher*, reverberación y *Humanizer*.
- **Supresión Neuronal de Ruido (`DeepFilterNet3`):** Ejecutado 100% en CPU en tiempo real (ventanas de 10 ms) para eliminar ruido de teclado mecánico, ventiladores y estática sin degradar la voz natural.
- **Biometría Vocal ("Solo mi voz" / `SpeakerLock`):** Verificación de identidad del hablante fuera del hilo de tiempo real utilizando **Silero VAD** y **CAM++** (`sherpa-onnx`). El micrófono solo se abre cuando detecta tu huella vocal registrada.
- **Clonación Neuronal de Timbre `[ALPHA]`:** Extrae un vector de timbre de 256 dimensiones desde cualquier archivo `.wav`, `.mp3`, `.ogg` o `.flac`, estima automáticamente el tono fundamental ($F_0$), formantes y balance espectral, y transfiere el timbre en vivo usando **OpenVoice V2** (`tract-onnx`).
- **Soundboard Integrado y Loop Tester:** Reproduce efectos sintetizados (`airhorn`, `bleep`, `chime`, `buzzer`) o tus propios clips `.wav` directamente hacia `mvx_mic`, y graba pruebas de 8 segundos para ajustar tu voz con monitoreo en vivo (*Sidetone*).
- **Integración con Entornos de Escritorio / Tiling WMs:** Salida JSON directa para **Waybar / Polybar** (`mvx status --waybar`), comandos instantáneos para atajos de teclado en Hyprland, Sway, i3 o KDE, e icono de bandeja del sistema SNI (`mvx-tray`).

---

## Requisitos del Sistema

Pensado para cualquier distribución **Linux x86_64** moderna:

- **Servidor de Audio:** **PipeWire** + **WirePlumber** activos (usa la API nativa `libpipewire-0.3`, no capa de compatibilidad PulseAudio).
- **Dependencias de Sistema:** `git`, `clang`, `cmake`, `pkg-config`, headers de desarrollo de `libpipewire-0.3` y `libspa-0.2`, `ffmpeg` (para decodificación de muestras) y `curl`.
- **Toolchain:** Rust `>= 1.96` (el script de instalación lo configura vía `rustup` automáticamente si no está presente).
- **Hardware:** Procesador con soporte **AVX2** recomendado para inferencia ONNX fluida y mínimo **2 GB de RAM**.

---

## Instalación

MVX incluye un instalador automatizado que verifica las dependencias de tu distribución (Arch, Debian/Ubuntu, Fedora, openSUSE), compila el workspace en modo `release`, instala los binarios (`mvxd`, `mvx`, `mvx-tray`) en `~/.local/bin`, registra los servicios `systemd --user` y descarga los modelos ONNX (~180 MB):

```bash
git clone https://github.com/X4yii/ModularVoiceX4yi.git
cd ModularVoiceX4yi
./scripts/install.sh
```

### Opciones del Instalador

| Bandera | Descripción |
| :--- | :--- |
| `./scripts/install.sh --fast` | Compila sin LTO (*Link-Time Optimization*). Mucho más rápido en CPUs modestas o equipos con poca RAM. |
| `./scripts/install.sh --no-clone-models` | Omite la descarga de los modelos de clonación neuronal OpenVoice V2 (ahorra ~160 MB). |
| `./scripts/install.sh --no-deps` | Omite la instalación de paquetes del sistema si ya instalaste las dependencias manualmente. |
| `./scripts/uninstall.sh` | Detiene servicios y elimina los binarios instalados. |
| `./scripts/uninstall.sh --purge` | Desinstalación completa: elimina binarios, modelos ONNX descargados y archivos de configuración en `~/.config/mvx`. |

---

## Configuración en Discord, OBS y Juegos

1. Inicia MVX ejecutando `mvx` en tu terminal (esto levantará automáticamente el daemon `mvxd` si no estaba activo).
2. Abre la configuración de voz de **Discord**, **OBS Studio**, **Steam** o tu navegador.
3. Selecciona **`MVX Microphone` (`mvx_mic`)** como tu dispositivo de entrada.
4. En Discord, se recomienda **desactivar** la supresión de ruido Krisp y el control automático de ganancia si ya utilizas el filtro `DeepFilterNet3` y el compresor de MVX para evitar doble procesamiento.
[/ES]

[EN]
# ModularVoiceX4yi (MVX) — Overview

**Turn your physical microphone into a real-time vocal studio powered by PipeWire.**

**ModularVoiceX4yi (`mvx`)** is a native Linux voice processing suite written in Rust that turns your physical microphone into an ultra-low-latency modular vocal studio. It runs as a background daemon (`mvxd`), exposes a native virtual PipeWire source (`mvx_mic`), and is controlled through an interactive TUI, a fast CLI client (`mvx ctl`), or a system tray icon (`mvx-tray`).

![MVX TUI Interface](/xhub/img/mvx-tui-main.png)

---

## Key Features

- **Real-Time DSP Rack (<15 ms base):** Independent pitch and formant shifting powered by *Signalsmith Stretch*, 3-band EQ (Low Shelf, Peaking Mid, High Shelf), High-Pass filter (`HighPass`), `NoiseGate`, dynamic `Compressor`, `Chorus`, `Robotizer`, `RingMod`, `Distortion` with bitcrusher, `Reverb`, and `Humanizer`.
- **Neural Noise Suppression (`DeepFilterNet3`):** Runs 100% on CPU in real time (10 ms frames) to strip mechanical keyboard clicks, fan noise, and electrical hum without clipping your natural voice.
- **Vocal Biometrics ("My Voice Only" / `SpeakerLock`):** Out-of-thread speaker verification powered by **Silero VAD** and **CAM++** (`sherpa-onnx`). The microphone gate only opens when your enrolled vocal fingerprint is detected.
- **Neural Timbre Cloning `[ALPHA]`:** Extracts a 256-dimensional tone color embedding from any `.wav`, `.mp3`, `.ogg`, or `.flac` audio file, automatically estimates fundamental frequency ($F_0$), formants, and spectral EQ balance, and converts your voice timbre using **OpenVoice V2** (`tract-onnx`).
- **Built-in Soundboard & Loop Tester:** Inject synthesized effects (`airhorn`, `bleep`, `chime`, `buzzer`) or custom `.wav` clips directly into `mvx_mic`, and record 8-second loop tests with real-time headphone monitoring (*Sidetone*).
- **Desktop & Tiling WM Integration:** Native single-line JSON output for **Waybar / Polybar** (`mvx status --waybar`), instant CLI commands for keybindings in Hyprland, Sway, i3, or KDE, and a StatusNotifierItem tray app (`mvx-tray`).

---

## System Requirements

Designed for any modern **x86_64 Linux** distribution:

- **Audio Stack:** Active **PipeWire** + **WirePlumber** session (uses native `libpipewire-0.3` bindings, not PulseAudio/JACK shims).
- **System Dependencies:** `git`, `clang`, `cmake`, `pkg-config`, development headers for `libpipewire-0.3` and `libspa-0.2`, `ffmpeg` (for sample decoding), and `curl`.
- **Toolchain:** Rust `>= 1.96` (automatically installed via `rustup` by the installer if missing).
- **Hardware:** CPU with **AVX2** support recommended for smooth ONNX inference and at least **2 GB of RAM**.

---

## Installation

MVX ships with an automated installer script that checks distribution dependencies (Arch, Debian/Ubuntu, Fedora, openSUSE), compiles the workspace in `release` mode, installs binaries (`mvxd`, `mvx`, `mvx-tray`) into `~/.local/bin`, sets up `systemd --user` units, and downloads the required ONNX models (~180 MB):

```bash
git clone https://github.com/X4yii/ModularVoiceX4yi.git
cd ModularVoiceX4yi
./scripts/install.sh
```

### Installer Flags

| Flag | Description |
| :--- | :--- |
| `./scripts/install.sh --fast` | Builds without LTO (*Link-Time Optimization*). Significantly faster on modest CPUs or low-RAM machines. |
| `./scripts/install.sh --no-clone-models` | Skips downloading OpenVoice V2 neural cloning models (saves ~160 MB). |
| `./scripts/install.sh --no-deps` | Skips distribution package installation if you already installed dependencies manually. |
| `./scripts/uninstall.sh` | Stops services and removes installed binaries. |
| `./scripts/uninstall.sh --purge` | Full uninstallation: removes binaries, downloaded ONNX models, and configuration files in `~/.config/mvx`. |

---

## Setup in Discord, OBS & Games

1. Launch MVX by running `mvx` in your terminal (this automatically starts the `mvxd` daemon if not already running).
2. Open the audio settings in **Discord**, **OBS Studio**, **Steam**, or your browser.
3. Select **`MVX Microphone` (`mvx_mic`)** as your input device.
4. In Discord, it is recommended to **disable** Krisp noise suppression and automatic gain control when using MVX's `DeepFilterNet3` and compressor to avoid double processing.
[/EN]

