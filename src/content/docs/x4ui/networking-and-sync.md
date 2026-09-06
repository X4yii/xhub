---
title: "Networking & Sync"
project: "X4UI"
category: "General"
categoryOrder: 3
order: 3
---

[ES]
# 03 - Redes, Sidedness y Sincronización Servidor/Cliente

Este documento detalla la arquitectura de separación de lados (*sidedness*), compatibilidad de conexión asimétrica y sincronización reactiva de datos entre el servidor dedicado y las pantallas de cliente de X4UI.

---

## 1. Arquitectura de Sidedness (@SidedProxy)

X4UI implementa separación estricta mediante proxies de Forge:
- **`ClientProxy`:** Inicializa servicios de renderizado (`IGraphics`), rasterización de fuentes (`FontRegistry`), servicios multimedia (`MediaService`, OpenAL) y registros de superposición (`GuiOverlayManager`).
- **`CommonProxy`:** Punto de entrada en servidor dedicado. No carga ninguna clase de OpenGL, LWJGL ni interfaz visual.

### Conexión Server-Optional (@NetworkCheckHandler)
En X4UI r1.0b5, los clientes pueden ingresar a cualquier servidor (vanilla o modded) sin requerir que el servidor tenga instalado X4UI:

```java
@NetworkCheckHandler
public boolean checkModVersion(Map<String, String> mods, Side side) {
    // Retorna true sin exigir presencia en servidor
    return true;
}
```

---

## 2. Apertura de Pantallas desde el Servidor

Las pantallas de X4UI residen exclusivamente en el cliente. Para abrir una interfaz desde el servidor (por ejemplo, al interactuar con un bloque o comando), envíe un paquete estándar de Forge al cliente y programe la apertura en el hilo del cliente:

```java
// En el MessageHandler del cliente (Side.CLIENT)
@Override
public IMessage onMessage(PacketOpenUI message, MessageContext ctx) {
    Minecraft.getMinecraft().addScheduledTask(() -> {
        Minecraft.getMinecraft().displayGuiScreen(
            new MyCustomScreen(Minecraft.getMinecraft().currentScreen)
        );
    });
    return null;
}
```

---

## 3. Sincronización de Contenedores (`NetworkSyncHelper`)

Para sincronizar datos continuos de máquinas o inventarios (progreso, combustible, energía) sin crear canales de red propietarios, X4UI aprovecha el pipeline de propiedades de `Container` de Minecraft:

### Lado Servidor (`Container`)
En su subclase de `Container`, sobrescriba `detectAndSendChanges()`:

```java
@Override
public void detectAndSendChanges() {
    super.detectAndSendChanges();
    for (IContainerListener listener : listeners) {
        // Enviar propiedades de 16 bits
        listener.sendWindowProperty(this, 0, tileEntity.getProgress());
        listener.sendWindowProperty(this, 1, tileEntity.isActive() ? 1 : 0);
        listener.sendWindowProperty(this, 2, (int)(tileEntity.getTemperature() * 10.0f));
    }
}
```

### Lado Cliente (`GuiBaseContainer`)
En `initComponents()`, vincule las propiedades del contenedor a objetos `State<T>`:

```java
@Override
protected void initComponents() {
    State<Integer> progress = new State<>(0);
    State<Boolean> active = new State<>(false);
    State<Float> temperature = new State<>(0.0f);

    // Vinculación automática mediante NetworkSyncHelper
    NetworkSyncHelper.bindContainerPropertyToState(getContainer(), 0, progress);
    NetworkSyncHelper.bindContainerPropertyToBoolean(getContainer(), 1, active);
    NetworkSyncHelper.bindContainerPropertyToFloat(getContainer(), 2, temperature, 10.0f);

    // Enlazar los estados a componentes visuales
    progressBar.bindState(progress, val -> progressBar.setProgress(val / 100.0f));
    statusLabel.bindState(active, act -> statusLabel.setText(act ? "ACTIVO" : "INACTIVO"));
}
```

---

## 4. Despacho de Acciones Cliente-a-Servidor (`IGuiActionSender`)

Para enviar comandos desde la interfaz al servidor (clics en botones de configuración, cambios de pestañas), configure un `IGuiActionSender` en su pantalla:

```java
import com.x4yi.x4ui.common.sync.IGuiActionSender;
import net.minecraft.nbt.NBTTagCompound;

// Configurar el despachador en la pantalla
setActionSender((actionId, data) -> {
    MyModNetwork.CHANNEL.sendToServer(new PacketGuiAction(actionId, data));
});

// Invocar desde el callback de un botón
saveButton.setOnClick(() -> {
    NBTTagCompound data = new NBTTagCompound();
    data.setInteger("powerMode", selectedMode);
    sendActionToServer("set_power_mode", data);
});
```

---

## Qué Evitar Hacer (Errores Críticos de Red y Sidedness)

> [!CAUTION]
> **1. NUNCA importar paquetes `com.x4yi.x4ui.client.*` en clases del servidor.**
> Utilice estas clases únicamente con `@SideOnly(Side.CLIENT)`. Para paquetes comunes, use `State<T>` o `NetworkSyncHelper`.

> [!CAUTION]
> **2. NUNCA confiar ciegamente en datos recibidos mediante `IGuiActionSender`.**
> Valide siempre la información en el servidor (rango, contenedor abierto, límites de valores) antes de procesar acciones de los jugadores.

> [!WARNING]
> **3. NUNCA olvidar el factor de escala en valores de punto flotante.**
> `sendWindowProperty` solo envía enteros (`short`). Multiplique por una escala (ej. `10.0f`) en el servidor y pase la misma a `bindContainerPropertyToFloat()` en el cliente.

