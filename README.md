Este proyecto fue realizado utilizando el SO Ubuntu 20.04, una distrubución de Linnux basado en Debian.

Para poder iniciar el servidor, debe instalar los siguientes paquetes: Node.js - Express - Nodemon - npm

-Instalación de Node: en la consola debemos escribir los siguientes comandos y espera a que cada uno de ellos finalice: 
        
                      curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                      sudo apt-get install -y nodejs
         En caso de no tener instalado curl, siga las indicaciones que se le mostraran en su consola.
         
Luego en la carpeta que haya clonado este repositorio, debe ejecutar el siguiente comando:
                      npm install
                      
Este comando descargara automanticamente todas las dependencias que requiere el proyecto, en este caso son express y nodemon.

Una vez completados estos pasos, su servidor estará listo para arrancar con el comando:  npm run dev

Ahora, para la instalación de redis, debe ejecutar los siguientes comandos y esperar a que cada uno de ellos finalice:

                      sudp apt update
                      sudo apt install -y redis
                      sudo apt install redis-tools
                      
Ya tenemos intalado redis, ahora vamos a comprobar si fue correcta su instalación y si está operando, para esto debemos ejecutar los
siguientes comandos y esperar a que cada uno de ellos finalice:
            
                      redis-cli
          
          Al ejecutar este comando tendremos corriendo nuestro servidor de redis, se mostrará nuestra dirección de localhost junto con
          un puerto por defecto, el cual suele tener este aspecto: 127.0.0.1:6379>
          para verificar que todo está en orden, debemos escribir el comando "ping", sin comillas y todo en minúsculas, a lo que se nos
          contestará con un "PONG", lo que indica que tenemos conexión.
          
Ahora debemos setear algunos valores, para esto, dentro del servicio de redis, debemos introducir los siguientes comandos:

                      config get maxmemory
                      config set maxmemory 1M
                      config set maxmemory-policy volatile-lru
el primero comando es para ver la configuracion de la memoria maxima que puede utilizar reddis; el segundo comando setea la memoria maxima en 1mb, y finalmente el ultimo comando configura el uso de memoria con el algoritmo de lru, el cual consiste en que en el caso de que se llena la memoria de 1mb, se eliminara el dato mas antiguo en memoria siempre y cuando este libere el espacio necesario para insertar el nuevo dato.

Teniendo todas estas configuraciones, el servicio completo está listo para usarse ;D

Cabe recalcar que en nuestra tarea, la ruta de buscador si hace la verificacion de si el busqueda ya se encuentra en la cache, pero si no la encuentra, este accede directamente al archivo json donde se encuentra el inventario, esto debido a que no logramos implementar la comunicacion con mediante el metodo grpc con el servidor.
                    
          
          
          
