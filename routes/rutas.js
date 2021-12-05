const { Router } = require('express');
const router = Router();

router.get('/GetProduct', async (req, res) => {
    try {
        console.log(process.pid);
        return res.status(200).json({
            ok: true,
            msg: 'GetProduct'
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            ok: false,
            msg: 'Error, hable con el admin'
        });
    }
});

router.post('/addProduct', async (req, res) => {
    try {
        console.log(process.pid);
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

module.exports = router;