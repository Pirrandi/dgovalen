---
title: "Mis dotfiles: Arch Linux + Sway"
date: 2026-09-30
description: "Cómo está armado mi entorno en Arch Linux con Sway: el stack, los principios detrás, los contextos de workspaces y un instalador interactivo que lo deja todo listo en un comando."
tags: ["linux", "arch", "sway", "dotfiles", "neovim"]
draft: true
---

Los dotfiles son los archivos de configuración de tu entorno: el gestor de ventanas, la terminal, la shell, el editor. Tenerlos en un repositorio significa que cualquier máquina nueva queda igual a la tuya con un `git clone` y un script.

Los míos están en [github.com/Pirrandi/sway-dotfiles](https://github.com/Pirrandi/sway-dotfiles). En este post explico cómo están armados y por qué.

![Escritorio](https://raw.githubusercontent.com/Pirrandi/sway-dotfiles/main/assets/sway-preview.png)

## El stack

| Componente | Herramienta |
|------------|-------------|
| Gestor de ventanas | Sway (Wayland) |
| Barra | Waybar |
| Launcher | Wofi |
| Terminal | Alacritty + tmux |
| Shell | Zsh + Powerlevel10k |
| Editor | Neovim + LazyVim |
| Notificaciones | Mako |
| Bloqueo | Swaylock-effects + swayidle |

**Sway** es un gestor de ventanas en mosaico (*tiling*) para Wayland, compatible con la configuración de i3. Las ventanas se acomodan solas y todo se maneja con el teclado.

## Los principios

Tres reglas guían todo el repositorio:

**1. Nada de frameworks pesados.** Zsh sin Oh My Zsh: los plugins (autosuggestions, history substring search) vienen de los paquetes del sistema y se cargan directo en el `.zshrc`. Tmux sin TPM. Menos capas significa un arranque más rápido y menos cosas que se rompen.

**2. Eventos, no polling.** Los módulos personalizados de Waybar (workspaces, música vía MPRIS) reaccionan a eventos en lugar de ejecutar un script cada segundo. La barra no consume CPU mientras no pasa nada.

**3. Lo específico de cada máquina queda fuera del repo.** Los monitores (`output.conf`) y la lista de contextos no se versionan. El instalador los genera a partir de plantillas, así el mismo repositorio sirve en un notebook y en un escritorio con dos pantallas.

## Contextos: workspaces por grupo

Es la parte que más uso. Los workspaces se agrupan en **contextos**, por ejemplo `personal` y `work`. Cada contexto tiene sus propios workspaces del 1 al 10, y `Super+1-0` siempre actúa sobre el contexto activo.

```
personal: ●1 ○2 ○3
```

Con `Super+F1`, `Super+F2`, etc. cambiás de contexto, y la barra muestra solo los workspaces del contexto actual. El resultado: el navegador del trabajo nunca se mezcla con el personal, y los atajos de siempre siguen funcionando.

- Los contextos se definen en `~/.config/scripts/contexts.txt`, uno por línea.
- `Super+Ctrl+W` abre un menú para ir a un contexto, mover una ventana o crear uno nuevo. Al crearlo se regeneran los atajos `Super+F1-Fn`.

## El instalador

Todo se instala con un solo script:

```bash
git clone https://github.com/Pirrandi/sway-dotfiles.git ~/.dotfiles
cd ~/.dotfiles
./install.sh
```

El instalador usa [gum](https://github.com/charmbracelet/gum) para la interfaz y sigue una regla simple: **primero pregunta todo, muestra un resumen y solo instala si confirmás**. Si cancelás en el resumen, no se toca nada.

Pregunta, entre otras cosas:

- Qué componentes opcionales instalar: Neovim + LazyVim, VPN WireGuard, Flatpak, MangoHud, etc.
- Si instalar `yay` para acceder a AUR.
- Si agregar los repositorios de BlackArch (solo el repo, sin herramientas).
- Si instalar las herramientas de invitado, cuando detecta que corre en una VM.

Después crea un symlink en `~/.config/` por cada carpeta del repositorio. Si ya existe una carpeta real, la respalda como `*.bak` antes de reemplazarla. La salida completa queda en `~/.cache/sway-dotfiles-install.log`, y si un paso falla muestra las últimas líneas del log.

Usar symlinks tiene una ventaja clave: editás la configuración en `~/.config` como siempre, pero en realidad estás editando el repositorio. Un `git commit` y el cambio queda guardado.

## Neovim

El editor es [LazyVim](https://www.lazyvim.org/), una distribución de Neovim que trae LSP, autocompletado, Treesitter y un buen set de plugins listos. Lo personalizo agregando archivos en `lua/plugins/`. Por ejemplo, el tema:

```lua
return {
  {
    "bluz71/vim-moonfly-colors",
    name = "moonfly",
    lazy = false,
    priority = 1000,
  },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "moonfly",
    },
  },
}
```

[Moonfly](https://github.com/bluz71/vim-moonfly-colors) tiene fondo negro real (`#080808`) y acentos sobrios, que combina con la terminal oscura. El `lazy-lock.json` también está versionado, así todas las máquinas usan exactamente las mismas versiones de los plugins.

## Algunos atajos

`Super` es la tecla Windows.

| Atajo | Acción |
|-------|--------|
| `Super+Return` | Terminal |
| `Super+D` | Launcher |
| `Super+H/J/K/L` | Mover el foco |
| `Super+F1-Fn` | Cambiar de contexto |
| `Super+Shift+S` | Captura de un área al portapapeles |
| `Super+Shift+V` | Historial del portapapeles |
| `Super+Shift+L` | Bloquear pantalla |

En tmux el prefijo es `Ctrl+A`, y en zsh `Ctrl+R` busca en el historial con fzf. La lista completa está en el [README](https://github.com/Pirrandi/sway-dotfiles#atajos).

---

Si usás Arch, probalo en una VM: el instalador detecta VMware, VirtualBox y QEMU/KVM e instala lo necesario. Y si algo te sirve, copiá lo que quieras: los dotfiles están hechos para eso.
