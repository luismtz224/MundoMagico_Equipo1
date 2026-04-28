const express = require('express');
const router = express.Router();

let inventario = [];

// CREATE - Registrar artículo
router.post('/', (req, res) => {
    const item = req.body;
    inventario.push(item);
    res.json({ mensaje: "Artículo agregado al inventario", inventario });
});

// READ - Listado de existencias
router.get('/', (req, res) => {
    res.json(inventario);
});

// UPDATE - Actualizar artículo
router.put('/:id', (req, res) => {
    const id = req.params.id;
    inventario[id] = req.body;
    res.json({ mensaje: "Artículo actualizado", inventario });
});

// DELETE - Eliminar artículo
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    inventario.splice(id, 1);
    res.json({ mensaje: "Artículo eliminado", inventario });
});

module.exports = router;
