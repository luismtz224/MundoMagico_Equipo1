const express = require('express');
const router = express.Router();

let proveedores = [];

// CREATE
router.post('/', (req, res) => {
    const proveedor = req.body;
    proveedores.push(proveedor);
    res.json({ mensaje: "Proveedor agregado", proveedores });
});

// READ
router.get('/', (req, res) => {
    res.json(proveedores);
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = req.params.id;
    proveedores[id] = req.body;
    res.json({ mensaje: "Proveedor actualizado", proveedores });
});

// DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    proveedores.splice(id, 1);
    res.json({ mensaje: "Proveedor eliminado", proveedores });
});

module.exports = router;
