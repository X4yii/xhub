---
title: "Uso Rápido, TUI y CLI"
project: "ModularVoiceX4yi"
category: "Introducción"
categoryOrder: 0
order: 1
---

[ES]
# Uso Rápido, TUI y CLI (`mvx`)

MVX está diseñado para controlarse tanto desde su interfaz gráfica en terminal (**TUI**) como mediante comandos rápidos (**CLI**) pensados para gestores de ventanas (*Hyprland*, *Sway*, *i3*, *KDE Plasma*) y barras de estado (*Waybar*).

---

## 1. Interfaz TUI Interactiva

Para abrir la interfaz principal en terminal, ejecuta simplemente:

```bash
mvx
# o explícitamente:
mvx tui
```

Si el daemon `mvxd` no está corriendo, `mvx` lo iniciará automáticamente en segundo plano y se conectará al socket Unix `$XDG_RUNTIME_DIR/mvx/mvxd.sock`.

### Funciones de la TUI
- **Soporte completo de Ratón y Teclado:** Puedes hacer clic directamente sobre pestañas, presets, sliders, botones de mute/bypass/sidetone o arrastrar controles deslizantes.
- **Vúmetros y Analizador Espectral de 8 Bandas:** Visualización en tiempo real de pico/RMS de entrada y salida, reducción de ganancia de la compuerta (`Gate GR`) y del compresor (`Comp GR`), además de contador de recortes digitales (`Clips`).
- **Editor de Rack DSP en Vivo:** Ajusta semitonos de *pitch* y formantes, activa o desactiva filtros del preset actual y modifica sus parámetros sin cortes de audio.
- **Gestión de Biometría y Clonación:** Graba tu perfil de voz de 10 segundos para `"Solo mi voz"` o carga muestras de audio para clonación neuronal de timbre.

---

## 2. Referencia de Comandos CLI (`mvx`)

### Subcomandos Principales

| Comando | Descripción |
| :--- | :--- |
| `mvx` / `mvx tui` | Abre la interfaz interactiva en terminal. |
| `mvx status` | Imprime el estado completo (`Snapshot`) del daemon en formato JSON formateado. |
| `mvx status --waybar` | Imprime una línea JSON compatible con módulos personalizados de **Waybar** (`text`, `alt`, `tooltip`, `class`, `percentage`). |
| `mvx devices` | Lista todos los micrófonos y fuentes físicas de PipeWire detectadas. |
| `mvx doctor` | Ejecuta un diagnóstico completo: conexión con `mvxd`, nodos PipeWire (`mvx_mic`), enlaces FL/FR, estado de modelos ONNX, latencia y contadores de `xruns`/`underruns`. |
| `mvx models install` | Descarga y verifica los modelos neuronales (`CAM++`, `Silero VAD` y `OpenVoice V2`). |
| `mvx models status` | Muestra las rutas locales y el estado de instalación de los modelos ONNX. |
| `mvx clone <ruta> [-n <nombre>]` | `[ALPHA]` Analiza un archivo `.wav/.mp3/.ogg/.flac`, extrae su timbre neuronal y crea/activa un preset clonado. |
| `mvx shutdown` | Solicita al daemon `mvxd` un apagado limpio y destruye el micrófono virtual. |

---

## 3. Control en Tiempo Real (`mvx ctl`)

El subcomando `mvx ctl` permite alterar el estado del motor al instante desde scripts o atajos globales de teclado:

```bash
# Silenciar / activar el micrófono virtual
mvx ctl toggle-mute

# Alternar modo Bypass (voz limpia sin efectos ni latencia DSP)
mvx ctl toggle-bypass

# Alternar Sidetone (escuchar tu propia voz procesada en auriculares)
mvx ctl toggle-monitor

# Ajustar el volumen del Sidetone en decibelios
mvx ctl monitor-gain -6.0

# Cambiar entre perfiles de voz (Presets)
mvx ctl next-preset
mvx ctl prev-preset
mvx ctl preset voz_grave

# Reproducir o detener clips del Soundboard
mvx ctl sound airhorn
mvx ctl stop-sounds

# Grabar/reproducir prueba de bucle de 8 segundos (Loop Tester)
mvx ctl loop-test toggle

# Forzar reconstrucción del grafo de audio PipeWire
mvx ctl reload-audio
```

---

## 4. Integración con Hyprland / Sway y Waybar

### Atajos en `hyprland.conf`

```ini
bind = SUPER, M, exec, mvx ctl toggle-mute
bind = SUPER SHIFT, M, exec, mvx ctl toggle-bypass
bind = SUPER, Next, exec, mvx ctl next-preset
bind = SUPER, Prior, exec, mvx ctl prev-preset
```

### Módulo para `Waybar` (`config.jsonc`)

```json
"custom/mvx": {
    "exec": "mvx status --waybar",
    "return-type": "json",
    "interval": 1,
    "on-click": "mvx ctl toggle-mute",
    "on-click-right": "mvx ctl toggle-bypass",
    "on-scroll-up": "mvx ctl next-preset",
    "on-scroll-down": "mvx ctl prev-preset"
}
```

---

## 5. Bandeja del Sistema (`mvx-tray`) y Systemd

