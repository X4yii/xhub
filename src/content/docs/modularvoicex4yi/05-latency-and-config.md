---
title: "Latencia, Configuración y Diagnóstico"
project: "ModularVoiceX4yi"
category: "Arquitectura y Referencia"
categoryOrder: 2
order: 1
---

[ES]
# Latencia, Configuración TOML y Diagnóstico

---

## 1. Presupuesto de Latencia

MVX reporta en tiempo real la ecuación:

$$\text{Latencia Total} = \text{Latencia Base (PipeWire + Ring)} + \text{Latencia DSP}$$

### Latencia Base y Quantum de PipeWire
El daemon crea el nodo `mvx_mic` con:
```text
node.force-quantum = <quantum>
node.lock-quantum  = true
```
- **Quantum 256 (Por defecto):** $256 / 48000\,\text{Hz} = 5.33\,\text{ms}$ por bloque. Con un *pre-roll* estable de 2 bloques en el anillo, la latencia base ronda **~16 ms**.
- **Quantum 128 (Ultra baja latencia):** $128 / 48000\,\text{Hz} = 2.67\,\text{ms}$ por bloque (~8 ms base).

### Desglose por Etapa DSP

| Etapa | Latencia Añadida | Notas |
| :--- | :---: | :--- |
| **Bypass / Preset `Natural` (sin Pitch ni NR)** | **0.0 ms** | Solo filtros IIR/Biquad (EQ, HighPass, Compresor, Gate) con retardo de fase despreciable. |
| **Signalsmith Stretch — `Ultra` (1024)** | **21.33 ms** | Se activa solo si `pitch_semitones != 0` o `formant_semitones != 0`. |
| **Signalsmith Stretch — `Equilibrado` (2048)** | **42.67 ms** | Calidad por defecto cuando hay cambio de pitch/formantes. |
| **Signalsmith Stretch — `Alta` (4096)** | **85.33 ms** | Máxima resolución espectral. |
| **DeepFilterNet3 (`noise_reduction`)** | **30.00 ms** | Trama de 10 ms + 20 ms de *lookahead* STFT. |
| **Speaker Lock (`lookahead_ms`)** | **0 – 300 ms** | `0 ms` por defecto (el análisis CAM++ corre en paralelo fuera del hilo RT). |
| **EQ / Compresor / Reverb / Chorus / Limitador** | **0.0 ms** | Procesamiento muestra a muestra en el bloque actual. |

### Control de Pre-roll y Deriva de Reloj
Como la captura sigue el reloj del micrófono físico y la reproducción sigue el reloj de `mvx_mic`:
- Se mantiene un **pre-roll de 2 bloques** (512 muestras con quantum 256).
- Si el anillo supera **4 bloques** por deriva de reloj, el callback de reproducción descarta el exceso automáticamente para evitar que la latencia se acumule con las horas.

---

## 2. Archivos de Configuración (`~/.config/mvx/`)

### `~/.config/mvx/config.toml`
Almacena la configuración global del motor de audio, DSP y preferencias de interfaz:

```toml
version = 1

[audio]
input = "alsa_input.usb-Microphone"
virtual_source_name = "mvx_mic"
sample_rate = 48000
quantum = 256
gain_db = 0.0
mute = false
monitor_enabled = false
monitor_gain_db = 0.0

[dsp]
default_quality = "balanced"
speaker_analysis_hz = 4

[presets]
active = "natural"
```

### `~/.config/mvx/presets.toml`
Almacena la colección de presets (tanto los 14 integrados como tus presets personalizados o clonados):

```toml
version = 3

[[presets]]
id = "voz_grave"
name = "Voz grave"
builtin = true
pitch_semitones = -5.0
formant_semitones = -2.0
quality = "balanced"

[[presets.filters]]
type = "high_pass"
enabled = true
cutoff_hz = 85.0

[[presets.filters]]
type = "noise_reduction"
enabled = true
strength = 0.75

[[presets.filters]]
type = "equalizer"
enabled = true
low_db = 3.0
mid_db = -1.0
high_db = 1.5

[[presets.filters]]
type = "compressor"
enabled = true
threshold_db = -18.0
ratio = 3.0
attack_ms = 10.0
release_ms = 120.0
makeup_db = 2.0
```

---

## 3. Diagnóstico y Solución de Problemas (`mvx doctor`)

Si experimentas problemas de audio o quieres auditar el grafo de PipeWire, ejecuta:

```bash
mvx doctor
```

También puedes inspeccionar los nodos nativos con las herramientas de PipeWire:

```bash
pw-top                  # Ver uso de CPU, quantum y xruns en tiempo real
pw-cli info mvx_mic     # Inspeccionar propiedades del micrófono virtual
pw-cli info mvx.output  # Inspeccionar el stream de salida del daemon
pw-link -l              # Verificar enlaces FL/FR entre mvx.output y mvx_mic
```

