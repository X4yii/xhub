---
title: "Arquitectura Interna, PipeWire e IPC"
project: "ModularVoiceX4yi"
category: "Arquitectura y Referencia"
categoryOrder: 2
order: 0
---

[ES]
# Arquitectura Interna, PipeWire e IPC

MVX está estructurado como un *workspace* modular de 6 crates en Rust donde el daemon `mvxd` es el propietario exclusivo del grafo de audio y del estado persistente, mientras que la TUI y el tray operan como clientes ligeros sin estado que pueden abrirse o cerrarse sin interrumpir el flujo de voz.

---

## 1. Estructura del Workspace (Crates)

| Crate | Rol Principal |
| :--- | :--- |
| **`mvx-core`** | Tipos compartidos (`Snapshot`, `SharedState`, `Config`), sistema de 14 presets (`presets.rs`), analizador acústico de clonación (`clone.rs`) y sintetizador/decodificador del Soundboard (`soundboard.rs`). |
| **`mvx-audio`** | Motor de audio PipeWire (`engine.rs`), cadena DSP en tiempo real (`dsp.rs`), worker biométrico CAM++ (`speaker.rs`) y conversor neuronal OpenVoice V2 (`neural_vc.rs`). |
| **`mvx-ipc`** | Protocolo JSON delimitado por líneas sobre `UnixStream` (`Request`, `Response`, `Client`). |
| **`mvxd`** | Daemon principal en segundo plano. Orquesta el *main loop* de PipeWire, el servidor IPC y la persistencia. |
| **`mvx-tui`** | Binario `mvx`. Incluye tanto la interfaz interactiva en terminal (`ratatui`) como todos los subcomandos CLI (`ctl`, `doctor`, `status`, `clone`, `models`). |
| **`mvx-tray`** | Cliente de bandeja del sistema Linux basado en el estándar *StatusNotifierItem (SNI) / ksni*. |

---

## 2. Topología del Grafo en PipeWire

```text
┌─────────────────────────────────────────────────────────────────────┐
│ mvxd (daemon)                                                       │
│                                                                     │
│  Socket Unix IPC ──► Canal AudioCommand                             │
│       ▲                   │                                         │
│       │                   ▼                                         │
│  mvx / mvx-tray     PipeWire Main Loop                              │
│                     ├── mvx.capture stream (48 kHz, F32LE)          │
│                     ├── DspChain -> rtrb::RingBuffer<f32>           │
│                     ├── mvx.output stream                           │
│                     ├── link-factory explícito FL/FR                │
│                     └── mvx_mic (Audio/Source/Virtual)              │
│                                                                     │
│  Workers fuera del hilo RT:                                         │
│    • Speaker Worker (ring SPSC -> 48k→16k -> VAD -> CAM++)          │
│    • Neural VC Worker (OpenVoice V2 STFT / tract-onnx)              │
└─────────────────────────────────────────────────────────────────────┘
```

### Flujo de la Cadena de Audio

1. **Nodo Virtual Nativo (`mvx_mic`):**
   El daemon crea un nodo nativo en PipeWire sin depender de `pw-loopback` ni `pactl`:
   ```text
   factory.name   = support.null-audio-sink
   media.class    = Audio/Source/Virtual
   node.name      = mvx_mic
   audio.position = FL,FR
   ```
2. **Stream de Captura (`mvx.capture`):**
   Se conecta al micrófono físico seleccionado usando `target.object` + `AUTOCONNECT` con el flag `PW_STREAM_FLAG_RT_PROCESS`.
   - Convierte la entrada a mono, alimenta el anillo SPSC del worker biométrico y procesa la señal por `DspChain`.
   - Mezcla clips activos del Soundboard o del Loop Tester y escribe muestras estéreo intercaladas (`L/R`) en un `rtrb::RingBuffer<f32>`.
3. **Stream de Salida (`mvx.output`) y Enlace Explícito:**
   - **No** utiliza autoconnect para evitar que WirePlumber envíe tu micrófono a tus altavoces por error.
   - En su lugar, `mvxd` escucha el `Registry` de PipeWire y crea dos objetos `link-factory` explícitos conectando `mvx.output:output_FL/FR` hacia `mvx_mic:input_FL/FR`.
   - Si además activas **Sidetone (`monitor_enabled`)**, un stream adicional envía el audio procesado al dispositivo de salida por defecto.

---

## 3. Garantías de Tiempo Real (RT-Safety)

