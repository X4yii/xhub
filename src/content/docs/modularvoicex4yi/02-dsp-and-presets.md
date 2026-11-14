---
title: "Rack DSP, Filtros y Presets"
project: "ModularVoiceX4yi"
category: "Motor de Audio y Efectos"
categoryOrder: 1
order: 0
---

[ES]
# Rack DSP, Filtros y Presets

El motor de procesamiento digital de señales (`mvx-audio`) ejecuta una cadena modular de filtros a **48 kHz en punto flotante (`f32`)** dentro del hilo de captura de PipeWire sin realizar asignaciones de memoria (*zero-allocation*), bloqueos (*lock-free*) ni llamadas al sistema.

---

## 1. Perfiles de Calidad DSP y Pitch/Formantes

El cambio de tono (*pitch*) y de tracto vocal (*formantes*) utiliza **Signalsmith Stretch** con límite de tonalidad ajustado a 8 kHz. Si un preset tiene `pitch_semitones = 0.0` y `formant_semitones = 0.0`, la etapa de Stretch se omite automáticamente y **añade 0 ms de latencia**.

| Perfil de Calidad | Tamaño de Bloque | Intervalo | Latencia DSP (Stretch) | Caso de Uso |
| :--- | :---: | :---: | :---: | :--- |
| **`Ultra`** | 1024 muestras | 256 | ~21.3 ms | Monitoreo en vivo (*Sidetone*) y gaming competitivo. |
| **`Equilibrado`** (`Balanced`) | 2048 muestras | 512 | ~42.7 ms | Balance ideal entre claridad vocal y baja latencia (Por defecto). |
| **`Alta`** (`High`) | 4096 muestras | 1024 | ~85.3 ms | Máxima preservación de armónicos en desplazamientos extremos. |

---

## 2.Los 14 Módulos del Rack DSP (`FilterConfig`)

Cada preset en `~/.config/mvx/presets.toml` define su lista de filtros (`[[presets.filters]]`). Todos los parámetros numéricos se suavizan exponencialmente en tiempo real para evitar chasquidos audibles al mover controles:

| Tipo (`type`) | Parámetros Configurables | Descripción Técnica |
| :--- | :--- | :--- |
| **`noise_reduction`** | `strength` (`0.0` a `1.0`) | Supresión neuronal **DeepFilterNet3** combinada con expansor descendente. |
| **`speaker_lock`** | `profile`, `threshold` (`0.0`–`1.0`), `hold_ms`, `lookahead_ms` | Compuerta biométrica (**CAM++** + **Silero VAD**) que silencia voces ajenas. |
| **`neural_voice`** | `target_name`, `embedding` (256 floats), `tau` (`0.0`–`1.0`) | `[ALPHA]` Conversión de timbre neuronal en vivo con **OpenVoice V2**. |
| **`high_pass`** | `cutoff_hz` (`20.0` a `1000.0` Hz) | Filtro Biquad paso-alto ($Q = 0.707$) para eliminar retumbos graves y golpes de mesa. |
| **`noise_gate`** | `threshold_db` (`-90` a `0` dB), `attack_ms`, `release_ms` | Puerta de ruido clásica con histéresis suave para silencios limpios. |
| **`equalizer`** | `low_db`, `mid_db`, `high_db` (`-24` a `+24` dB) | EQ de 3 bandas: *Low Shelf* (120 Hz), *Peaking* (1800 Hz, $Q=1.0$) y *High Shelf* (8000 Hz). |
| **`compressor`** | `threshold_db`, `ratio` (`1:1`–`20:1`), `attack_ms`, `release_ms`, `makeup_db` | Compresor de rango dinámico para nivelar susurros y gritos. |
| **`humanizer`** | `depth_cents` (`0`–`50`), `rate_hz` (`0.1`–`10` Hz) | Micro-modulación LFO de tono para dar calidez orgánica a voces procesadas. |
| **`chorus`** | `rate_hz` (`0.1`–`10` Hz), `depth_ms` (`0.1`–`20` ms), `mix` (`0`–`1`) | Línea de retardo modulada para engrosar la voz o crear efectos etéreos. |
| **`robotizer`** | `frequency_hz` (`30`–`1000` Hz), `mix` (`0`–`1`) | Síntesis robótica bloqueando la fase tonal a una frecuencia fija. |
| **`ring_mod`** | `frequency_hz` (`10`–`2000` Hz), `mix` (`0`–`1`) | Modulación en anillo multiplicativa para timbres metálicos, cibernéticos o de radio demonio. |
| **`distortion`** | `drive` (`1.0`–`30.0`), `crush_bits` (`1`–`16`), `mix` (`0`–`1`) | Saturación no lineal combinada con reducción de profundidad de bits (*bitcrusher*). |
| **`reverb`** | `room_size` (`0`–`1`), `damping` (`0`–`1`), `mix` (`0`–`1`) | Reverberación algorítmica *Freeverb* (filtros comb + all-pass) para simular salas o cavernas. |
| **`gain`** | `gain_db` (`-60` a `+24` dB) | Ajuste de ganancia específica del preset antes del limitador maestro de seguridad. |

