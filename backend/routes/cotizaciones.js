const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM COTIZACIONES', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { CLIENTES_id_clientes, fecha_emision, monto_estimado, detalles } = req.body;
    db.query(
        'INSERT INTO COTIZACIONES (CLIENTES_id_clientes, fecha_emision, monto_estimado, detalles) VALUES (?, ?, ?, ?)',
        [CLIENTES_id_clientes, fecha_emision, monto_estimado, detalles],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Cotización guardada', id: result.insertId });
        }
    );
});

module.exports = router;
