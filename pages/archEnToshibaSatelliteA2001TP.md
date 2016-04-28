# Instalar Arch Linux en un Toshiba Satellite A2001TP

Después de arrancar con el CD Live y de elegir en el menú de inicio arrancar la versiónd e 64 bits de Arch, ejecutamos `loadkeys es` para establecer el teclado en español.

## Conectarse a Internet

Conectamos el equipo por medio de un cable a la red. Para ver el nombre de las tarjetas de red ejecutamos `ip link`. En mi caso la tarjeta de red cablada recibió el nombre `enp4s0`. Para activarla usamos `ip link set enp4s0 up` y, luego, solicitamos una dirección IP con `dhcpcd enp4s0`. Para comprobar si todo ha ido bien ejecutamos `ip addr show enp4s0` y deberíamos de ver en el apartado `inet` una dirección IP. Probamos a hacer ping con `ping 8.8.8.8` y con `ping www.google.es` y deberíamos recibir respuesta.


## Actualizar la hora

Con el comando `date` comprobamos si la hora es correcta. En caso de que no lo sea invocamos `timedatectl set-ntp true`. 


## Establecer la tabla de particiones

Invocamos `lsblk` y `parted /dev/sdX print` para obtener un diagrama de los discos disponibles y sus particiones. Nosotros vamos a borrar todo el disco duro e instalar Arch ocupando el espacio total del mismo.

Vamos a usar la herramienta `cfdisk` para establecer 3 particiones:

* `/boot`: partición primaria partición está destinada a grub
* `/`: partición primaria que albergará la raíz del sistema
* `/swap`: partición primaria para asignar memoria virtual en caso de contar con hasta 2Gb de RAM. No es recomendable usar swap con mas de 2 GB. de RAM. En equipos con memoria RAM de hasta 1 GB debería ser igual de grande la SWAP que la RAM. Para 2 GB debería ser la SWAP la mitad de grande que la RAM.

Usando cfdisk la secuencia de órdenes sera: `New » Primary | Logical » Size (en MB) » Beginning`. Hay que tener en cuenta que:

* En el caso de la partición elegida como `/swap` debemos ir a la opción `Type` y seleccionar `82 (Linux Swap)` de la lista.
* En el caso de la partición elegida como `/boot` debemos seleccionar la opción `Bootable`.

Terminado el particionamiento usaremos `Write` para escribir los cambios en el disco y luego los confirmaremos con `yes`. Finalmente elegiremos `Quit`. 


## Formatear las particiones

Usamos `mkfs.ext4 /dev/sda1` y `mkfs.ext4 /dev/sda1` para formatear las dos primeras particiones. Para la swap usamos `mkswap /dev/sda3` para formatearla y `swapon /dev/sda3` para activarla.


## Montar las particiones

Montamos la partición raíz del disco duro en el directorio `/mnt` del CD Live con `mount /dev/sda2 /mnt`.

Ahora creamos los directorios donde montar la otra partición con `mkdir /mnt/boot` y la montamos con `mount /dev/sda1 /mnt/boot`.


## Instalar el sistema

Para instalar el sistema base usamos `pacstrap /mnt base base-devel`. Finalizada la instalación usamos `pacstrap /mnt grub-bios` para instalar el gestor de arranque grub.


## Configurar el sistema

La primera tarea es generar un archivo `fstab` mediante la orden `genfstab -U /mnt > /mnt/etc/fstab`. Con `cat /mnt/etc/fstab` revisamos el archivo: debe haber tres entradas, una por cada partición.

Ahora nos cambiamos a nuestro nuevo sistema recién instalado con `arc-chroot /mnt`. 

Configuramos el nombre del equipo con `echo nombre_equipo > /etc/hostname` y la zona horaria con `ln -s /usr/share/zoneinfo/America/Mexico_City /etc/localtime`.

Ahora debemos configurar el idioma del sistema. Invocamos `nano /etc/local.gen` para abrir con el editor de textos el archivo `/etc/locale.gen` y descomentamos la línea `es_ES.UTF-8 UTF-8`. Ejecutamos la orden `echo es_ES.UTF-8 > /etc/locale.conf` y luego generamos los locales con la orden `locale-gen`.

Para hacer fija la distribución del teclado que conseguimos usando `loadkeys` invocamos `echo KEYMAP= > /etc/vconsole.conf`.

Ejecutamos `grub-install /dev/sda` y `grub-mkconfig -o /boot/grub/grub.cfg` para dejar configurado el gestor de arranque grub. Luego generamos el disco RAM inicial con `mkinitcpio -p linux`.

Establecemos la contraseña del administrador con `passwd` y ya podemos salir del entorno charoot con `exit`.

Finalmente desmontamos las particiones con `umount /mtn/boot` y `umount /mnt` y reiniciamos el sistema.


## Instalación del entrono básico

Al reiniciar el equipo iniciamos sesión como root y probamos si tenemos acceso a la red. Si no debemos ejecutar `dhcpcd enp4s0` para solicitar una dirección de red. 

Una vez obtenido el acceso a la red pedimos al sistema que se actualice con `pacman -Syu`.

Instalamos los paquetes necesarios para el funcionamiento del servidor gráfico xorg con `pacman -S xorg-server xorg-xinit xorg-utils xorg-server-utils`, para el soporte 3D con `pacman -S mesa mesa-demos` y para la tarjeta gráfica ATI con `pacman -S xf86-video-ati`.

Como trabajar con el usuario administrador no es una práctica recomendable creamos un nuevo usuario llamado `miguel` con `useradd -m -g users -s /bin/bash miguel` y fiajmos su contraseña invocando `passwd miguel`.

Instalamos sudo con `pacman -S sudo` y con `EDITOR=nano visudo` descomentamos la línea `%wheel ALL=(ALL)ALL` y guardamos los cambios. Ahora con añadir al usuario `miguel` al grupo `wheel` usando `gpasswd -a miguel wheel` tenemos que el nuevo usuario puede usar sudo para ejecutar comandos como administrador.

Salimos de la sesión del administrador con `logout` e iniciamos sesión con el nuevo usuario. 

Vamos a instalar el window manager predeterminado de X11 para probar que todo ha ido bien hasta el momento. Ejecutamos 
`sudo pacman -S xorg-twm xorg-xclock xterm` y, una vez instalado, lo arrancamos con `startx`.