Además, toda la cadena cuenta con un **filtro subsónico fijo a 85 Hz** y un **limitador de seguridad (*brickwall soft-clipper*)** al final para impedir distorsión digital.

---

## 3. Los 14 Presets Integrados

MVX incluye 14 perfiles de fábrica (*built-in*) que puedes personalizar libremente y restaurar a sus valores originales en cualquier momento desde la TUI o con IPC (`reset_preset`):

1. **`natural` (Natural):** Voz limpia con reducción de ruido neuronal, filtro paso-alto y compresión suave de estudio.
2. **`broadcast` (Locutor / Podcast):** Cuerpo grave reforzado, presencia media-alta y compresión cálida estilo radio FM.
3. **`voz_grave` (Voz Grave):** Desplazamiento de tono (`-5.0 st`) y formantes (`-2.0 st`) manteniendo articulación natural.
4. **`voz_ardilla` (Voz de Ardilla):** Tono elevado (`+7.0 st`) y formantes desplazados hacia arriba para efecto cómico agudo.
5. **`titan` (Titán Colosal):** Voz profunda extrema con refuerzo sub-grave, compresión pesada y reverberación de cámara.
6. **`cyborg` (Cyborg):** Combinación de *Robotizer*, *Chorus* metálico y recorte de bandas.
7. **`police_radio` (Radio Policial):** Paso-alto agresivo, recorte de agudos, compresión dura y distorsión *bitcrush* de walkie-talkie.
8. **`megaphone` (Megáfono):** Banda media muy pronunciada con saturación de bocina y eco corto.
9. **`cave_echo` (Eco de Caverna):** Reverberación amplia con *room_size* alto y amortiguación progresiva.
10. **`anonymous` (Anónimo):** Desplazamiento de pitch y formantes diseñado para ocultar la identidad vocal sin perder inteligibilidad.
11. **`alien` (Alienígena):** Modulación en anillo (*RingMod*) combinada con desplazamiento de formantes y *Chorus* profundo.
12. **`telephone` (Teléfono Antiguo):** Ancho de banda telefónico clásico (300 Hz – 3.4 kHz) con ligera saturación.
13. **`helium` (Helio):** Formantes muy agudos con tono elevado que simula inhalación de gas helio.
14. **`radio_demon` (Demonio de Radio):** Tono grave combinado con *RingMod*, filtro de radio vintage y saturación armónica.

---

## 4. Soundboard y Loop Tester

### Soundboard (`~/.local/share/mvx/sounds/`)
Al iniciar, MVX genera automáticamente 4 efectos sintetizados de alta calidad en `~/.local/share/mvx/sounds/`:
- `airhorn.wav` — Bocina de estadio (acorde de Si bemol con sobretonos armónicos).
- `bleep.wav` — Tono de censura estándar a 1000 Hz.
- `chime.wav` — Campana brillante de notificación.
- `buzzer.wav` — Zumbador grave de error.

Puedes colocar cualquier archivo **`.wav`** (PCM de 8/16/24/32 bits o IEEE Float, a cualquier frecuencia de muestreo) en `~/.local/share/mvx/sounds/` y MVX lo decodificará y remuestreará automáticamente a 48 kHz para dispararlo desde la TUI o con `mvx ctl sound <nombre_archivo_sin_wav>`.

