---
title: "Networking & Sync"
project: "X4UI"
category: "General"
categoryOrder: 0
order: 3
---

[ES]
# 03 - Redes, Sidedness y Sincronización Servidor/Cliente

Este documento detalla la arquitectura de red flexible de `x4ui` (`r1.0b6`), diseñada para funcionar **tanto con `Container` vanilla como sin ningún `Container`** (paneles administrativos, tiendas, diálogos, gremios, HUDs remotos o máquinas personalizadas).

---

## 1. Arquitectura de Sidedness y Handshake (`UINetwork`)

- **`ClientProxy`:** Inicializa renderizado (`IGraphics`), fuentes (`FontRegistry`), multimedia (`MediaService`) y overlays (`GuiOverlayManager`).
- **`CommonProxy`:** Punto de entrada en servidor dedicado. No carga ninguna clase de OpenGL, LWJGL ni `client.*`.
- **Server-Optional (`@NetworkCheckHandler`) + Handshake automático (`PacketHandshake`):**
  - Un cliente con `x4ui` puede entrar a servidores vanilla o sin `x4ui`.
  - En cliente, `UINetwork.isServerSupported()` indica si el servidor tiene `x4ui`.
  - En servidor, `UINetwork.hasClient(player)` indica si el jugador completó el handshake.

---

## 2. Registro y Apertura Remota de Pantallas (`ScreenRegistry` + `UINetwork`)

### Registro en Cliente (`@SideOnly(Side.CLIENT)`)
```java
import com.x4yi.x4ui.client.gui.ScreenRegistry;

ScreenRegistry.register("mimod:shop", payload -> new ShopScreen(payload));
```

### Apertura desde Servidor
```java
import com.x4yi.x4ui.common.network.UINetwork;

if (UINetwork.hasClient(player)) {
    NBTTagCompound payload = new NBTTagCompound();
    payload.setString("shopId", "blacksmith");
    UINetwork.openScreen(player, "mimod:shop", payload);
}
```
- También puedes cerrar la pantalla (`UINetwork.closeScreen(player)`) o enviar notificaciones toast (`UINetwork.sendToast(player, "Título", "Mensaje", 4.0f)`).

---

## 3. Estado Reactivo por Pantalla, Namespaces y Lotes (`UIStateBus` + `PacketStateBatch`)

No necesitas crear un `Container` para sincronizar datos del servidor hacia la interfaz:

### Servidor → Cliente
```java
// Un valor puntual
UINetwork.syncState(player, UIStateBus.scopedKey("shop:blacksmith", "gold"), 1500);

// Múltiples llaves en un solo paquete Netty
Map<String, Object> batch = new LinkedHashMap<>();
batch.put("shop:blacksmith:gold", 1500);
batch.put("shop:blacksmith:open", true);
UINetwork.syncBatch(player, batch);
```

### Cliente (`GuiBaseScreen` / `GuiBaseContainer`)
- Usa `syncedState(key, valorInicial)` para crear estados con **`Scope.SCREEN`**: se limpian automáticamente en `onGuiClosed()`.
- También existen `Scope.SESSION` (toda la sesión en el servidor) y `Scope.GLOBAL` (persiste entre desconexiones).
- `UIStateBus.scopedKey(namespace, key)` y `UIStateBus.clearNamespace(namespace)` evitan colisiones entre múltiples bloques, entidades o menús.

---

## 4. Acciones Cliente → Servidor y Request–Response (RPC)

### Acciones unidireccionales (`sendActionToServer` / `sendActionOrLocal`)
En servidor:
```java
UINetwork.registerActionHandler(
    "mimod:buy_item",
    ActionGuard.withinDistance(pos, 8.0), // opcional
    (player, actionId, data) -> {
        // Lógica autoritativa en servidor
    }
);
```
En cliente (`GuiBaseScreen` o `GuiBaseContainer`):
```java
// Envía al servidor si tiene x4ui, o ejecuta el fallback local en modo client-only
sendActionOrLocal("mimod:buy_item", data, () -> showLocalPreview());
```

### Consultas Request–Response (`PacketGuiRpc`)
Ideal para búsquedas, listas paginadas o validaciones sin coordinar paquetes manualmente:

```java
// Servidor
UINetwork.onRpc("mimod:search_catalog", ActionGuard.opLevel(0), (player, params) -> {
    NBTTagCompound res = new NBTTagCompound();
    res.setInteger("total", 42);
    return RpcResult.ok(res);
});

// Cliente (dentro de GuiBaseScreen / GuiBaseContainer)
request("mimod:search_catalog", queryNbt, result -> {
    if (result.isOk()) {
        int total = result.getData().getInteger("total");
    }
});
```
- El framework ejecuta el handler en el hilo del servidor, entrega la respuesta en el hilo principal del cliente, aplica timeout (5s por defecto), responde `NO_SERVER_SUPPORT` al instante si el servidor no tiene `x4ui`, y **cancela automáticamente** los callbacks pendientes si el jugador cierra la pantalla.

