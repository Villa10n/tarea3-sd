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
```
                      sudo apt update
                      sudo apt install nginx
````
                      
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
Para la creación de tablas en las bases de datos creadas en docker, se utilizó una herramienta llamada Datagrip (disponible en los softwares de ubuntu), la cual es un gestor de bases de datos. Primero se creó una conexión del tipo postgres, en la cual se establecieron los parámetros de conexión del contendor del docker __master__, que son el puerto 55432 y el user1 y password1, y luego se creo otra conexión del mismo, tipo __slave__ que con los parámetros del docker slave, que son puerto 65432 y user1 y password1. 
Luego de la creación de las conexiones a las distintas replicas de la base de datos, se crea la table en la consola de la conexión __master__, con el siguiente comando.

```
create table table_name
(
    id     serial
        constraint table_name_pk
            primary key,
    nombre varchar(255),
    precio int
);
```
Creando la tabla en el master, los cambios efectuados se replicarán a las otras bases de datos esclavas.
Con la creación de las tablas se finalizan los requerimientos para que el experimento funcione. Ahora queda usar la herramienta de __Postman__ para obtener e insertar los productos. Para ello primero se insertara un producto con la siguiente url:

		localhost/addProduct
y se envía un post con el siguiente contenido:
```
{
    "nombre":"Bolsita de Tabletones",
    "precio":999
} 
```
, donde localhost esta siendo afectado por NGINX y dirige a una  de las 3 instancias, y add/Porduct es una de las rutas que específicamente utiliza la conexión con el contenedor master de psql. luego, para obtener el listado de productos hacemos una petición del tipo get a la siguiente url:

		localhost/GetProduct
		
que al igual que la url anterior, es afectada por NGINX y redirige la consulta a una de las 3 instancias, esta ruta utiliza solo la conexión al contenedor esclavo
y se obtiene las filas de la tabla productos. Con esto todo el proceso queda terminado.