- Los callbacks de captura y reproducción corren con `PW_STREAM_FLAG_RT_PROCESS`.
- **Cero allocs/locks en RT:** Todos los buffers (`scratch`, `pitch_out`, líneas de retardo de Reverb/Chorus y lookahead) se pre-asignan al construir `DspChain`.
- La telemetría (picos, RMS, reducción de ganancia, 8 bandas de espectro y contadores de clipping) se publica hacia `SharedState` exclusivamente mediante operaciones atómicas `Ordering::Relaxed` (`AtomicU32` / `AtomicU64`).

---

## 4. Protocolo IPC (`$XDG_RUNTIME_DIR/mvx/mvxd.sock`)

El socket Unix se crea con permisos `0600`. Cada petición (`Request`) y respuesta (`Response`) es un objeto JSON en una sola línea terminada en `\n`:

### Ejemplos de Peticiones (`Request`)

```json
{"cmd":"hello","protocol":1}
{"cmd":"get_state"}
{"cmd":"set_input","name":"alsa_input.usb-Microphone"}
{"cmd":"set_gain","gain_db":-3.0}
{"cmd":"set_mute","mute":true}
{"cmd":"set_bypass","bypass":false}
{"cmd":"set_monitor","enabled":true,"gain_db":-6.0}
{"cmd":"apply_preset","id":"voz_grave"}
{"cmd":"upsert_preset","preset":{...},"activate":true}
{"cmd":"delete_preset","id":"custom_1"}
{"cmd":"reset_preset","id":"voz_grave"}
{"cmd":"trigger_sound","id":"airhorn"}
{"cmd":"stop_sounds"}
{"cmd":"start_loop_record"}
{"cmd":"stop_loop_test"}
{"cmd":"enroll_voice","name":"mi_voz","seconds":10}
{"cmd":"delete_voice","name":"mi_voz"}
{"cmd":"clone_voice_validate","audio_path":"~/muestra.ogg"}
{"cmd":"clone_voice_save","session":{...}}
{"cmd":"reset_config","target":"all"}
{"cmd":"install_models"}
{"cmd":"reload_audio"}
{"cmd":"ping"}
{"cmd":"shutdown"}
```

### Respuestas (`Response`)

- `{"kind":"hello","version":"1.0.0","protocol":1}`
- `{"kind":"state","state":{ ...Snapshot completo... }}`
- `{"kind":"ok"}`
- `{"kind":"pong"}`
- `{"kind":"error","message":"descripción del error"}`
[/ES]

[EN]
# Internal Architecture, PipeWire & IPC

MVX is structured as a modular 6-crate Rust workspace where the `mvxd` daemon is the sole owner of the PipeWire audio graph and persistent state, while the TUI and system tray act as stateless thin clients that can be restarted at any time without interrupting audio.

---

## 1. Workspace Crate Structure

| Crate | Primary Responsibility |
| :--- | :--- |
| **`mvx-core`** | Shared types (`Snapshot`, `SharedState`, `Config`), the 14 built-in presets (`presets.rs`), acoustic voice cloning analyzer (`clone.rs`), and Soundboard WAV codec/synthesizer (`soundboard.rs`). |
| **`mvx-audio`** | PipeWire audio engine (`engine.rs`), real-time DSP filter chain (`dsp.rs`), CAM++ biometric speaker worker (`speaker.rs`), and OpenVoice V2 neural voice converter (`neural_vc.rs`). |
| **`mvx-ipc`** | Line-delimited JSON protocol over `UnixStream` (`Request`, `Response`, `Client`). |
| **`mvxd`** | Background daemon. Hosts the PipeWire main loop, IPC socket server, and configuration persistence. |
| **`mvx-tui`** | The `mvx` binary. Provides both the interactive `ratatui` terminal interface and all CLI subcommands (`ctl`, `doctor`, `status`, `clone`, `models`). |
| **`mvx-tray`** | Linux desktop system tray client built on the *StatusNotifierItem (SNI) / ksni* specification. |

---

## 2. PipeWire Graph Topology

