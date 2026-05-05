const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
    const { fecha } = req.query;
    let whereClause = '';
    let params      = [];

    if (fecha) {
        whereClause = 'WHERE DATE(p.fecha_pago) = ?';
        params.push(fecha);
    }

    // Query ingresos
    const sqlIngresos = `
        SELECT
            p.id_pagos,
            p.fecha_pago  AS fecha,
            p.concepto,
            p.Monto       AS monto,
            p.metodo_pago,
            r.tipo_evento,
            cl.NombreCompleto
        FROM pagos p
        LEFT JOIN reservaciones r  ON r.id_reservaciones = p.RESERVACIONES_id_reservaciones
        LEFT JOIN clientes cl      ON cl.id_clientes = r.COTIZACIONES_CLIENTES_id_clientes
        ${whereClause}
        ORDER BY p.fecha_pago DESC
    `;

    // Query egresos
    const whereEgreso = fecha ? 'WHERE DATE(fecha_egreso) = ?' : '';
    const sqlEgresos  = `SELECT * FROM EGRESOS ${whereEgreso} ORDER BY fecha_egreso DESC`;

    db.query(sqlIngresos, params, (err, pagos) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(sqlEgresos, fecha ? [fecha] : [], (err2, egresos) => {
            if (err2) return res.status(500).json({ error: err2.message });

            const totalIngresos = pagos.reduce((s, p) => s + (parseFloat(p.monto) || 0), 0);
            const totalEgresos  = egresos.reduce((s, e) => s + (parseFloat(e.monto) || 0), 0);

            const movimientos = [
                ...pagos.map(p => ({
                    fecha    : p.fecha,
                    concepto : p.concepto || (p.tipo_evento ? `Pago – ${p.tipo_evento}` : 'Pago de Evento'),
                    cliente  : p.NombreCompleto || '—',
                    tipo     : 'Ingreso',
                    monto    : parseFloat(p.monto) || 0,
                    metodo   : p.metodo_pago || '—'
                })),
                ...egresos.map(e => ({
                    fecha    : e.fecha_egreso,
                    concepto : e.concepto || '—',
                    cliente  : e.categoria || '—',
                    tipo     : 'Egreso',
                    monto    : parseFloat(e.monto) || 0,
                    metodo   : '—'
                }))
            ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            res.json({
                total_ingresos : totalIngresos,
                total_egresos  : totalEgresos,
                saldo_neto     : totalIngresos - totalEgresos,
                movimientos
            });
        });
    });
});

// POST registrar egreso
router.post('/egreso', (req, res) => {
    const { concepto, monto, fecha_egreso, categoria } = req.body;
    if (!concepto || !monto || !fecha_egreso) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    db.query(
        'INSERT INTO EGRESOS (concepto, monto, fecha_egreso, categoria) VALUES (?, ?, ?, ?)',
        [concepto, monto, fecha_egreso, categoria || 'General'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Egreso registrado', id: result.insertId });
        }
    );
});

module.exports = router;