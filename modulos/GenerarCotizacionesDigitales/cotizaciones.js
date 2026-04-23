const express = require('express');
const router = express.Router();

let cotizaciones = [];

// CREATE
router.post('/', (req, res) => {
    const cotizacion = req.body;
    cotizaciones.push(cotizacion);
    res.json({ mensaje: "Cotización generada", cotizaciones });
});

// READ
router.get('/', (req, res) => {
    res.json(cotizaciones);
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = req.params.id;
    cotizaciones[id] = req.body;
    res.json({ mensaje: "Cotización actualizada", cotizaciones });
});

// DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    cotizaciones.splice(id, 1);
    res.json({ mensaje: "Cotización eliminada", cotizaciones });
});

module.exports = router;
