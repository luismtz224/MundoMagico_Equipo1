const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM CLIENTES', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { NombreCompleto, Telefono, Correo } = req.body;
    db.query(
        'INSERT INTO CLIENTES (NombreCompleto, Telefono, Correo) VALUES (?, ?, ?)',
        [NombreCompleto, Telefono, Correo],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Cliente guardado', id: result.insertId });
        }
    );
});

module.exports = router;