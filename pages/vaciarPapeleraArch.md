# Cómo vaciar el contenido de la papelera en Arch

Lo más cómodo es utilizar el comando `alias` para poder ejecutar el comando de borrado de los archivos almacenados en la papelera con un solo comando:

    alias empty='rm -rf /home/miguel/.local/share/Trash/files'

Ahora ya podemos ejecutar en la terminal:

    empty
