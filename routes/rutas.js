const { Router } = require('express');
const router = Router();
const kafka = require('kafka-node');


router.post('/orders', (req, res) => {
    const data = JSON.stringify(req.body);
    
    // Conexiones
    const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
    var producer = new kafka.Producer(client);
    
    // Guardamos en orders
    producer.on('ready', async function () {
        producer.send( [ { topic: "orders", messages: data }], function (err,data) {console.log('guardado en topic orders')} )
    });

    return res.status(200).json({
        ok: true,
        msg: 'orden ingresada'
    });
});

router.get('/DailySummary', async (req, res) => {
    const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
    var consumer = new kafka.Consumer(client, [ { topic: 'orders' } ]);
    await consumer.on('message', function (message) {
    	console.log(message);
	});
    // Desconectemos al consumidor
    return res.status(200).json({
        ok: true,
        msg: 'daily'
    });
});

// router.get('/DailySummary', async (req, res) => {
//     const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
//     var consumer = new kafka.Consumer(client, [ { topic: 'orders' } ]);
//     arr=[]
//     contador=0
//     //Escucha solo por 10 segundos y corta la coxion, cuando deja de escucha envia un mensaje
//     dia=setInterval(function() {
//         consumer.on('message', function (message) {
//             console.log(message);
//             arr.push(message);
//         });
//         contador=contador+1
//     }, 2000);

//     if (contador== 2){
//         clearInterval(dia);
//         console.log(arr);
//     }

//     consumer.removeTopics(['orders'], function (err, removed) {
//         return res.status(200).json({
//             ok: true,
//             msg: 'daily'
//         });
//     });
//     // Desconectemos al consumidor
// });

module.exports = router;