const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM PAGOS ORDER BY fecha_pago DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const {
        RESERVACIONES_id_reservaciones,
        RESERVACIONES_COTIZACIONES_id_cotizaciones,
        RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes,
        RESERVACIONES_USUARIOS_id_usuario,
        USUARIOS_id_usuario,
        Monto, fecha_pago, metodo_pago, concepto
    } = req.body;

    db.query(
        `INSERT INTO PAGOS 
        (RESERVACIONES_COTIZACIONES_id_cotizaciones, RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes,
        RESERVACIONES_id_reservaciones, RESERVACIONES_USUARIOS_id_usuario, USUARIOS_id_usuario,
        Monto, fecha_pago, metodo_pago, concepto) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [RESERVACIONES_COTIZACIONES_id_cotizaciones, RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes,
        RESERVACIONES_id_reservaciones, RESERVACIONES_USUARIOS_id_usuario, USUARIOS_id_usuario,
        Monto, fecha_pago, metodo_pago, concepto || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Pago registrado', id: result.insertId });
        }
    );
});

module.exports = router;