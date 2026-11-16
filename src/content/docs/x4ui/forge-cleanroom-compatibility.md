---
title: "Forge 1.12.2 & CleanroomMC Compatibility"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 9
---

[ES]
# 09 - Compatibilidad Forge 1.12.2 ↔ CleanroomMC y Abstracciones

X4UI (`r1.0b6`) soporta oficialmente **Forge 1.12.2 (Java 8 + LWJGL 2)** y **CleanroomMC (Java 25 + LWJGL 3 / `lwjgly`)**. Este documento detalla las decisiones de arquitectura Multi-Release y las reglas de portabilidad para mods consumidores.

---

## 1. Problema y Decisión de Diseño (`PlatformBridge`)

Entre Forge 1.12.2 y CleanroomMC cambian la versión de la JVM (Java 8 vs Java 25), el sistema de ventanas/entrada (LWJGL 2 vs LWJGL 3/GLFW) y las versiones de librerías base (Guava 21 / Netty 4.1 vs Guava 33.x / Netty 4.2.x). El acceso directo a APIs internas (`sun.misc.Unsafe`, `DirectBuffer.cleaner()`, `org.lwjgl.input.*`) provoca fallos en tiempo de ejecución en uno u otro entorno.

X4UI empaqueta **`PlatformBridge` como Multi-Release JAR** (`Java 8` base + `META-INF/versions/21/`):
- En **Java 25 (CleanroomMC)** utiliza `java.lang.ref.Cleaner` y executors modernos sin reflexión restringida.
- En **Java 8 (Forge 1.12.2)** aplica un fallback seguro compatible con el runtime clásico.

---

## 2. Matriz de Abstracciones de X4UI

| Necesidad | API de X4UI Recomendada | Evitar Llamar Directamente |
| :--- | :--- | :--- |
| Renderizado, scissor, texturas BGRA y depth | `IGraphics` (`GLGraphics`) | `org.lwjgl.opengl.GL11` / `GL12`, `GL11.glScissor` |
| Teclas, modificadores, scroll y mouse | `KeyCodes` + `UIInput` (`normalizeWheelDelta`, `safeMouseX/Y`) | `org.lwjgl.input.Keyboard`, `org.lwjgl.input.Mouse` |
| Buffers directos y executors I/O | `PlatformBridge.cleanDirectBuffer`, `PlatformBridge.newIoExecutor` | `sun.misc.Unsafe`, `DirectBuffer.cleaner()`, threads crudos |
| Detección de entorno en runtime | `PlatformBridge.isCleanroom()`, `isLwjgl3()`, `getJavaFeatureVersion()` | `Class.forName(...)` ad-hoc |
| Red servidor–cliente y pantallas remotas | `UINetwork`, `ScreenRegistry`, `UIChannels`, `UIStateBus`, `ActionGuard` | Canales Netty crudos o paquetes manuales |
| Descargas y rutas seguras en caché | `SecurityUtils` (`validateHttpUrl`, `resolveSafeChild`) | `new URL(...).openStream()` sin validación SSRF/path |

---

## 3. Reglas Críticas para Mods Consumidores

1. **Compilar siempre con target Java 8:** configurar `sourceCompatibility = 1.8` y `targetCompatibility = 1.8` en `build.gradle`. Bytecode de Java 25 fallará en Forge 1.12.2 con `UnsupportedClassVersionError`.
2. **Evitar APIs incompatibles de Guava / Netty:** evitar métodos eliminados en Guava moderno (ej. `Futures.addCallback` de 2 argumentos) y métodos exclusivos de Guava 33 o Netty 4.2; preferir la biblioteca estándar de Java 8, `NBTTagCompound` y `ByteBufUtils`.
3. **Proteger entrada y división por `displayWidth`:** en LWJGL 3 / GLFW, los deltas de scroll pueden diferir de `±120` y `mc.displayWidth` / `displayHeight` pueden valer `0` al minimizar la ventana. Utilizar `KeyCodes` y `UIInput`.
4. **Distribuir siempre el JAR de `reobfJar`:** nunca instalar `*-dev.jar` en `mods/`. Tanto Forge como CleanroomMC requieren mapeo SRG; usar `-dev.jar` produce `NoSuchMethodError` en métodos de Minecraft.
5. **Soportar modo Server-Optional:** verificar `UINetwork.isServerSupported()`, utilizar `sendActionOrLocal(...)` y manejar `NO_SERVER_SUPPORT` en RPCs.
[/ES]

