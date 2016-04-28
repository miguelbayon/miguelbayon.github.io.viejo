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












