const express = require('express');
const router = express.Router();

let contratos = [];

// CREATE
router.post('/', (req, res) => {
    const contrato = req.body;
    contratos.push(contrato);
    res.json({ mensaje: "Contrato creado", contratos });
});

// READ
router.get('/', (req, res) => {
    res.json(contratos);
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = req.params.id;
    contratos[id] = req.body;
    res.json({ mensaje: "Contrato actualizado", contratos });
});

// DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    contratos.splice(id, 1);
    res.json({ mensaje: "Contrato eliminado", contratos });
});

module.exports = router;