### Loop Tester y Sidetone
- **Loop Tester:** Permite grabar hasta **8 segundos** de tu voz y reproducirlos en bucle continuo a través de la cadena DSP activa. Así puedes ajustar el ecualizador, compresor, pitch o formantes mientras escuchas exactamente cómo afectan a tu voz.
- **Sidetone (Monitoreo en Vivo):** Envía una copia de la salida procesada directamente a tus auriculares con ganancia independiente (`monitor_gain_db`).
[/ES]

[EN]
# DSP Rack, Filters & Presets

The digital signal processing engine (`mvx-audio`) runs a modular filter chain at **48 kHz floating-point (`f32`)** directly inside the PipeWire capture callback with **zero heap allocations, zero locks, and zero system calls**.

---

## 1. DSP Quality Profiles & Pitch/Formants

Pitch and vocal tract (*formant*) shifting are powered by **Signalsmith Stretch** with a tonality limit tuned to 8 kHz. When a preset has both `pitch_semitones = 0.0` and `formant_semitones = 0.0`, the Stretch stage is automatically bypassed, **adding 0 ms of DSP latency**.

| Quality Profile | Block Size | Interval | DSP Latency (Stretch) | Recommended Use Case |
| :--- | :---: | :---: | :---: | :--- |
| **`Ultra`** | 1024 samples | 256 | ~21.3 ms | Live headphone monitoring (*Sidetone*) and competitive gaming. |
| **`Balanced`** (`Equilibrado`) | 2048 samples | 512 | ~42.7 ms | Optimal balance between vocal clarity and low latency (Default). |
| **`High`** (`Alta`) | 4096 samples | 1024 | ~85.3 ms | Maximum harmonic preservation on extreme pitch/formant shifts. |

---

## 2. The 14 DSP Rack Modules (`FilterConfig`)

Each preset in `~/.config/mvx/presets.toml` defines an ordered filter chain (`[[presets.filters]]`). All continuous parameters undergo exponential smoothing inside the audio callback to eliminate zipper noise when dragging sliders:

| Filter Type (`type`) | Configurable Parameters | Technical Description |
| :--- | :--- | :--- |
| **`noise_reduction`** | `strength` (`0.0` to `1.0`) | **DeepFilterNet3** neural denoiser paired with a downward expander. |
| **`speaker_lock`** | `profile`, `threshold` (`0.0`–`1.0`), `hold_ms`, `lookahead_ms` | Biometric speaker gate (**CAM++** + **Silero VAD**) that blocks background speakers. |
| **`neural_voice`** | `target_name`, `embedding` (256 floats), `tau` (`0.0`–`1.0`) | `[ALPHA]` Live neural timbre transfer powered by **OpenVoice V2**. |
| **`high_pass`** | `cutoff_hz` (`20.0` to `1000.0` Hz) | Biquad high-pass filter ($Q = 0.707$) to cut low-end rumble and desk thumps. |
| **`noise_gate`** | `threshold_db` (`-90` to `0` dB), `attack_ms`, `release_ms` | Smooth envelope noise gate for dead-silent pauses. |
| **`equalizer`** | `low_db`, `mid_db`, `high_db` (`-24` to `+24` dB) | 3-band Biquad EQ: *Low Shelf* (120 Hz), *Peaking* (1800 Hz, $Q=1.0$), and *High Shelf* (8000 Hz). |
| **`compressor`** | `threshold_db`, `ratio` (`1:1`–`20:1`), `attack_ms`, `release_ms`, `makeup_db` | Dynamic range compressor to keep whispers and shouts at a consistent level. |
| **`humanizer`** | `depth_cents` (`0`–`50`), `rate_hz` (`0.1`–`10` Hz) | Subtle LFO pitch micro-modulation to add organic warmth to synthesized voices. |
| **`chorus`** | `rate_hz` (`0.1`–`10` Hz), `depth_ms` (`0.1`–`20` ms), `mix` (`0`–`1`) | Modulated delay line to thicken vocals or create ethereal doubling effects. |
| **`robotizer`** | `frequency_hz` (`30`–`1000` Hz), `mix` (`0`–`1`) | Robotic pitch-locked phase synthesis at a fixed carrier frequency. |
| **`ring_mod`** | `frequency_hz` (`10`–`2000` Hz), `mix` (`0`–`1`) | Multiplicative ring modulation for metallic, cybernetic, or radio-demon timbres. |
| **`distortion`** | `drive` (`1.0`–`30.0`), `crush_bits` (`1`–`16`), `mix` (`0`–`1`) | Soft-clipping overdrive combined with a configurable *bitcrusher*. |
| **`reverb`** | `room_size` (`0`–`1`), `damping` (`0`–`1`), `mix` (`0`–`1`) | Algorithmic *Freeverb* (parallel comb + series all-pass filters) for room and cave acoustics. |
| **`gain`** | `gain_db` (`-60` to `+24` dB) | Per-preset makeup gain stage applied before the master safety limiter. |

