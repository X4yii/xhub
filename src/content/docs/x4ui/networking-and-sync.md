---
title: "Networking & Sync"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 3
---

[ES]
# 03 - Redes, Sidedness y Sincronización Servidor/Cliente

Este documento describe la arquitectura de red de X4UI (`r1.0b7`), diseñada para operar **tanto con `Container` vanilla como sin ningún `Container`** (paneles administrativos, tiendas, diálogos, gremios, HUDs remotos y máquinas personalizadas).

> **Política de Conexión (`r1.0b7`):** Un cliente con X4UI puede conectarse a servidores vanilla sin X4UI (modo fallback client-only mediante `UINetwork.isServerSupported()` / `sendActionOrLocal(...)`). Cuando un servidor tiene X4UI instalado, exige que el cliente también tenga X4UI (`@NetworkCheckHandler`) para garantizar sincronización consistente de estado y RPCs.

---

## 1. Problema y Decisiones de Diseño

En Minecraft 1.12.2, las interfaces servidor–cliente suelen requerir `Container`s rígidos, paquetes Netty repetitivos y validación manual de seguridad. Al mismo tiempo, un mod de UI instalado en cliente no debe impedir conectarse a servidores vanilla sin el mod.

X4UI resuelve esto mediante:
1. **Aislamiento estricto de Sidedness:** `CommonProxy` no referencia ninguna clase gráfica (`OpenGL`, `LWJGL` o `client.*`); `ClientProxy` concentra todo el subsistema visual.
2. **Arquitectura Server-Optional (`@NetworkCheckHandler` + `PacketHandshake`):** Un cliente con X4UI puede conectarse a servidores vanilla; `UINetwork.isServerSupported()` en cliente y `UINetwork.hasClient(player)` en servidor permiten degradación elegante.
3. **Protocolo unificado sobre NBT/ByteBuf:** `UINetwork` provee apertura remota de pantallas, lotes de estado, RPC request–response y canales Pub/Sub sin registrar canales Netty adicionales por cada pantalla.

---

## 2. Registro y Apertura Remota de Pantallas (`ScreenRegistry` + `UINetwork`)

### Registro en Cliente (`@SideOnly(Side.CLIENT)`)

```java
import com.x4yi.x4ui.client.gui.ScreenRegistry;

ScreenRegistry.register("mymod:shop", payload -> new ShopScreen(payload));
```

### Apertura, Cierre y Toast desde Servidor

```java
import com.x4yi.x4ui.common.network.UINetwork;

if (UINetwork.hasClient(player)) {
    NBTTagCompound payload = new NBTTagCompound();
    payload.setString("shopId", "blacksmith");
    UINetwork.openScreen(player, "mymod:shop", payload);
}
```

También están disponibles `UINetwork.closeScreen(player)` y `UINetwork.sendToast(player, "Título", "Mensaje", 4.0f)`.

---

## 3. Estado Reactivo por Pantalla, Namespaces y Lotes (`UIStateBus` + `PacketStateBatch`)

### Servidor → Cliente

```java
// Actualización individual
UINetwork.syncState(player, UIStateBus.scopedKey("shop:blacksmith", "gold"), 1500);

// Múltiples llaves en un único paquete Netty
Map<String, Object> batch = new LinkedHashMap<>();
batch.put("shop:blacksmith:gold", 1500);
batch.put("shop:blacksmith:open", true);
UINetwork.syncBatch(player, batch);
```

### Cliente (`GuiBaseScreen` / `GuiBaseContainer`)

`syncedState(key, valorInicial)` crea o recupera un `State<T>` en `Scope.SCREEN`, el cual se limpia automáticamente en `onGuiClosed()`. Para persistencia entre pantallas se dispone de `Scope.SESSION` (limpieza al desconectarse) y `Scope.GLOBAL`.

`UIStateBus.scopedKey(namespace, key)` y `UIStateBus.clearNamespace(namespace)` evitan colisiones entre múltiples bloques, entidades o menús simultáneos.

---

## 4. Acciones Cliente → Servidor y Consultas RPC (`PacketGuiRpc`)

### Acciones Unidireccionales (`sendActionToServer` / `sendActionOrLocal`)

