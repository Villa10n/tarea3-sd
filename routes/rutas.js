const { Router } = require('express');
const router = Router();
const { Pool } = require('pg')

const connectionMaster={
	user:'user1',
	host:'localhost',
	database:'postgres',
	password:'password1',
	port: 55432,
}

const connectionSlave={
	user:'user1',
	host:'localhost',
	database:'postgres',
	password:'password1',
	port: 65432,
}


router.get('/GetProduct', async (req, res) => {
	try {
		const pool = new Pool(connectionSlave);
		resp = await pool.query('select * from producto');
		console.log(resp.rows);
		return res.status(200).json({
		    ok: false,
		    msg:resp.rows,
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
    	const{nombre,precio}=req.body;
    	const pool = new Pool(connectionMaster);
    	
        resp = await pool.query("insert into producto(nombre,precio) values($1,$2)",[nombre,precio]);

        console.log(process.pid);
        return res.status(200).json({
            ok: true,
            msg: 'addProduct Exitoso'
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
