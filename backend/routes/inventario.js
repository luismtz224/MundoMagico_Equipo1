const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todo el inventario
router.get('/', (req, res) => {
    db.query('SELECT * FROM INVENTARIO', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST agregar artículo
router.post('/', (req, res) => {
    const { nombre_item, cantidad_total, estado_actual } = req.body;
    db.query(
        'INSERT INTO INVENTARIO (nombre_item, cantidad_total, estado_actual) VALUES (?, ?, ?)',
        [nombre_item, cantidad_total, estado_actual],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Artículo agregado', id: result.insertId });
        }
    );
});

// PUT editar existencias
router.put('/:id', (req, res) => {
    const { cantidad_total, estado_actual } = req.body;
    db.query(
        'UPDATE INVENTARIO SET cantidad_total = ?, estado_actual = ? WHERE id_inventario = ?',
        [cantidad_total, estado_actual, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Artículo actualizado' });
        }
    );
});

module.exports = router;