[EN]
# 09 - Forge 1.12.2 ↔ CleanroomMC Compatibility & Abstractions

X4UI (`r1.0b6`) officially supports **Forge 1.12.2 (Java 8 + LWJGL 2)** and **CleanroomMC (Java 25 + LWJGL 3 / `lwjgly`)**. This document explains the Multi-Release architecture and portability rules for consumer mods.

---

## 1. Problem & Design Decisions (`PlatformBridge`)

Between Forge 1.12.2 and CleanroomMC, the JVM version (Java 8 vs Java 25), window/input stack (LWJGL 2 vs LWJGL 3/GLFW), and bundled dependencies (Guava 21 / Netty 4.1 vs Guava 33.x / Netty 4.2.x) differ significantly. Direct access to internal APIs (`sun.misc.Unsafe`, `DirectBuffer.cleaner()`, `org.lwjgl.input.*`) breaks at runtime in one of the two environments.

X4UI ships **`PlatformBridge` as a Multi-Release JAR** (`Java 8` base + `META-INF/versions/21/`):
- On **Java 25 (CleanroomMC)**, it uses `java.lang.ref.Cleaner` and modern executors without restricted reflection.
- On **Java 8 (Forge 1.12.2)**, it falls back cleanly to a Java 8-compatible implementation.

---

## 2. X4UI Abstraction Matrix

| Need | Recommended X4UI API | Avoid Calling Directly |
| :--- | :--- | :--- |
| Drawing, scissor clipping, BGRA textures, depth | `IGraphics` (`GLGraphics`) | `org.lwjgl.opengl.GL11` / `GL12`, `GL11.glScissor` |
| Key codes, modifiers, normalized wheel & mouse | `KeyCodes` + `UIInput` (`normalizeWheelDelta`, `safeMouseX/Y`) | `org.lwjgl.input.Keyboard`, `org.lwjgl.input.Mouse` |
| Direct buffers & I/O executors | `PlatformBridge.cleanDirectBuffer`, `PlatformBridge.newIoExecutor` | `sun.misc.Unsafe`, `DirectBuffer.cleaner()`, raw threads |
| Runtime detection | `PlatformBridge.isCleanroom()`, `isLwjgl3()`, `getJavaFeatureVersion()` | Ad-hoc `Class.forName(...)` checks |
| Server-client networking & remote screens | `UINetwork`, `ScreenRegistry`, `UIChannels`, `UIStateBus`, `ActionGuard` | Raw Netty channels or manual packet boilerplate |
| Safe remote downloads & cache paths | `SecurityUtils` (`validateHttpUrl`, `resolveSafeChild`) | Unchecked `new URL(...).openStream()` |

---

## 3. Critical Rules for Consumer Mods

1. **Always target Java 8 bytecode:** keep `sourceCompatibility = 1.8` and `targetCompatibility = 1.8` in `build.gradle`. Compiling for Java 25 crashes on Forge 1.12.2 with `UnsupportedClassVersionError`.
2. **Avoid version-skewed Guava / Netty APIs:** avoid methods removed in modern Guava (e.g. 2-arg `Futures.addCallback`) as well as APIs introduced only in Guava 33 or Netty 4.2. Prefer standard Java 8 APIs, `NBTTagCompound`, and `ByteBufUtils`.
3. **Guard input & `displayWidth`:** under LWJGL 3 / GLFW, scroll wheel deltas may differ from `±120` and `mc.displayWidth` / `displayHeight` can be `0` while minimized. Use `KeyCodes` and `UIInput`.
4. **Always ship the `reobfJar` artifact:** never place `*-dev.jar` in `mods/`. Both Forge 1.12.2 and CleanroomMC require SRG-reobfuscated JARs; `-dev.jar` causes `NoSuchMethodError` on Minecraft methods.
5. **Support Server-Optional mode:** check `UINetwork.isServerSupported()`, use `sendActionOrLocal(...)`, and handle `NO_SERVER_SUPPORT` in RPC callbacks.
[/EN]
