const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM REPORTE_DANOS', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const {
        RESERVACIONES_COTIZACIONES_id_cotizaciones,
        RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes,
        RESERVACIONES_id_reservaciones,
        INVENTARIO_id_inventario,
        RESERVACIONES_USUARIOS_id_usuario,
        USUARIOS_id_usuario,
        Descripcion,
        costo_estimado
    } = req.body;

    db.query(
        `INSERT INTO REPORTE_DANOS 
        (RESERVACIONES_COTIZACIONES_id_cotizaciones, RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes,
        RESERVACIONES_id_reservaciones, INVENTARIO_id_inventario, RESERVACIONES_USUARIOS_id_usuario,
        USUARIOS_id_usuario, Descripcion, costo_estimado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [RESERVACIONES_COTIZACIONES_id_cotizaciones, RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes,
        RESERVACIONES_id_reservaciones, INVENTARIO_id_inventario, RESERVACIONES_USUARIOS_id_usuario,
        USUARIOS_id_usuario, Descripcion, costo_estimado],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Reporte guardado', id: result.insertId });
        }
    );
});

module.exports = router;
