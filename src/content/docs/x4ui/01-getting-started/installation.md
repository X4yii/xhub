---
title: "Installation"
project: "X4UI"
category: "Getting Started"
categoryOrder: 1
---

[ES]
# Instalación

X4UI se distribuye como una dependencia de modding estándar para Minecraft Forge 1.12.2 usando Gradle.

## Dependencias Requeridas

* Minecraft 1.12.2
* Minecraft Forge (1.12.2)

## Setup del Proyecto (build.gradle)

Para integrar X4UI en un mod externo o standalone, debes añadir el repositorio de JitPack y registrar X4UI como una dependencia de compilación.

```gradle
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    // Reemplaza r1.0b3 con el tag / versión correspondiente deseada
    compile 'com.github.X4yi:X4UI:r1.0b3'
}
```

Es imperativo refrescar Gradle y su entorno de IDE (`setupDecompWorkspace` y/o sincronización nativa) antes de importar clases del framework.

[/ES]

[EN]
# Installation

X4UI is distributed as a standard modding dependency for Minecraft Forge 1.12.2 using Gradle.

## Requirements

* Minecraft 1.12.2
* Minecraft Forge (1.12.2)

## Project Setup (build.gradle)

To integrate X4UI into an external or standalone mod, you must add the JitPack repository and register X4UI as a compile dependency.

```gradle
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    // Replace r1.0b3 with the desired version/tag
    compile 'com.github.X4yi:X4UI:r1.0b3'
}
```

Make sure to refresh Gradle and your IDE workspace (`setupDecompWorkspace` and/or native sync) before importing the framework classes.

[/EN]