Additionally, the pipeline includes an always-on **85 Hz subsonic filter** and a final **brickwall safety limiter** to prevent digital clipping.

---

## 3. The 14 Built-in Presets

MVX ships with 14 factory presets that can be freely customized and restored to defaults at any time from the TUI or via IPC (`reset_preset`):

1. **`natural` (Natural):** Clean voice with neural noise suppression, high-pass filtering, and gentle studio compression.
2. **`broadcast` (Broadcast / Podcast):** Boosted low-end warmth, crisp presence, and FM-style dynamic compression.
3. **`voz_grave` (Deep Voice):** Pitch (`-5.0 st`) and formant (`-2.0 st`) downward shift preserving natural articulation.
4. **`voz_ardilla` (Chipmunk / Squirrel):** High pitch (`+7.0 st`) and upward formant shift for classic high-pitched comedy.
5. **`titan` (Colossal Titan):** Ultra-deep pitch with sub-bass enhancement, heavy compression, and chamber reverb.
6. **`cyborg` (Cyborg):** Blend of *Robotizer*, metallic *Chorus*, and band-pass sculpting.
7. **`police_radio` (Police Dispatcher):** Steep high-pass, treble roll-off, hard compression, and walkie-talkie *bitcrush* distortion.
8. **`megaphone` (Megaphone):** Narrow mid-band boost with horn overdrive and short slapback reverb.
9. **`cave_echo` (Cave Echo):** Expansive reverb with high *room_size* and progressive high-frequency damping.
10. **`anonymous` (Anonymous):** Pitch and formant anonymization tuned to mask speaker identity while staying clear.
11. **`alien` (Alien):** *RingMod* carrier blended with shifted formants and deep *Chorus*.
12. **`telephone` (Vintage Telephone):** Classic narrow-band telephone frequency response (300 Hz – 3.4 kHz) with light saturation.
13. **`helium` (Helium):** Strongly raised formants and pitch simulating helium inhalation.
14. **`radio_demon` (Radio Demon):** Lowered pitch paired with *RingMod*, vintage radio EQ, and harmonic drive.

---

## 4. Soundboard & Loop Tester

### Soundboard (`~/.local/share/mvx/sounds/`)
On first launch, MVX automatically synthesizes 4 built-in sound effects in `~/.local/share/mvx/sounds/`:
- `airhorn.wav` — Stadium airhorn (B-flat chord with harmonic overtones).
- `bleep.wav` — Standard 1000 Hz censor bleep.
- `chime.wav` — Bright notification chime.
- `buzzer.wav` — Deep error buzzer.

You can drop any custom **`.wav`** file (8/16/24/32-bit PCM or IEEE Float, any sample rate) into `~/.local/share/mvx/sounds/`. MVX automatically decodes and resamples it to 48 kHz so you can trigger it from the TUI or via `mvx ctl sound <filename_without_wav>`.

### Loop Tester & Sidetone
- **Loop Tester:** Records up to **8 seconds** of your raw voice and loops it continuously through the live DSP chain, letting you fine-tune EQ, compression, pitch, and formants hands-free.
- **Sidetone (Live Monitor):** Routes a low-latency copy of the processed output directly to your headphones with independent gain control (`monitor_gain_db`).
[/EN]