### Significado de Contadores en `mvx doctor` y la TUI
- **`Clips` (`input_clip_count`):** Número de muestras que saturaron a `0 dBFS` en la entrada. Si sube al hablar fuerte, baja la ganancia física de tu micrófono o la ganancia del preset.
- **`xruns`:** Fallos al desencolar buffers del servidor PipeWire.
- **`underruns`:** Bloques de salida donde el anillo tenía menos muestras de las solicitadas (normal ver 1 o 2 al reconstruir el camino DSP cuando cambias la estructura de filtros).
- **`overflows`:** Veces que el anillo se llenó en captura antes de ser drenado por reproducción.
[/ES]

[EN]
# Latency, TOML Configuration & Diagnostics

---

## 1. Latency Budget

MVX computes and displays the real-time latency breakdown:

$$\text{Total Latency} = \text{Base Latency (PipeWire + Ring)} + \text{DSP Latency}$$

### Base Latency & PipeWire Quantum
The daemon creates the `mvx_mic` node with:
```text
node.force-quantum = <quantum>
node.lock-quantum  = true
```
- **Quantum 256 (Default):** $256 / 48000\,\text{Hz} = 5.33\,\text{ms}$ per block. With a steady 2-block ring pre-roll, base bridge latency sits around **~16 ms**.
- **Quantum 128 (Ultra-Low Latency):** $128 / 48000\,\text{Hz} = 2.67\,\text{ms}$ per block (~8 ms base).

### Per-Stage DSP Latency Breakdown

| Stage | Added Latency | Notes |
| :--- | :---: | :--- |
| **Bypass / `Natural` Preset (no Pitch or NR)** | **0.0 ms** | Time-domain Biquad/IIR filters (EQ, HighPass, Compressor, Gate) add zero frame buffering. |
| **Signalsmith Stretch — `Ultra` (1024)** | **21.33 ms** | Active only when `pitch_semitones != 0` or `formant_semitones != 0`. |
| **Signalsmith Stretch — `Balanced` (2048)** | **42.67 ms** | Default quality profile when pitch/formant shifting is active. |
| **Signalsmith Stretch — `High` (4096)** | **85.33 ms** | Maximum spectral resolution. |
| **DeepFilterNet3 (`noise_reduction`)** | **30.00 ms** | 10 ms frame size + 20 ms STFT lookahead. |
| **Speaker Lock (`lookahead_ms`)** | **0 – 300 ms** | `0 ms` by default (CAM++ speaker verification runs asynchronously out-of-thread). |
| **EQ / Compressor / Reverb / Chorus / Limiter** | **0.0 ms** | Sample-by-sample in-place processing. |

### Pre-Roll Management & Clock Drift
Because the capture stream follows the physical hardware clock while the playback stream follows the `mvx_mic` driver clock:
- MVX maintains a **2-block pre-roll** (512 frames at quantum 256).
- If the ring buffer exceeds **4 blocks** due to clock drift, the playback callback automatically trims excess samples back to 2 blocks so latency never creeps up over long sessions.

---

## 2. Configuration Files (`~/.config/mvx/`)

### `~/.config/mvx/config.toml`
Stores global audio engine, DSP, and UI settings:

```toml
version = 1

[audio]
input = "alsa_input.usb-Microphone"
virtual_source_name = "mvx_mic"
sample_rate = 48000
quantum = 256
gain_db = 0.0
mute = false
monitor_enabled = false
monitor_gain_db = 0.0

[dsp]
default_quality = "balanced"
speaker_analysis_hz = 4

[presets]
active = "natural"
```

### `~/.config/mvx/presets.toml`
Stores all voice presets (both the 14 built-in presets and custom/cloned profiles):

```toml
version = 3

[[presets]]
id = "voz_grave"
name = "Voz grave"
builtin = true
pitch_semitones = -5.0
formant_semitones = -2.0
quality = "balanced"

[[presets.filters]]
type = "high_pass"
enabled = true
cutoff_hz = 85.0

[[presets.filters]]
type = "noise_reduction"
enabled = true
strength = 0.75

[[presets.filters]]
type = "equalizer"
enabled = true
low_db = 3.0
mid_db = -1.0
high_db = 1.5

[[presets.filters]]
type = "compressor"
enabled = true
threshold_db = -18.0
ratio = 3.0
attack_ms = 10.0
release_ms = 120.0
makeup_db = 2.0
```

---

## 3. Diagnostics & Troubleshooting (`mvx doctor`)

To verify your audio setup or inspect the PipeWire graph health, run:

```bash
mvx doctor
```

You can also inspect the low-level PipeWire nodes directly:

```bash
pw-top                  # Inspect live CPU usage, quantum, and xruns
pw-cli info mvx_mic     # Inspect virtual microphone properties
pw-cli info mvx.output  # Inspect daemon playback stream
pw-link -l              # Verify explicit FL/FR links between mvx.output and mvx_mic
```

### Understanding Counters in `mvx doctor` & TUI
- **`Clips` (`input_clip_count`):** Cumulative samples that hit `0 dBFS` full scale. If this increases while speaking loudly, lower your physical microphone gain or preset gain.
- **`xruns`:** Stream buffer dequeue failures reported by PipeWire.
- **`underruns`:** Playback callbacks where the ring buffer had fewer samples than requested (1 or 2 underruns are expected during brief DSP graph rebuilds when toggling structural filters).
- **`overflows`:** Capture callbacks where the ring buffer was full prior to playback draining.
[/EN]

