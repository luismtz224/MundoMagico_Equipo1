const express = require('express');
const router = express.Router();

let pagos = [];

// CREATE
router.post('/', (req, res) => {
    const pago = req.body;
    pagos.push(pago);
    res.json({ mensaje: "Pago registrado", pagos });
});

// READ
router.get('/', (req, res) => {
    res.json(pagos);
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = req.params.id;
    pagos[id] = req.body;
    res.json({ mensaje: "Pago actualizado", pagos });
});

// DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    pagos.splice(id, 1);
    res.json({ mensaje: "Pago eliminado", pagos });
});

module.exports = router;
