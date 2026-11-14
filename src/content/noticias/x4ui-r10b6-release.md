---
title: "X4UI r1.0b6: Soporte Dual Forge + CleanroomMC, Red Flexible y Estabilidad"
date: 2026-11-14
author: "X4yi"
---

[ES]
Ya está disponible la pre-release **X4UI r1.0b6**, enfocada en portabilidad, arquitectura servidor–cliente desacoplada y estabilidad general del framework.

Durante este tiempo, la mayor parte del tiempo de desarrollo estuvo dirigida a otros proyectos, **pero X4UI nunca fue dejado de lado**: el framework sigue en desarrollo activo y esta versión consolida varias mejoras estructurales importantes.

### Lo más destacado de `r1.0b6`
- **Soporte dual oficial:** Compatibilidad completa con **Minecraft Forge 1.12.2 (Java 8 + LWJGL 2)** y **CleanroomMC (Java 25 + LWJGL 3)** mediante `PlatformBridge` (Multi-Release JAR) y las nuevas abstracciones `KeyCodes`, `UIInput` e `IGraphics`.
- **Framework servidor–cliente flexible:** Nuevo sistema `UINetwork`, `ScreenRegistry`, `PacketGuiRpc` (request–response), `PacketStateBatch`, canales multi-jugador `UIChannels`, guardas componibles (`ActionGuard`), rate-limiting y alcances reactivos por pantalla (`UIStateBus.Scope.SCREEN`).
- **Diseño minimalista y layout:** Tema sólido minimalista por defecto, primitivas `GuiPanel.row`/`column`/`card`/`spacer`, `FlexAlign`, `createCenteredWindow` y correcciones de padding/scrollbar.
- **Multimedia más limpia y robusta:** Descubrimiento automático de `ffmpeg` en el sistema operativo del usuario (Linux, macOS y Windows 10/11) con fallback automático a JCodec y manejo visual de errores en `GuiVideo`.

Puedes consultar el desglose técnico completo en el changelog oficial:
[**Ver Changelog de X4UI r1.0b6**](/changelogs/x4ui)
[/ES]

[EN]
The **X4UI r1.0b6** pre-release is now available, focused on runtime portability, decoupled server–client networking, and overall framework stability.

Over the past period, most development time was directed toward other projects, **but X4UI was never left behind**: the framework remains actively maintained, and this release consolidates several major architectural improvements.

### Highlights in `r1.0b6`
- **Official dual runtime support:** Full compatibility with **Minecraft Forge 1.12.2 (Java 8 + LWJGL 2)** and **CleanroomMC (Java 25 + LWJGL 3)** via `PlatformBridge` (Multi-Release JAR) alongside the new `KeyCodes`, `UIInput`, and `IGraphics` abstractions.
- **Flexible server–client framework:** New `UINetwork`, `ScreenRegistry`, `PacketGuiRpc` (request–response), `PacketStateBatch`, multi-player `UIChannels`, composable `ActionGuard`s, rate-limiting, and screen-scoped reactive state (`UIStateBus.Scope.SCREEN`).
- **Minimalist design & layout:** Solid minimalist default theme, `GuiPanel.row`/`column`/`card`/`spacer` primitives, `FlexAlign`, `createCenteredWindow`, and padding/scrollbar layout fixes.
- **Cleaner, more resilient media:** OS-level `ffmpeg` discovery (Linux, macOS, and Windows 10/11) with automatic JCodec fallback and visible error handling in `GuiVideo`.

You can read the full technical breakdown in the official changelog:
[**View X4UI r1.0b6 Changelog**](/changelogs/x4ui)
[/EN]