```java
// Servidor
UINetwork.registerActionHandler(
    "mymod:buy_item",
    ActionGuard.withinDistance(pos, 8.0),
    (player, actionId, data) -> {
        // Lógica autoritativa en servidor
    }
);

// Cliente (dentro de GuiBaseScreen / GuiBaseContainer)
sendActionOrLocal("mymod:buy_item", data, () -> showLocalPreview());
```

### Consultas Request–Response (`PacketGuiRpc` + `RpcResult`)

```java
// Servidor
UINetwork.onRpc("mymod:search_catalog", ActionGuard.opLevel(0), (player, params) -> {
    NBTTagCompound res = new NBTTagCompound();
    res.setInteger("total", 42);
    return RpcResult.ok(res);
});

// Cliente (dentro de GuiBaseScreen / GuiBaseContainer)
request("mymod:search_catalog", queryNbt, result -> {
    if (result.isOk()) {
        int total = result.getData().getInteger("total");
    }
});
```

El framework ejecuta el handler en el hilo del servidor, entrega la respuesta en el hilo principal del cliente, aplica timeout (`5s` por defecto, barrido automáticamente vía `ScreenHost` tanto en `GuiBaseScreen` como en `GuiBaseContainer`), responde `NO_SERVER_SUPPORT` de inmediato si el servidor no tiene X4UI y cancela automáticamente los callbacks pendientes al cerrar la pantalla.

---

## 5. Canales Multi-Jugador (`UIChannels`)

Para interfaces compartidas entre varios jugadores sin `Container` (tableros de facción, subastas, paneles globales):

```java
// Servidor: abre la pantalla y suscribe al jugador al canal
UINetwork.openChannelScreen(player, "mymod:faction_panel", "faction:alpha", data);

// Transmisión a todos los suscritos con cliente compatible
UIChannels.broadcastState("faction:alpha", "treasury", 9800);
UIChannels.broadcastBatch("faction:alpha", entries);
UIChannels.broadcastToast("faction:alpha", "Tesorería", "+500 oro", 3.0f);
```

Al cerrar la pantalla (`onGuiClosed()`) o desconectarse (`ClientSessionTracker`), el jugador se desuscribe automáticamente.

---

## 6. Seguridad en Red (`ActionGuard` y Rate-Limiting)

- **Rate-limiting integrado:** `UINetwork` aplica por defecto un cooldown de `50ms` por jugador y por `actionId`/`rpcId` (configurable mediante `UINetwork.setDefaultRateLimitMs(ms)`). Las entradas por jugador se liberan automáticamente al desconectarse mediante `UINetwork.clearPlayerRateLimits(UUID)` desde `ClientSessionTracker`.
- **Guardas componibles (`ActionGuard`):**
  - `ActionGuard.opLevel(int level)`
  - `ActionGuard.withinDistance(BlockPos pos, double maxDist)`
  - `ActionGuard.withinEntityDistance(int entityId, double maxDist)`
  - `ActionGuard.require(Predicate<EntityPlayerMP>)`
  - Combinables mediante `.and(...)`.

---

## 7. Sincronización de `Container` Vanilla (`NetworkSyncHelper`)

Cuando la pantalla utiliza un `Container` (`GuiBaseContainer`), `NetworkSyncHelper` y `StateContainerListener` sincronizan propiedades de ventana de 16-bit o 32-bit atómicas (`int` y `float`):

```java
// Servidor (Container.detectAndSendChanges)
NetworkSyncHelper.send32BitProperty(listener, this, 0, 1, energy);
NetworkSyncHelper.sendFloat32Property(listener, this, 2, 3, temperature);

// Cliente (GuiBaseContainer.initComponents)
NetworkSyncHelper.bindContainerPropertyTo32Bit(getContainer(), 0, 1, energyState);
NetworkSyncHelper.bindContainerPropertyToFloat32(getContainer(), 2, 3, tempState);
```

---

## 8. Qué Evitar en Redes

