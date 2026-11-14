---
title: "IA: Ruido, Biometría y Clonación"
project: "ModularVoiceX4yi"
category: "Motor de Audio y Efectos"
categoryOrder: 1
order: 1
---

[ES]
# IA: Supresión de Ruido, Biometría y Clonación

MVX integra tres subsistemas de inteligencia artificial ejecutados localmente en CPU mediante `deep_filter_rt`, `sherpa-onnx` y `tract-onnx`, sin enviar audio a la nube.

---

## 1. Supresión de Ruido Neuronal (`DeepFilterNet3`)

A diferencia de las puertas de ruido clásicas o filtros espectrales por sustracción que distorsionan la voz cuando tecleas mientras hablas, MVX utiliza **DeepFilterNet3** compilado sobre `tract`:

- **Procesamiento Streaming 1:1:** Trabaja sobre tramas de **480 muestras (10 ms a 48 kHz)** con un *lookahead* de 2 tramas (**30 ms de latencia total**).
- **Control de Intensidad (`strength`):** Permite mezclar de forma continua (`0.0` a `1.0`) entre la señal limpia neuronal y el ambiente original, complementado por un expansor descendente suave (`DownwardExpander` a `-38 dB`).

---

## 2. Biometría Vocal ("Solo mi voz" / `SpeakerLock`)

El filtro `speaker_lock` evita que se filtren voces de otras personas en la misma habitación, televisión de fondo o conversaciones cercanas.

### Arquitectura fuera del hilo RT
Para garantizar que la inferencia ONNX jamás cause cortes (*xruns*) en PipeWire:
1. El callback de captura envía copias mono por un anillo libre de bloqueos (`rtrb::RingBuffer`) hacia el **Worker de Hablante** en un hilo dedicado.
2. El worker acumula bloques de 100 ms y remuestrea de **48 kHz a 16 kHz**.
3. Ejecuta **Silero VAD** (*Voice Activity Detection*) para detectar presencia de voz humana.
4. Mantiene una ventana deslizante de **0.5 segundos** y, 4 veces por segundo (`speaker_analysis_hz = 4`), extrae un vector de identidad vocal con el modelo **CAM++** (`sherpa-onnx`).
5. Calcula la **similitud coseno** contra tu perfil enrolado y publica el resultado (`score`, `vad`, `target`) mediante variables atómicas (`AtomicBool` / `AtomicU32`) que la compuerta del hilo RT lee al instante.

### Parámetros de la Compuerta Biométrica

| Parámetro | Por Defecto | Rango | Función |
| :--- | :---: | :---: | :--- |
| **`profile`** | `""` | Nombre | Nombre del perfil de voz guardado en `~/.local/share/mvx/profiles/`. |
| **`threshold`** | `0.72` | `0.0` – `1.0` | Similitud coseno mínima requerida para abrir el micrófono. |
| **`hold_ms`** | `300` ms | `0` – `3000` ms | Tiempo que la compuerta permanece abierta tras la última coincidencia válida. |
| **`lookahead_ms`** | `0` ms | `0` – `500` ms | Retrasa el audio para alinear la apertura de la compuerta antes del inicio de la sílaba (0 ms por defecto para no añadir latencia). |

### Cómo Enrolar tu Voz
1. Ejecuta `mvx models install` si aún no descargaste los modelos `CAM++` y `Silero VAD`.
2. En la TUI, abre la sección **Identidad de Voz / Speaker Lock** y selecciona **Enrolar Nueva Voz** (o envía el comando IPC `enroll_voice` con duración de 10 segundos).
3. Habla de forma continua durante 10 segundos. MVX promediará los embeddings de las ventanas con voz activa y guardará tu huella vocal.

---

## 3. Clonación Neuronal de Timbre `[ALPHA]` (`OpenVoice V2`)

> [!WARNING]
> **Estado Experimental (ALPHA):** La transferencia neuronal de timbre en vivo con **OpenVoice V2** requiere uso intensivo de CPU, añade latencia (~250 ms+) y la similitud depende de la limpieza de la muestra de origen.

### Flujo de Análisis y Clonación (`mvx clone`)

Puedes clonar una voz desde la TUI o directamente por terminal:

```bash
mvx clone ~/Descargas/muestra_voz.ogg --name "Mi Clon"
```

*(Nota: El resolvedor de rutas de MVX expande `~` y corrige mayúsculas/minúsculas en carpetas como `~/descargas` -> `~/Descargas` automáticamente).*

Cuando cargas una muestra (`.wav`, `.mp3`, `.ogg` o `.flac`), MVX realiza dos procesos automáticos:

1. **Estimación Acústica ($F_0$, Formantes y Balance Espectral):**
   - Decodifica la muestra con `ffmpeg` a 16 kHz mono.
   - Ejecuta autocorrelación con prevención de salto de octava sobre segmentos sonoros ($\text{RMS} \ge 0.030$) entre 65 Hz y 400 Hz para hallar la mediana de la frecuencia fundamental ($F_0$).
   - Calcula automáticamente el desplazamiento sugerido de **Pitch** ($\Delta \text{st} = 12 \log_2(F_0 / 175\,\text{Hz})$) y **Formantes** ($0.65 \times \Delta \text{st}$).
   - Estima la distribución de energía en bandas baja, media y alta mediante tasa de cruces por cero (*ZCR*) para preconfigurar el **EQ de 3 bandas**.
