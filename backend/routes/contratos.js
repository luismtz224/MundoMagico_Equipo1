const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM CONTRATOS', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const {
        RESERVACIONES_COTIZACIONES_id_cotizaciones,
        RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes,
        RESERVACIONES_id_reservaciones,
        RESERVACIONES_USUARIOS_id_usuario,
        fecha_firma
    } = req.body;
    db.query(
        `INSERT INTO CONTRATOS 
        (RESERVACIONES_COTIZACIONES_id_cotizaciones, RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes, 
        RESERVACIONES_id_reservaciones, RESERVACIONES_USUARIOS_id_usuario, fecha_firma) 
        VALUES (?, ?, ?, ?, ?)`,
        [RESERVACIONES_COTIZACIONES_id_cotizaciones, RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes,
        RESERVACIONES_id_reservaciones, RESERVACIONES_USUARIOS_id_usuario, fecha_firma],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Contrato guardado', id: result.insertId });
        }
    );
});

module.exports = router;