| Antipatrón | Causa Técnica del Problema | Solución Correcta |
| :--- | :--- | :--- |
| Importar `com.x4yi.x4ui.client.*` en clases comunes o servidor | Carga clases `@SideOnly(Side.CLIENT)` y falla con `ClassNotFoundException` en servidor dedicado | Aislar `ScreenRegistry` y `GuiBaseScreen` en `@SideOnly(Side.CLIENT)` |
| Procesar acciones/RPC sin `ActionGuard` ni validación | Permite spoofing de paquetes, interacción a distancia infinita o escalada de privilegios | Aplicar `ActionGuard` y validar permisos, dimensión y rangos en servidor |
| Asumir presencia obligatoria del servidor para vistas locales | Rompe pantallas client-only en servidores vanilla | Usar `UINetwork.isServerSupported()`, `sendActionOrLocal(...)` y verificar `result.isOk()` |
[/ES]

[EN]
# 03 - Networking, Sidedness & Server/Client Sync

This document details X4UI's networking architecture (`r1.0b7`), engineered to work **both with vanilla `Container`s and completely without `Container`s** (administrative panels, shops, dialogs, guild boards, remote HUDs, and custom machines).

> **Connection Policy (`r1.0b7`):** A client with X4UI can join vanilla servers without X4UI (client-only fallback via `UINetwork.isServerSupported()` / `sendActionOrLocal(...)`). When a server has X4UI installed, connecting clients are required to have X4UI installed (`@NetworkCheckHandler`) to guarantee consistent state and RPC synchronization.

---

## 1. Problem & Design Decisions

In Minecraft 1.12.2, server–client UIs traditionally require rigid `Container` boilerplate, per-screen Netty packets, and manual security checks. Meanwhile, a client-installed UI framework must never block players from joining vanilla servers.

X4UI solves this through:
1. **Strict Sidedness Isolation:** `CommonProxy` references zero OpenGL, LWJGL, or `client.*` classes; `ClientProxy` isolates all rendering systems.
2. **Server-Optional Architecture (`@NetworkCheckHandler` + `PacketHandshake`):** Clients with X4UI can join vanilla servers; `UINetwork.isServerSupported()` (client) and `UINetwork.hasClient(player)` (server) enable graceful fallback.
3. **Unified NBT/ByteBuf Protocol:** `UINetwork` handles remote screen opening, batched state sync, request–response RPC, and Pub/Sub channels without per-screen Netty channel boilerplate.

---

## 2. Remote Screen Registration & Opening (`ScreenRegistry` + `UINetwork`)

### Client Registration (`@SideOnly(Side.CLIENT)`)

```java
import com.x4yi.x4ui.client.gui.ScreenRegistry;

ScreenRegistry.register("mymod:shop", payload -> new ShopScreen(payload));
```

### Opening, Closing & Toasts from Server

```java
import com.x4yi.x4ui.common.network.UINetwork;

if (UINetwork.hasClient(player)) {
    NBTTagCompound payload = new NBTTagCompound();
    payload.setString("shopId", "blacksmith");
    UINetwork.openScreen(player, "mymod:shop", payload);
}
```

`UINetwork.closeScreen(player)` and `UINetwork.sendToast(player, "Title", "Message", 4.0f)` are also available.

---

## 3. Screen-Scoped State, Namespaces & Batching (`UIStateBus` + `PacketStateBatch`)

### Server → Client

```java
// Single key update
UINetwork.syncState(player, UIStateBus.scopedKey("shop:blacksmith", "gold"), 1500);

// Multiple keys in a single Netty packet
Map<String, Object> batch = new LinkedHashMap<>();
batch.put("shop:blacksmith:gold", 1500);
batch.put("shop:blacksmith:open", true);
UINetwork.syncBatch(player, batch);
```

### Client (`GuiBaseScreen` / `GuiBaseContainer`)

`syncedState(key, initialValue)` binds a `State<T>` under `Scope.SCREEN`, which is automatically cleared in `onGuiClosed()`. `Scope.SESSION` (cleared on disconnect) and `Scope.GLOBAL` are available for broader persistence.

`UIStateBus.scopedKey(namespace, key)` and `UIStateBus.clearNamespace(namespace)` prevent key collisions across multiple blocks, entities, or menus.

---

## 4. Client → Server Actions & RPC Queries (`PacketGuiRpc`)

### Fire-and-Forget Actions (`sendActionToServer` / `sendActionOrLocal`)