> [!IMPORTANT]
> **4. NUNCA ejecutar apertura de GUIs fuera de `addScheduledTask()`.**
> Los paquetes de red llegan en hilos secundarios. Abrir GUIs sin agendarlo en el hilo principal bloqueará el cliente.
[/ES]

[EN]
# 03 - Networking, Sidedness & Server/Client Sync

This document covers X4UI's sidedness architecture, server-optional connection capabilities, and reactive synchronization between dedicated servers and client screens.

---

## 1. Sidedness Architecture (@SidedProxy)

X4UI maintains strict separation between client-only code and server-safe common logic using Forge proxies:
- **`ClientProxy`:** Initializes OpenGL graphics layers (`IGraphics`), vector font pipelines (`FontRegistry`), multimedia services (`MediaService`), and screen overlay handlers (`GuiOverlayManager`).
- **`CommonProxy`:** Server-side entry point. Loads zero OpenGL, LWJGL, or client rendering classes.

### Server-Optional Connection (@NetworkCheckHandler)
In X4UI r1.0b5, clients with X4UI installed can join any remote server (vanilla or modded) without requiring X4UI on the server:

```java
@NetworkCheckHandler
public boolean checkModVersion(Map<String, String> mods, Side side) {
    // Returns true without enforcing server presence
    return true;
}
```

---

## 2. Opening Client Screens from the Server

X4UI screens are strictly client-side. To trigger a GUI from the server (e.g., right-clicking a block or executing a command), send a standard Forge packet to the client and schedule screen opening on the client main thread:

```java
// Inside client message handler (Side.CLIENT)
@Override
public IMessage onMessage(PacketOpenUI message, MessageContext ctx) {
    Minecraft.getMinecraft().addScheduledTask(() -> {
        Minecraft.getMinecraft().displayGuiScreen(
            new MyCustomScreen(Minecraft.getMinecraft().currentScreen)
        );
    });
    return null;
}
```

---

## 3. Container Property Synchronization (`NetworkSyncHelper`)

To sync continuous machine or tile data (progress bars, fuel levels, heat) without creating proprietary network channels, X4UI leverages Minecraft's native `Container` property pipeline:

### Server Side (`Container`)
In your `Container` subclass, override `detectAndSendChanges()`:

```java
@Override
public void detectAndSendChanges() {
    super.detectAndSendChanges();
    for (IContainerListener listener : listeners) {
        // Broadcast 16-bit signed window properties
        listener.sendWindowProperty(this, 0, tileEntity.getProgress());
        listener.sendWindowProperty(this, 1, tileEntity.isActive() ? 1 : 0);
        listener.sendWindowProperty(this, 2, (int)(tileEntity.getTemperature() * 10.0f));
    }
}
```

### Client Side (`GuiBaseContainer`)
In `initComponents()`, bind the container properties to `State<T>` objects:

```java
@Override
protected void initComponents() {
    State<Integer> progress = new State<>(0);
    State<Boolean> active = new State<>(false);
    State<Float> temperature = new State<>(0.0f);

    // Bind automatically using NetworkSyncHelper
    NetworkSyncHelper.bindContainerPropertyToState(getContainer(), 0, progress);
    NetworkSyncHelper.bindContainerPropertyToBoolean(getContainer(), 1, active);
    NetworkSyncHelper.bindContainerPropertyToFloat(getContainer(), 2, temperature, 10.0f);

    // Bind states directly to UI components
    progressBar.bindState(progress, val -> progressBar.setProgress(val / 100.0f));
    statusLabel.bindState(active, act -> statusLabel.setText(act ? "ACTIVE" : "IDLE"));
}
```

---

## 4. Client-to-Server Actions (`IGuiActionSender`)

To send user actions from UI components to the server (saving settings, switching tabs), configure an `IGuiActionSender` on your screen:

```java
import com.x4yi.x4ui.common.sync.IGuiActionSender;
import net.minecraft.nbt.NBTTagCompound;

// Configure action sender on screen
setActionSender((actionId, data) -> {
    MyModNetwork.CHANNEL.sendToServer(new PacketGuiAction(actionId, data));
});

// Invoke from button callback
saveButton.setOnClick(() -> {
    NBTTagCompound data = new NBTTagCompound();
    data.setInteger("powerMode", selectedMode);
    sendActionToServer("set_power_mode", data);
});
```

---

## What to Avoid (Critical Network & Sidedness Pitfalls)

> [!CAUTION]
> **1. NEVER import `com.x4yi.x4ui.client.*` packages in server code.**
> Keep all UI imports isolated within `@SideOnly(Side.CLIENT)` classes. In common classes or containers, use only `State<T>` and `NetworkSyncHelper`.

> [!CAUTION]
> **2. NEVER blindly trust client payload in `IGuiActionSender`.**
> On the server, always verify that the sender player has the container open, is within interaction range of the tile, and that received parameter values are within allowed bounds.

> [!WARNING]
> **3. NEVER omit the scaling factor when synchronizing float values.**
> `sendWindowProperty` transports signed 16-bit integers (`short`). When syncing floats, multiply by a constant scale (e.g., `10.0f`) on the server and pass the identical scale to `bindContainerPropertyToFloat()` on the client.

> [!IMPORTANT]
> **4. NEVER open screens outside `addScheduledTask()`.**
> Network packets arrive on background threads. Opening GUIs without scheduling it on the main game thread will crash the client.
[/EN]
