const express = require('express');
const router = express.Router();

let usuarios = [];

// CREATE
router.post('/', (req, res) => {
    const usuario = req.body;
    usuarios.push(usuario);
    res.json({ mensaje: "Usuario agregado", usuarios });
});

// READ
router.get('/', (req, res) => {
    res.json(usuarios);
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = req.params.id;
    usuarios[id] = req.body;
    res.json({ mensaje: "Usuario actualizado", usuarios });
});

// DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    usuarios.splice(id, 1);
    res.json({ mensaje: "Usuario eliminado", usuarios });
});

module.exports = router;
