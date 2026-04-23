const express = require('express');
const router = express.Router();

let recordatorios = [];

// CREATE
router.post('/', (req, res) => {
    const recordatorio = req.body;
    recordatorios.push(recordatorio);
    res.json({ mensaje: "Recordatorio registrado", recordatorios });
});

// READ
router.get('/', (req, res) => {
    res.json(recordatorios);
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = req.params.id;
    recordatorios[id] = req.body;
    res.json({ mensaje: "Recordatorio actualizado", recordatorios });
});

// DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    recordatorios.splice(id, 1);
    res.json({ mensaje: "Recordatorio eliminado", recordatorios });
});

module.exports = router;