2. **Extracción e Inferencia de Timbre (`NeuralVoiceConverter`):**
   - Calcula el espectrograma STFT de magnitud lineal a **22,050 Hz** (`N_FFT = 1024`, `HOP = 256`, ventana Hann periódica con *reflect padding* de 384 muestras, 513 bins).
   - Ejecuta `openvoice/tone_extract.onnx` mediante `tract-onnx` para extraer el **embedding de color tonal de 256 dimensiones**, guardándolo en `~/.local/share/mvx/voices/<nombre>.json`.
   - Durante la conversión activa (`neural_voice`), ejecuta `openvoice/tone_color.onnx` transfiriendo tu timbre de origen (`src_tone`) hacia el timbre objetivo (`dest_tone`) regulado por el factor `tau` (`similarity_blend`).
[/ES]

[EN]
# AI: Noise Suppression, Biometrics & Voice Cloning

MVX integrates three local CPU-based neural subsystems powered by `deep_filter_rt`, `sherpa-onnx`, and `tract-onnx`—zero cloud dependencies required.

---

## 1. Neural Noise Suppression (`DeepFilterNet3`)

Unlike traditional noise gates or spectral subtraction filters that warble your voice when typing on a mechanical keyboard while speaking, MVX runs **DeepFilterNet3** compiled via `tract`:

- **1:1 Streaming Pipeline:** Processes **480-sample frames (10 ms at 48 kHz)** with a 2-frame lookahead (**30 ms total algorithmic delay**).
- **Continuous Strength Control (`strength`):** Smoothly blends (`0.0` to `1.0`) between the neural denoised signal and raw audio, paired with a gentle downward expander (`DownwardExpander` at `-38 dB`).

---

## 2. Vocal Biometrics ("My Voice Only" / `SpeakerLock`)

The `speaker_lock` filter prevents background speakers in the same room, TV audio, or nearby conversations from bleeding into your microphone.

### Out-of-RT Worker Architecture
To guarantee that ONNX inference never causes audio dropouts (*xruns*) on the PipeWire real-time thread:
1. The RT capture callback pushes mono samples into a lock-free ring buffer (`rtrb::RingBuffer`) consumed by a dedicated **Speaker Worker** thread.
2. The worker accumulates 100 ms chunks and linearly resamples from **48 kHz down to 16 kHz**.
3. It runs **Silero VAD** (*Voice Activity Detection*) to detect active human speech.
4. It maintains a **0.5-second** sliding window and, 4 times per second (`speaker_analysis_hz = 4`), computes a speaker embedding using the **CAM++** model (`sherpa-onnx`).
5. It calculates the **cosine similarity** against your enrolled profile and publishes the state (`score`, `vad`, `target`) via lock-free atomics (`AtomicBool` / `AtomicU32`) read by the RT gate.

### Biometric Gate Parameters

| Parameter | Default | Range | Description |
| :--- | :---: | :---: | :--- |
| **`profile`** | `""` | String | Name of the enrolled voice profile stored in `~/.local/share/mvx/profiles/`. |
| **`threshold`** | `0.72` | `0.0` – `1.0` | Minimum cosine similarity required to open the microphone gate. |
| **`hold_ms`** | `300` ms | `0` – `3000` ms | Time the gate stays open after the last valid speaker match. |
| **`lookahead_ms`** | `0` ms | `0` – `500` ms | Delays audio in a circular buffer so the gate opens *before* the syllable starts (defaults to 0 ms for zero extra latency). |

### Enrolling Your Voice Profile
1. Run `mvx models install` if you haven't downloaded the `CAM++` and `Silero VAD` models yet.
2. In the TUI, navigate to **Voice Identity / Speaker Lock** and trigger **Enroll Voice** (or send the `enroll_voice` IPC request for 10 seconds).
3. Speak naturally for 10 seconds. MVX averages the voiced embeddings and saves your biometric profile.

---

## 3. Neural Timbre Cloning `[ALPHA]` (`OpenVoice V2`)

> [!WARNING]
> **Experimental Status (ALPHA):** Live neural timbre transfer using **OpenVoice V2** is CPU-intensive, introduces noticeable latency (~250 ms+), and output quality depends heavily on a clean reference sample.

### Analysis & Cloning Workflow (`mvx clone`)

You can clone a voice from the TUI or directly via the CLI:

```bash
mvx clone ~/Downloads/voice_sample.ogg --name "My Clone"
```

*(Note: MVX's path resolver automatically expands `~` and performs case-insensitive parent directory matching).*

When you load a reference sample (`.wav`, `.mp3`, `.ogg`, or `.flac`), MVX performs two automated stages:

1. **Acoustic Estimation ($F_0$, Formants & Spectral Balance):**
   - Decodes the audio via `ffmpeg` to 16 kHz mono.
   - Runs autocorrelation with octave-halving prevention across voiced frames ($\text{RMS} \ge 0.030$) between 65 Hz and 400 Hz to find the median fundamental frequency ($F_0$).
   - Automatically computes suggested **Pitch Offset** ($\Delta \text{st} = 12 \log_2(F_0 / 175\,\text{Hz})$) and **Formant Offset** ($0.65 \times \Delta \text{st}$).
   - Estimates low, mid, and high spectral energy ratios via Zero-Crossing Rate (*ZCR*) to pre-populate the **3-band EQ**.
2. **Timbre Embedding Extraction & Conversion (`NeuralVoiceConverter`):**
   - Computes a linear magnitude STFT spectrogram at **22,050 Hz** (`N_FFT = 1024`, `HOP = 256`, periodic Hann window with 384-sample reflect padding, 513 frequency bins).
   - Runs `openvoice/tone_extract.onnx` via `tract-onnx` to extract a **256-dimensional tone color embedding**, saving it to `~/.local/share/mvx/voices/<name>.json`.
   - When the `neural_voice` filter is active, runs `openvoice/tone_color.onnx` to convert your source timbre (`src_tone`) toward the target embedding (`dest_tone`) scaled by `tau` (`similarity_blend`).
[/EN]

