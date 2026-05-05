const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM RESERVACIONES', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const {
        COTIZACIONES_CLIENTES_id_clientes,
        COTIZACIONES_id_cotizaciones,
        USUARIOS_id_usuario,
        fecha_evento, hora_inicio, hora_fin,
        tipo_evento, estado
    } = req.body;

    // Verificar fecha duplicada (ignorar cancelados)
    db.query(
        "SELECT * FROM RESERVACIONES WHERE fecha_evento = ? AND estado != 'Cancelado'",
        [fecha_evento],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                const fechaFormateada = new Date(fecha_evento).toLocaleDateString('es-MX');
                return res.status(409).json({
                    error: `Ya existe un evento agendado para el ${fechaFormateada}. Por favor elige otra fecha.`
                });
            }

            db.query(
                `INSERT INTO RESERVACIONES 
                (COTIZACIONES_CLIENTES_id_clientes, COTIZACIONES_id_cotizaciones, USUARIOS_id_usuario,
                fecha_evento, hora_inicio, hora_fin, tipo_evento, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [COTIZACIONES_CLIENTES_id_clientes, COTIZACIONES_id_cotizaciones, USUARIOS_id_usuario,
                fecha_evento, hora_inicio, hora_fin, tipo_evento, estado],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ mensaje: 'Reservación guardada', id: result.insertId });
                }
            );
        }
    );
});

// PUT cancelar reservación
router.put('/:id', (req, res) => {
    const { estado } = req.body;
    db.query(
        'UPDATE RESERVACIONES SET estado = ? WHERE id_reservaciones = ?',
        [estado, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Reservación actualizada' });
        }
    );
});

module.exports = router;