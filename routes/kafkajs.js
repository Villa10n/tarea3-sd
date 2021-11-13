const { Router } = require('express');
const router = Router();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

router.post('/orders', async (req, res) => {
    const data = JSON.stringify(req.body);
    
    // Conexiones
    const producer = kafka.producer();
    
    // Guardamos en orders
    await producer.connect()
    await producer.send({
        topic: 'orders',
        messages: [
            { value: data },
        ],
    });

    await producer.disconnect()

    return res.status(200).json({
        ok: true,
        msg: 'orden ingresada'
    });
});

router.get('/DailySummary', async (req, res) => {
    const consumer = kafka.consumer({ groupId: 'test-group' });

    arr = [];

    await consumer.connect();
    await consumer.subscribe({ topic: 'orders', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            arr.push(message.value.toString());
        },
    });

    setTimeout(async function() {
        await consumer.disconnect();
        console.log(arr);
    }, 10000);

    // Desconectemos al consumidor
    return res.status(200).json({
        ok: true,
        msg: 'daily'
    });
});

module.exports = router;