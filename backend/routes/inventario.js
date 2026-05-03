const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM INVENTARIO', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nombre_item, cantidad_total, en_uso, estado_actual } = req.body;
    if (!nombre_item || !cantidad_total || !estado_actual) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    db.query(
        'INSERT INTO INVENTARIO (nombre_item, cantidad_total, en_uso, estado_actual) VALUES (?, ?, ?, ?)',
        [nombre_item, cantidad_total, en_uso || 0, estado_actual],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Artículo agregado', id: result.insertId });
        }
    );
});

router.put('/:id', (req, res) => {
    const { cantidad_total, en_uso, estado_actual } = req.body;
    db.query(
        'UPDATE INVENTARIO SET cantidad_total = ?, en_uso = ?, estado_actual = ? WHERE id_inventario = ?',
        [cantidad_total, en_uso, estado_actual, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Artículo actualizado' });
        }
    );
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM INVENTARIO WHERE id_inventario = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Artículo eliminado' });
    });
});

module.exports = router;