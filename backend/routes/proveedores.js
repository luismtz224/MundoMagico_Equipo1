const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM PROVEEDORES_EXTERNOS', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nombre_empresa, servicio, contacto } = req.body;
    db.query(
        'INSERT INTO PROVEEDORES_EXTERNOS (nombre_empresa, servicio, contacto) VALUES (?, ?, ?)',
        [nombre_empresa, servicio, contacto],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Proveedor agregado', id: result.insertId });
        }
    );
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM PROVEEDORES_EXTERNOS WHERE id_proveedores = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Proveedor eliminado' });
    });
});

module.exports = router;