---

## 5. Canales Multi-Jugador con Ciclo de Vida Automático (`UIChannels`)

Para UIs compartidas entre varios jugadores sin `Container` (tableros de facción, subastas, paneles compartidos):

```java
// Servidor: abre la pantalla y suscribe automáticamente al jugador al canal
UINetwork.openChannelScreen(player, "mimod:faction_panel", "faction:alpha", data);

// Cuando cambia el estado compartido, transmite a todos los suscritos con cliente compatible:
UIChannels.broadcastState("faction:alpha", "treasury", 9800);
UIChannels.broadcastBatch("faction:alpha", entries);
UIChannels.broadcastToast("faction:alpha", "Tesorería", "+500 oro", 3.0f);
```
- Al cerrar la pantalla (`onGuiClosed()`) o desconectarse (`ClientSessionTracker`), el jugador se desuscribe automáticamente del canal.

---

## 6. Seguridad y Validación (`ActionGuard` + Rate-Limiting)

- **Rate-limiting integrado:** `UINetwork` aplica por defecto un cooldown de `50ms` por jugador y `actionId`/`rpcId` (configurable vía `UINetwork.setDefaultRateLimitMs(ms)`).
- **Guardas componibles (`ActionGuard`):**
  - `ActionGuard.opLevel(int level)`
  - `ActionGuard.withinDistance(BlockPos pos, double maxDist)`
  - `ActionGuard.withinEntityDistance(int entityId, double maxDist)`
  - `ActionGuard.require(Predicate<EntityPlayerMP>)`
  - Combinables con `.and(...)`.

---

## 7. Sincronización de `Container` Vanilla (`NetworkSyncHelper`)

Si tu pantalla sí usa un `Container` de inventario (`GuiBaseContainer`), puedes seguir vinculando propiedades de ventana (16-bit o 32-bit atómicas) a `State<T>`:

```java
// Servidor (Container.detectAndSendChanges)
NetworkSyncHelper.send32BitProperty(listener, this, 0, 1, energy);
NetworkSyncHelper.sendFloat32Property(listener, this, 2, 3, temperature);

// Cliente (GuiBaseContainer.initComponents)
NetworkSyncHelper.bindContainerPropertyTo32Bit(getContainer(), 0, 1, energyState);
NetworkSyncHelper.bindContainerPropertyToFloat32(getContainer(), 2, 3, tempState);
```

---

## Qué Evitar Hacer

> [!CAUTION]
> **1. NUNCA importar `com.x4yi.x4ui.client.*` en clases comunes o de servidor.**
> Mantén `ScreenRegistry` y `GuiBaseScreen` aislados con `@SideOnly(Side.CLIENT)`.

> [!CAUTION]
> **2. NUNCA confiar en payloads de acciones o RPCs sin `ActionGuard` o validación en servidor.**
> Verifica distancia, dimensión, permisos y rangos numéricos en el servidor.
[/ES]

[EN]
# 03 - Networking, Sidedness & Server/Client Sync

This document covers `x4ui` (`r1.0b6`) networking and synchronization, designed to work **both with vanilla `Container`s and completely without `Container`s** (admin panels, shops, dialogs, guild boards, remote HUDs, or custom screens).

---

## 1. Sidedness & Automatic Handshake (`UINetwork`)

- **`ClientProxy`:** Initializes rendering (`IGraphics`), fonts (`FontRegistry`), multimedia (`MediaService`), and overlays (`GuiOverlayManager`).
- **`CommonProxy`:** Dedicated server entry point. Loads zero OpenGL, LWJGL, or `client.*` classes.
- **Server-Optional (`@NetworkCheckHandler`) + Handshake (`PacketHandshake`):**
  - Clients with `x4ui` can join vanilla or modded servers without requiring `x4ui` on the server.
  - Client-side: `UINetwork.isServerSupported()` reports whether the server has `x4ui`.
  - Server-side: `UINetwork.hasClient(player)` reports whether the player completed the handshake.

---

## 2. Remote Screen Registration & Opening (`ScreenRegistry` + `UINetwork`)

### Client Registration (`@SideOnly(Side.CLIENT)`)
```java
import com.x4yi.x4ui.client.gui.ScreenRegistry;

ScreenRegistry.register("mymod:shop", payload -> new ShopScreen(payload));
```

### Opening from Server
```java
import com.x4yi.x4ui.common.network.UINetwork;

if (UINetwork.hasClient(player)) {
    NBTTagCompound payload = new NBTTagCompound();
    payload.setString("shopId", "blacksmith");
    UINetwork.openScreen(player, "mymod:shop", payload);
}
```
- You can also close the active screen (`UINetwork.closeScreen(player)`) or send toast notifications (`UINetwork.sendToast(player, "Title", "Message", 4.0f)`).

