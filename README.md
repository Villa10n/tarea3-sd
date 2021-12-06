Integrantes: Jose Arteaga, Diego Saavedra, Joaquin  Villalon


Este proyecto fue realizado utilizando el SO Ubuntu 20.04, una distrubución de Linnux basado en Debian.

Para poder iniciar el servidor, debe instalar los siguientes paquetes: Node.js - Express - Nodemon - npm

-Instalación de Node: en la consola debemos escribir los siguientes comandos y espera a que cada uno de ellos finalice: 
        
                      curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                      sudo apt-get install -y nodejs
         En caso de no tener instalado curl, siga las indicaciones que se le mostraran en su consola.
         
Luego en la carpeta que haya clonado este repositorio, debe ejecutar el siguiente comando:
                      npm install
                      
Este comando descargara automáticamente todas las dependencias que requiere el proyecto, en este caso son express y nodemon.

Una vez completados estos pasos, su servidor estará listo para arrancar con el comando que veremos más adelante.
Ahora debemos instalar el balanceador de carga, para este caso haremos uso de NGINX, cuya instalación se realiza mediante el siguiente comando:
                      sudp apt update
                      sudo apt install nginx
                      
Ya tenemos instalado NGINX, ahora debemos configurarlo, para esto debemos introducir por consola las siguientes lineas de comando:
            
                      sudo touch /etc/nginx/conf.d/load-balancer.conf
                      sudo rm -r /etc/nginx/sites-enabled/default
                      sudo systemctl restart nginx
                      sudo nano /etc/nginx/conf.d/load-balancer.conf
          
Una vez llegado a este punto, podemos apreciar que el editor de texto __nano__ se habrá desplegado, dentro de este debemos fijar el siguiente archivo de configuración;
                        
                      upstream backend{
                        server localhost:3000;
                        server localhost:3001;
                        server localhost:3002;
                        }
                      server{
                        listen 80;
                        location / {
                                proxy_pass http://backend;
                                }
                        }
                     
                      
Para guardar estos cambios, debemos oprimir CTRL+X, luego la letra __S__ y finalmente aceptar y abremos salido del editor de texto. Realizado esto, añadomos el siguiente comando por consola:
```
                       sudo systemctl restart nginx
```

Con esto tendremos operativo nuestro balanceador de carga.
Ahora debe ejecutar los 3 servidores, para esto una vez clonado este repositorio, debe arrancar los servidores indicando los puertos donde serán ejecutados, para esto debe abrir 3 terminales distintas dentro de la carpeta, y ejecutar los siguientes comandos, cada uno en una terminal distinta.
``` 
                      PORT=3000 node index.js
		      PORT=3001 node index.js
		      PORT=3002 node index.js
```

Una vez usados cada uno de los comandos anteriores en una terminal distinta, tendremos nuestros servidores en marcha.
Para configurar la base de datos mediante la arquitectura Master-Slave, debemos primero instalar Docker, con fines de simplificación de uso.
Para ello debe dirigirse al siguiente sitio web: https://hub.docker.com/editions/community/docker-ce-desktop-windows , donde encontrará el instalador correspondiente a Windows10, luego debe seguir los pasos que se indican para que su Docker quede instalado correctamente.

Para la configuración de la base de datos MASTER, debemos ingresar esta serie de comandos en nuestro Docker.

```
		     docker run -dti -p 55432:5432 --name postgresql-master \
  		     -e POSTGRESQL_REPLICATION_MODE=master \
 		     -e POSTGRESQL_USERNAME=user1 \
 		     -e POSTGRESQL_PASSWORD=password1 \
 		     -e POSTGRESQL_DATABASE=my_database \
 		     -e POSTGRESQL_REPLICATION_USER=user2 \
 		     -e POSTGRESQL_REPLICATION_PASSWORD=password2 \
 		     bitnami/postgresql:latest     
```
          
En lo que respecta a la base de datos SLAVE, la cual actuará como nuestra réplica, debemos usar los siguientes comandos dentro de nuestro Docker.

```
                     docker run -dti -p 65432:5432
                     --name postgresql-slave --link postgresql-master:master
                     -e POSTGRESQL_REPLICATION_MODE=slave
                     -e POSTGRESQL_USERNAME=user1
                     -e POSTGRESQL_PASSWORD=password1
                     -e POSTGRESQL_MASTER_HOST=master
                     -e POSTGRESQL_MASTER_PORT_NUMBER=5432
                     -e POSTGRESQL_REPLICATION_USER=user2
                     -e POSTGRESQL_REPLICATION_PASSWORD=password2
                     bitnami/postgresql:latest

```
Una vez terminados estos pasos, todo está listo para su configuración.
