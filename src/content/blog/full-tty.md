---
title: "Full TTY en Linux"
date: 2025-03-31
description: "Cómo obtener una Full TTY desde una reverse shell para tener autocompletado, Ctrl+C, y moverse cómodamente por el sistema."
tags: ["linux", "post-exploitation", "shells"]
draft: false
---

Cuando obtenemos una reverse shell básica, no tenemos autocompletado, `Ctrl+C` mata la conexión, y no podemos usar editores de texto. La solución es estabilizar la shell a Full TTY.

## ¿Qué es TTY?

**TTY** viene de *Teletypewriter* — originalmente hacía referencia a dispositivos de comunicación que transmitían texto entre computadoras. Hoy se refiere a cualquier terminal en un sistema Unix-like.

## Los pasos

**Paso 1** — Iniciar una sesión bash limpia con `script`:

```bash
script /dev/null -c bash
```

El comando `script` normalmente graba la salida a un archivo. Al redirigirla a `/dev/null` no guardamos nada, pero creamos un entorno de terminal controlado.

**Paso 2** — Suspender la sesión:

```
Ctrl + Z
```

**Paso 3** — Deshabilitar el echo local y traer el proceso al frente:

```bash
stty raw -echo; fg
```

`stty raw` pone el terminal en modo raw para que los caracteres se envíen directamente sin buffering. `-echo` desactiva el eco local. Esto es lo que nos da el Full TTY.

**Paso 4** — Reset del terminal:

```bash
reset xterm
```

**Paso 5** — Configurar el tipo de terminal:

```bash
export TERM=xterm-256color
```

**Paso 6** — Cargar la configuración de bash:

```bash
source /etc/skel/.bashrc
```

---

Con esto tenés autocompletado, flechas, `Ctrl+C` sin perder la shell, y podés usar `vim`, `nano`, etc.
