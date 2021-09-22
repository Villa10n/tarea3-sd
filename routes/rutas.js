const { Router } = require('express');
const router = Router();
const fs = require('fs');
const { ClientRequest } = require('http');

const redis = require("redis");
const client = redis.createClient(6379 ,'127.0.0.1');

// conexion reddis-cli
client.on("error", function(error) {
    console.error(error);
});

router.get('/search?', async (req, res) => {
    // Ejemplo: localhost:3000/inventory/search?q=cpu
    let buscar = req.query.q;
    
    // Buscamos en cache lo solicitado
    if (client.exists(buscar,  function(err, reply) {
        if (reply == 1) {
            console.log('existe en cache');
            client.get(buscar, function(err, reply) {
                let products = JSON.parse(reply);
                return res.json({
                    products
                });
            });
        }
        else {
            console.log('no existe en cache');
            // Buscamos en inventario el q solicitado
            const aux = [];
            let data = fs.readFileSync('./jsonexam.json');
            data = JSON.parse(data).products;
            data.forEach(elemento => {
                if (elemento.name.includes(buscar)) {
                    aux.push(elemento);
                }
            });
            client.set(buscar, JSON.stringify(aux), 'EX', 60 * 60 * 24);

            // Retornamos al cliente
            return res.json({
                products: aux
            });
        }
    }));
});

module.exports = router;