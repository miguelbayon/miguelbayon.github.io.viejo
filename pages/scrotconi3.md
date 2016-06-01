# Usar scrot para tomar capturas de pantalla en i3 sobre Arch

Para utilizar `scrot` debemos primeramente instalarlo:

    sudo pacman -Sy scrot
    
Una vez instalado, añadimos en el archivo de configuración de i3 las siguientes líneas:

    # toma capturas de pantalla
    bindsym Print exec scrot -q 90 -t 25
    bindsym $mod+Print exec scrot -u -q 90 -t 25
    bindsym $mod+Shift+Print exec scrot -s -q 90 -t 25
    
De este modo conseguimos:

* Hacer una captura de todo el escritorio usando la tecla `Imprimir pantalla` a calidad 90% y creando simultaneamente una miniatura al 25% del tamaño.
* Hacer una captura de la ventana actual usando la tecla Super de i3 junto a `Imprimir pantalla`.
* Hacer una captura de un area marcada con el raton usando las teclas `Shift`+`Super`+`Imprimir pantalla`.