El binario `mvx-tray` implementa el protocolo *StatusNotifierItem (SNI)* para mostrar el estado del micrófono en la bandeja del sistema (KDE, Waybar tray, GNOME con AppIndicator) con menú rápido para cambiar presets, activar mute/bypass o abrir la TUI.

Puedes gestionar los servicios de usuario con `systemd`:

```bash
systemctl --user enable --now mvxd.service
systemctl --user enable --now mvx-tray.service
```
[/ES]

[EN]
# Quickstart, TUI & CLI (`mvx`)

MVX is designed to be controlled both from its interactive terminal user interface (**TUI**) and through fast command-line actions (**CLI**) tailored for tiling window managers (*Hyprland*, *Sway*, *i3*, *KDE Plasma*) and status bars (*Waybar*).

---

## 1. Interactive TUI Interface

To launch the main terminal interface, simply run:

```bash
mvx
# or explicitly:
mvx tui
```

If the `mvxd` daemon is not running, `mvx` automatically spawns it in the background and connects to `$XDG_RUNTIME_DIR/mvx/mvxd.sock`.

### TUI Highlights
- **Full Mouse & Keyboard Support:** Click directly on tabs, presets, sliders, mute/bypass/sidetone toggles, or drag sliders smoothly with the mouse.
- **VU Meters & 8-Band Spectrum Analyzer:** Real-time input/output peak and RMS meters, gate gain reduction (`Gate GR`), compressor gain reduction (`Comp GR`), and digital clip counter (`Clips`).
- **Live DSP Rack Editor:** Tweak pitch and formant semitones, toggle preset filters on/off, and adjust filter parameters on the fly without audio dropouts.
- **Biometrics & Cloning Manager:** Record a 10-second voice profile for `"My Voice Only"` or load audio samples for neural timbre cloning.

---

## 2. CLI Command Reference (`mvx`)

### Primary Subcommands

| Command | Description |
| :--- | :--- |
| `mvx` / `mvx tui` | Opens the interactive terminal UI. |
| `mvx status` | Prints the complete daemon state (`Snapshot`) as pretty-printed JSON. |
| `mvx status --waybar` | Outputs a single-line JSON object for custom **Waybar** modules (`text`, `alt`, `tooltip`, `class`, `percentage`). |
| `mvx devices` | Lists all available physical PipeWire audio input sources. |
| `mvx doctor` | Runs a full system diagnostic: `mvxd` connection, PipeWire nodes (`mvx_mic`), FL/FR links, ONNX model readiness, latency breakdown, and `xruns`/`underruns`. |
| `mvx models install` | Downloads and verifies neural models (`CAM++`, `Silero VAD`, and `OpenVoice V2`). |
| `mvx models status` | Displays local paths and verification status for installed ONNX models. |
| `mvx clone <path> [-n <name>]` | `[ALPHA]` Analyzes a `.wav/.mp3/.ogg/.flac` file, extracts its neural timbre embedding, and creates/activates a cloned preset. |
| `mvx shutdown` | Requests `mvxd` to shut down cleanly and removes the virtual microphone node. |

---

## 3. Real-Time Control (`mvx ctl`)

The `mvx ctl` subcommand lets you mutate engine parameters instantaneously from scripts or global hotkeys:

```bash
# Toggle virtual microphone mute
mvx ctl toggle-mute

# Toggle DSP Bypass mode (clean raw voice with zero DSP latency)
mvx ctl toggle-bypass

# Toggle Sidetone (hear your processed voice in your headphones)
mvx ctl toggle-monitor

# Set Sidetone monitor gain in decibels
mvx ctl monitor-gain -6.0

# Cycle or select voice presets
mvx ctl next-preset
mvx ctl prev-preset
mvx ctl preset voz_grave

# Trigger or stop Soundboard clips
mvx ctl sound airhorn
mvx ctl stop-sounds

# Record/play an 8-second voice loop test
mvx ctl loop-test toggle

# Force a PipeWire audio graph reload
mvx ctl reload-audio
```

---

## 4. Hyprland / Sway & Waybar Integration

### `hyprland.conf` Keybindings

```ini
bind = SUPER, M, exec, mvx ctl toggle-mute
bind = SUPER SHIFT, M, exec, mvx ctl toggle-bypass
bind = SUPER, Next, exec, mvx ctl next-preset
bind = SUPER, Prior, exec, mvx ctl prev-preset
```

### `Waybar` Module (`config.jsonc`)

```json
"custom/mvx": {
    "exec": "mvx status --waybar",
    "return-type": "json",
    "interval": 1,
    "on-click": "mvx ctl toggle-mute",
    "on-click-right": "mvx ctl toggle-bypass",
    "on-scroll-up": "mvx ctl next-preset",
    "on-scroll-down": "mvx ctl prev-preset"
}
```

---

## 5. System Tray (`mvx-tray`) & Systemd Services

The `mvx-tray` binary implements the *StatusNotifierItem (SNI)* specification to display microphone status in your desktop tray (KDE, Waybar tray, GNOME AppIndicator) with a quick context menu for switching presets, toggling mute/bypass, or launching the TUI.

You can manage the user services via `systemd`:

```bash
systemctl --user enable --now mvxd.service
systemctl --user enable --now mvx-tray.service
```
[/EN]

