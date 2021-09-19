const { Router } = require('express');
const router = Router();

router.get('/search?', (req, res) => {
    // Ejemplo en postman
    // localhost:3000/inventory/search?q=cpu
    let buscar = req.query.q;
    // Buscamos en inventario el q solicitado

    // Retornamos al cliente
    res.json({
        msg: buscar
    });
});

module.exports = router;