---
title: "Forge 1.12.2 & CleanroomMC Compatibility"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 9
---

[ES]
# 09 - Compatibilidad Forge 1.12.2 ↔ CleanroomMC y Abstracciones

`x4ui` (`r1.0b6`) soporta oficialmente **Forge 1.12.2 (Java 8 + LWJGL 2)** y **CleanroomMC (Java 25 + LWJGL 3 / `lwjgly`)**.  
Para que un mod consumidor funcione sin fallos en ambos entornos, utiliza las abstracciones de `x4ui` en lugar de depender de APIs de bajo nivel de la JVM, LWJGL o librerías cuya versión cambia entre runtimes.

---

## 1. Matriz de Abstracciones de `x4ui`

| Qué necesitas hacer | Usa esta API de `x4ui` | Evita usar directamente |
| :--- | :--- | :--- |
| Dibujar rects, bordes, clipping, texto, texturas, depth | `IGraphics` (`GLGraphics`) | `org.lwjgl.opengl.GL11` / `GL12`, `GL11.glScissor` |
| Teclas, modificadores (`Ctrl`/`Shift`/`Alt`), scroll y mouse | `KeyCodes` + `UIInput` (`normalizeWheelDelta`, `safeMouseX/Y`) | `org.lwjgl.input.Keyboard`, `org.lwjgl.input.Mouse` |
| Buffers directos y executors I/O | `PlatformBridge.cleanDirectBuffer`, `PlatformBridge.newIoExecutor` | `sun.misc.Unsafe`, `DirectBuffer.cleaner()`, threads crudos |
| Detectar entorno en runtime | `PlatformBridge.isCleanroom()`, `isLwjgl3()`, `getJavaFeatureVersion()` | `Class.forName(...)` ad-hoc |
| Red servidor–cliente y pantallas remotas | `UINetwork`, `ScreenRegistry`, `UIChannels`, `UIStateBus`, `ActionGuard` | Canales Netty crudos o paquetes manuales |
| Descargas y rutas seguras de recursos | `SecurityUtils` (`validateHttpUrl`, `resolveSafeChild`) | `new URL(...).openStream()` sin validación SSRF/path |

---

## 2. Reglas Críticas para Mods Consumidores

### A. Compilar siempre con target Java 8
- Configura `sourceCompatibility = 1.8` y `targetCompatibility = 1.8` en tu `build.gradle`.
- Compilar bytecode para Java 25 romperá en Forge 1.12.2 (Java 8) con `UnsupportedClassVersionError`.
- Para I/O asíncrono o liberación de memoria nativa, delega en `PlatformBridge` (que internamente usa el JAR Multi-Release en Java 25 y un fallback seguro en Java 8).

### B. Evitar APIs eliminadas o incompatibles en Guava / Netty
- Forge 1.12.2 usa **Guava 21** y **Netty 4.1**, mientras que CleanroomMC usa **Guava 33.x** y **Netty 4.2.x**.
- Evita métodos eliminados en Guava moderno (por ejemplo, `Futures.addCallback(future, callback)` de 2 argumentos) y métodos exclusivos de Guava 33 / Netty 4.2. Prefiere la biblioteca estándar de Java 8 y `NBTTagCompound` / `ByteBufUtils`.

### C. No usar `org.lwjgl.input.*` ni dividir por `mc.displayWidth` sin guarda
- En LWJGL 3 / GLFW (CleanroomMC), los deltas de la rueda del mouse pueden ser distintos a `±120` y `mc.displayWidth` / `displayHeight` pueden ser `0` al minimizar la ventana.
- Usa `KeyCodes` (ej. `input.setSubmitKey(KeyCodes.ENTER)`) y `UIInput` (`UIInput.getEventDWheel()`, `UIInput.safeMouseX(...)`).

### D. Distribuir y probar siempre el JAR de `reobfJar`
- Nunca pruebes ni publiques `*-dev.jar` en `mods/`: tanto Forge puro como CleanroomMC requieren nombres SRG (`reobfJar`). Usar el `-dev.jar` produce `NoSuchMethodError` en clases de Minecraft (ej. `Minecraft.getMinecraft()`).

