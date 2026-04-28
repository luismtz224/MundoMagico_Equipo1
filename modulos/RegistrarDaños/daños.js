const express = require('express');
const router = express.Router();

let danos = [];

// CREATE
router.post('/', (req, res) => {
    const dano = req.body;
    danos.push(dano);
    res.json({ mensaje: "Daño registrado", danos });
});

// READ
router.get('/', (req, res) => {
    res.json(danos);
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = req.params.id;
    danos[id] = req.body;
    res.json({ mensaje: "Daño actualizado", danos });
});

// DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    danos.splice(id, 1);
    res.json({ mensaje: "Daño eliminado", danos });
});

module.exports = router;
