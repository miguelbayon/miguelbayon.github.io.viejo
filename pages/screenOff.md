# Como apagar la pantalla en Linux con i3

La manera más eficaz que he encontrado es usar el siguiente script:

    #!/bin/bash
    screenOffLockFile=/tmp/screen-off-lock
     
    if [ -f $screenOffLockFile ];
    then
            rm $screenOffLockFile
      notify-send "Screen on." -i /usr/share/icons/gnome/48x48/devices/display.png
    else
            touch $screenOffLockFile
            sleep .5
            while [ -f  $screenOffLockFile ]
            do
                    xset dpms force off
                    sleep 2
            done
            xset dpms force on
    fi
    
    
Lo guardamos en un archivo llamado `.screenoff` en nuestra carpeta personal, le damos persmisos de ejecución y luego añadimos al archivo de configuración de i3 (`~/.config/i3/config` ) la siguiente línea:

    bindsym $mod+Shift+o exec /home/miguel/.screenOff


Ahora, cada vez que pulsemos las teclas `Windows`+`Shift`+`o` apagaremos la pantalla, debiendo pulsar la misma combinación para encenderla de nuevo.