```text
┌─────────────────────────────────────────────────────────────────────┐
│ mvxd (daemon)                                                       │
│                                                                     │
│  IPC Unix Socket ──► AudioCommand Channel                           │
│       ▲                   │                                         │
│       │                   ▼                                         │
│  mvx / mvx-tray     PipeWire Main Loop                              │
│                     ├── mvx.capture stream (48 kHz, F32LE)          │
│                     ├── DspChain -> rtrb::RingBuffer<f32>           │
│                     ├── mvx.output stream                           │
│                     ├── explicit FL/FR link-factory                 │
│                     └── mvx_mic (Audio/Source/Virtual)              │
│                                                                     │
│  Out-of-RT Workers:                                                 │
│    • Speaker Worker (SPSC ring -> 48k→16k -> VAD -> CAM++)          │
│    • Neural VC Worker (OpenVoice V2 STFT / tract-onnx)              │
└─────────────────────────────────────────────────────────────────────┘
```

### Audio Signal Path

1. **Native Virtual Source (`mvx_mic`):**
   The daemon spawns a native PipeWire node directly—no `pw-loopback` or `pactl` subprocesses:
   ```text
   factory.name   = support.null-audio-sink
   media.class    = Audio/Source/Virtual
   node.name      = mvx_mic
   audio.position = FL,FR
   ```
2. **Capture Stream (`mvx.capture`):**
   Connects to the selected physical microphone via `target.object` + `AUTOCONNECT` with `PW_STREAM_FLAG_RT_PROCESS`.
   - Downmixes input to mono, feeds the SPSC ring for the speaker verification worker, and processes audio through `DspChain`.
   - Mixes active Soundboard clips or Loop Tester buffers and writes interleaved stereo samples (`L/R`) into an `rtrb::RingBuffer<f32>`.
3. **Output Stream (`mvx.output`) & Explicit Port Linking:**
   - Deliberately **avoids** autoconnect so WirePlumber never accidentally routes your microphone output to your speakers.
   - Instead, `mvxd` monitors the PipeWire `Registry` and creates two explicit `link-factory` objects wiring `mvx.output:output_FL/FR` to `mvx_mic:input_FL/FR`.
   - When **Sidetone (`monitor_enabled`)** is toggled on, a dedicated monitor stream routes processed audio to your default headphone sink.

---

## 3. Real-Time Safety Guarantees

- Both capture and playback callbacks execute with `PW_STREAM_FLAG_RT_PROCESS`.
- **Zero RT Allocations or Locks:** All scratch buffers, pitch shifting buffers, reverb/chorus delay lines, and gate lookahead buffers are pre-allocated when `DspChain` is constructed.
- Live telemetry (peak/RMS levels, gate/compressor gain reduction, 8-band spectrum, and clip counters) is published to `SharedState` exclusively via `Ordering::Relaxed` atomics (`AtomicU32` / `AtomicU64`).

---

## 4. IPC Protocol (`$XDG_RUNTIME_DIR/mvx/mvxd.sock`)

The Unix domain socket is created with `0600` permissions. Every `Request` and `Response` is serialized as a single newline-delimited JSON line (`\n`):

### Sample Requests (`Request`)

```json
{"cmd":"hello","protocol":1}
{"cmd":"get_state"}
{"cmd":"set_input","name":"alsa_input.usb-Microphone"}
{"cmd":"set_gain","gain_db":-3.0}
{"cmd":"set_mute","mute":true}
{"cmd":"set_bypass","bypass":false}
{"cmd":"set_monitor","enabled":true,"gain_db":-6.0}
{"cmd":"apply_preset","id":"voz_grave"}
{"cmd":"upsert_preset","preset":{...},"activate":true}
{"cmd":"delete_preset","id":"custom_1"}
{"cmd":"reset_preset","id":"voz_grave"}
{"cmd":"trigger_sound","id":"airhorn"}
{"cmd":"stop_sounds"}
{"cmd":"start_loop_record"}
{"cmd":"stop_loop_test"}
{"cmd":"enroll_voice","name":"my_voice","seconds":10}
{"cmd":"delete_voice","name":"my_voice"}
{"cmd":"clone_voice_validate","audio_path":"~/sample.ogg"}
{"cmd":"clone_voice_save","session":{...}}
{"cmd":"reset_config","target":"all"}
{"cmd":"install_models"}
{"cmd":"reload_audio"}
{"cmd":"ping"}
{"cmd":"shutdown"}
```

### Responses (`Response`)

- `{"kind":"hello","version":"1.0.0","protocol":1}`
- `{"kind":"state","state":{ ...full Snapshot... }}`
- `{"kind":"ok"}`
- `{"kind":"pong"}`
- `{"kind":"error","message":"error description"}`
[/EN]

