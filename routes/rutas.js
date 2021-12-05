const { Router } = require('express');
const router = Router();

router.get('/addProduct', async (req, res) => {
    try {
        return res.status(200).json({
            ok: true,
            msg: 'addProduct'
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            ok: false,
            msg: 'Error, hable con el admin'
        });
    }
});

router.get('/GetProduct', async (req, res) => {
    try {
        return res.status(200).json({
            ok: true,
            msg: process.pid
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            ok: false,
            msg: 'Error, hable con el admin'
        });
    }
});

module.exports = router;