```java
// Server
UINetwork.registerActionHandler(
    "mymod:buy_item",
    ActionGuard.withinDistance(pos, 8.0),
    (player, actionId, data) -> {
        // Server-authoritative logic
    }
);

// Client (inside GuiBaseScreen / GuiBaseContainer)
sendActionOrLocal("mymod:buy_item", data, () -> showLocalPreview());
```

### Request–Response Queries (`PacketGuiRpc` + `RpcResult`)

```java
// Server
UINetwork.onRpc("mymod:search_catalog", ActionGuard.opLevel(0), (player, params) -> {
    NBTTagCompound res = new NBTTagCompound();
    res.setInteger("total", 42);
    return RpcResult.ok(res);
});

// Client (inside GuiBaseScreen / GuiBaseContainer)
request("mymod:search_catalog", queryNbt, result -> {
    if (result.isOk()) {
        int total = result.getData().getInteger("total");
    }
});
```

The framework executes handlers on the server main thread, delivers responses on the client main thread, enforces a default `5s` timeout (swept automatically by `ScreenHost` on both `GuiBaseScreen` and `GuiBaseContainer`), returns `NO_SERVER_SUPPORT` immediately on vanilla servers, and automatically cancels pending callbacks on screen close.

---

## 5. Multi-Player Channels (`UIChannels`)

For shared UIs without a `Container` (faction panels, auction houses, shared dashboards):

```java
// Server: opens the screen and subscribes the player to the channel
UINetwork.openChannelScreen(player, "mymod:faction_panel", "faction:alpha", data);

// Broadcast updates to all subscribed compatible clients
UIChannels.broadcastState("faction:alpha", "treasury", 9800);
UIChannels.broadcastBatch("faction:alpha", entries);
UIChannels.broadcastToast("faction:alpha", "Treasury", "+500 gold", 3.0f);
```

Closing the screen (`onGuiClosed()`) or logging out (`ClientSessionTracker`) automatically unsubscribes the player.

---

## 6. Network Security (`ActionGuard` & Rate-Limiting)

- **Built-in rate-limiting:** `UINetwork` enforces a default `50ms` cooldown per player and `actionId`/`rpcId` (configurable via `UINetwork.setDefaultRateLimitMs(ms)`). Per-player entries are automatically evicted on disconnect via `UINetwork.clearPlayerRateLimits(UUID)` from `ClientSessionTracker`.
- **Composable guards (`ActionGuard`):**
  - `ActionGuard.opLevel(int level)`
  - `ActionGuard.withinDistance(BlockPos pos, double maxDist)`
  - `ActionGuard.withinEntityDistance(int entityId, double maxDist)`
  - `ActionGuard.require(Predicate<EntityPlayerMP>)`
  - Combine guards with `.and(...)`.

---

## 7. Vanilla `Container` Sync (`NetworkSyncHelper`)

For inventory-backed screens (`GuiBaseContainer`), `NetworkSyncHelper` and `StateContainerListener` synchronize 16-bit and atomic 32-bit `int`/`float` window properties:

```java
// Server (Container.detectAndSendChanges)
NetworkSyncHelper.send32BitProperty(listener, this, 0, 1, energy);
NetworkSyncHelper.sendFloat32Property(listener, this, 2, 3, temperature);

// Client (GuiBaseContainer.initComponents)
NetworkSyncHelper.bindContainerPropertyTo32Bit(getContainer(), 0, 1, energyState);
NetworkSyncHelper.bindContainerPropertyToFloat32(getContainer(), 2, 3, tempState);
```

---

## 8. What to Avoid in Networking

| Anti-Pattern | Technical Root Cause | Correct Approach |
| :--- | :--- | :--- |
| Importing `com.x4yi.x4ui.client.*` in common or server code | Loads `@SideOnly(Side.CLIENT)` classes and crashes dedicated servers with `ClassNotFoundException` | Isolate `ScreenRegistry` and `GuiBaseScreen` inside `@SideOnly(Side.CLIENT)` |
| Handling actions/RPCs without `ActionGuard` or validation | Exposes endpoints to packet spoofing, infinite-range interaction, or privilege escalation | Apply `ActionGuard` and validate permissions, dimension, and numeric bounds on server |
| Assuming server support on client-accessible screens | Breaks client-only mode on vanilla servers | Use `UINetwork.isServerSupported()`, `sendActionOrLocal(...)`, and check `result.isOk()` |
[/EN]