### E. Modo Server-Optional (Client-Only Graceful Fallback)
- No asumas que el servidor tiene tu mod o `x4ui` instalado si la pantalla puede abrirse en cliente: usa `UINetwork.isServerSupported()`, `UINetwork.sendActionOrLocal(...)` y maneja `RpcResult.error("NO_SERVER_SUPPORT", ...)`.
[/ES]

[EN]
# 09 - Forge 1.12.2 ↔ CleanroomMC Compatibility & Abstractions

`x4ui` (`r1.0b6`) officially supports **Forge 1.12.2 (Java 8 + LWJGL 2)** and **CleanroomMC (Java 25 + LWJGL 3 / `lwjgly`)**.  
To keep consumer mods portable across both runtimes, use `x4ui`'s abstractions instead of depending directly on low-level JVM, LWJGL, or library-specific APIs.

---

## 1. `x4ui` Abstraction Matrix

| Need | Use this `x4ui` API | Avoid calling directly |
| :--- | :--- | :--- |
| Drawing, clipping, text, textures, depth clear | `IGraphics` (`GLGraphics`) | `org.lwjgl.opengl.GL11` / `GL12`, `GL11.glScissor` |
| Key codes, modifiers, normalized wheel & mouse | `KeyCodes` + `UIInput` (`normalizeWheelDelta`, `safeMouseX/Y`) | `org.lwjgl.input.Keyboard`, `org.lwjgl.input.Mouse` |
| Direct buffers & I/O executors | `PlatformBridge.cleanDirectBuffer`, `PlatformBridge.newIoExecutor` | `sun.misc.Unsafe`, `DirectBuffer.cleaner()`, raw threads |
| Runtime detection | `PlatformBridge.isCleanroom()`, `isLwjgl3()`, `getJavaFeatureVersion()` | Ad-hoc `Class.forName(...)` checks |
| Server-client networking & remote screens | `UINetwork`, `ScreenRegistry`, `UIChannels`, `UIStateBus`, `ActionGuard` | Raw Netty channels or manual packet boilerplate |
| Safe remote downloads & file paths | `SecurityUtils` (`validateHttpUrl`, `resolveSafeChild`) | Unchecked `new URL(...).openStream()` |

---

## 2. Critical Rules for Consumer Mods

### A. Always target Java 8 bytecode
- Keep `sourceCompatibility = 1.8` and `targetCompatibility = 1.8` in `build.gradle`.
- Compiling for Java 25 will crash on Forge 1.12.2 (Java 8) with `UnsupportedClassVersionError`.
- Delegate native buffer cleanup and async executors to `PlatformBridge`, which handles Java 8 and Java 25 transparently via Multi-Release JAR support.

### B. Avoid version-skewed Guava / Netty APIs
- Forge 1.12.2 ships **Guava 21** and **Netty 4.1**, while CleanroomMC ships **Guava 33.x** and **Netty 4.2.x**.
- Avoid methods removed in modern Guava (e.g., 2-arg `Futures.addCallback`) as well as APIs introduced only in Guava 33 or Netty 4.2. Prefer standard Java 8 APIs, `NBTTagCompound`, and `ByteBufUtils`.

### C. Avoid direct `org.lwjgl.input.*` and unguarded `mc.displayWidth`
- Under LWJGL 3 / GLFW (CleanroomMC), scroll wheel deltas may differ from `±120`, and `mc.displayWidth` / `displayHeight` can temporarily be `0` when minimized.
- Use `KeyCodes` (e.g. `input.setSubmitKey(KeyCodes.ENTER)`) and `UIInput` (`UIInput.getEventDWheel()`, `UIInput.safeMouseX(...)`).

### D. Always ship and test the `reobfJar` artifact
- Never place `*-dev.jar` into `mods/`: both Forge 1.12.2 and CleanroomMC require SRG-reobfuscated JARs (`reobfJar`). Using `-dev.jar` causes `NoSuchMethodError` on Minecraft methods.

### E. Design for Server-Optional Fallback
- Never assume the remote server has `x4ui` or your mod installed: use `UINetwork.isServerSupported()`, `UINetwork.sendActionOrLocal(...)`, and handle `RpcResult.error("NO_SERVER_SUPPORT", ...)`.
[/EN]

