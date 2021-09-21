const { Router } = require('express');
const router = Router();
const fs = require('fs');

const redis = require("redis");
const client = redis.createClient();

client.on("error", function(error) {
  console.error(error);
});

//conexion reddis-cli
client.set("Jose",'3000','arteaga', redis.print);
const aux2=client.get("Jose", redis.print);
console.log(aux2);


let data= fs.readFileSync('./jsonexam.json');
data=JSON.parse(data).products;
router.get('/search?', (req, res) => {
	const aux=[];
	console.log(data);
    // Ejemplo en postman
    // localhost:3000/inventory/search?q=cpu
    	let buscar = req.query.q;
    // Buscamos en inventario el q solicitado
	data.forEach(elemento => {
		if(elemento.name.includes(buscar)){
				console.log('mash : ',elemento);
				aux.push(elemento)
		}
	});
	

    // Retornamos al cliente
    res.json({
        msg: aux
    });
});

module.exports = router;