---

## 3. Screen-Scoped State, Namespaces & Batching (`UIStateBus` + `PacketStateBatch`)

You do not need a `Container` to sync server state to a UI:

### Server → Client
```java
// Single key
UINetwork.syncState(player, UIStateBus.scopedKey("shop:blacksmith", "gold"), 1500);

// Multiple keys in a single Netty packet
Map<String, Object> batch = new LinkedHashMap<>();
batch.put("shop:blacksmith:gold", 1500);
batch.put("shop:blacksmith:open", true);
UINetwork.syncBatch(player, batch);
```

### Client (`GuiBaseScreen` / `GuiBaseContainer`)
- Use `syncedState(key, initialValue)` to create **`Scope.SCREEN`** states that are automatically cleaned up in `onGuiClosed()`.
- `Scope.SESSION` (cleared on disconnect) and `Scope.GLOBAL` (persists across disconnects) are also available.
- `UIStateBus.scopedKey(namespace, key)` and `UIStateBus.clearNamespace(namespace)` prevent key collisions across multiple blocks, entities, or menus.

---

## 4. Client → Server Actions & Request–Response (RPC)

### Fire-and-Forget Actions (`sendActionToServer` / `sendActionOrLocal`)
Server-side:
```java
UINetwork.registerActionHandler(
    "mymod:buy_item",
    ActionGuard.withinDistance(pos, 8.0), // optional guard
    (player, actionId, data) -> {
        // Server-authoritative logic
    }
);
```
Client-side (`GuiBaseScreen` or `GuiBaseContainer`):
```java
// Sends to server if supported, otherwise executes localFallback immediately
sendActionOrLocal("mymod:buy_item", data, () -> showLocalPreview());
```

### Request–Response Queries (`PacketGuiRpc`)
Ideal for paginated lists, search queries, or server validations without manual packet correlation:

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
- The framework runs the handler on the server main thread, delivers the result on the client main thread, enforces a default 5s timeout, returns `NO_SERVER_SUPPORT` immediately on client-only servers, and **auto-cancels** pending callbacks when the screen closes.

---

## 5. Multi-Player Pub/Sub Channels (`UIChannels`)

For shared UIs without a `Container` (faction panels, auction houses, shared dashboards):

```java
// Server: opens the screen and automatically subscribes the player to the channel
UINetwork.openChannelScreen(player, "mymod:faction_panel", "faction:alpha", data);

// Broadcast updates to all subscribed players with compatible clients:
UIChannels.broadcastState("faction:alpha", "treasury", 9800);
UIChannels.broadcastBatch("faction:alpha", entries);
UIChannels.broadcastToast("faction:alpha", "Treasury", "+500 gold", 3.0f);
```
- Closing the screen (`onGuiClosed()`) or logging out (`ClientSessionTracker`) automatically unsubscribes the player.

---

## 6. Security & Validation (`ActionGuard` + Rate-Limiting)

- **Built-in rate-limiting:** `UINetwork` enforces a default `50ms` cooldown per player and `actionId`/`rpcId` (configurable via `UINetwork.setDefaultRateLimitMs(ms)`).
- **Composable `ActionGuard` helpers:**
  - `ActionGuard.opLevel(int level)`
  - `ActionGuard.withinDistance(BlockPos pos, double maxDist)`
  - `ActionGuard.withinEntityDistance(int entityId, double maxDist)`
  - `ActionGuard.require(Predicate<EntityPlayerMP>)`
  - Combine guards with `.and(...)`.

---

## 7. Vanilla `Container` Sync (`NetworkSyncHelper`)

When your screen is backed by an inventory `Container` (`GuiBaseContainer`), you can bind window properties (16-bit or atomic 32-bit `int`/`float`) to `State<T>`:

```java
// Server (Container.detectAndSendChanges)
NetworkSyncHelper.send32BitProperty(listener, this, 0, 1, energy);
NetworkSyncHelper.sendFloat32Property(listener, this, 2, 3, temperature);

// Client (GuiBaseContainer.initComponents)
NetworkSyncHelper.bindContainerPropertyTo32Bit(getContainer(), 0, 1, energyState);
NetworkSyncHelper.bindContainerPropertyToFloat32(getContainer(), 2, 3, tempState);
```

---

## What to Avoid

> [!CAUTION]
> **1. NEVER import `com.x4yi.x4ui.client.*` in common or server classes.**
> Keep `ScreenRegistry` and `GuiBaseScreen` isolated inside `@SideOnly(Side.CLIENT)`.

> [!CAUTION]
> **2. NEVER trust client payloads without `ActionGuard` or server-side validation.**
> Always validate distance, dimension, permissions, and numeric bounds on the server.
[/EN]
