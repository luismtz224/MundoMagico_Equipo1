const express = require('express');
const router = express.Router();
const db = require('../db');

// Resumen financiero: total ingresos, egresos y movimientos
router.get('/', (req, res) => {
    const queryIngresos = 'SELECT SUM(Monto) AS total_ingresos FROM PAGOS';
    const queryMovimientos = 'SELECT fecha_pago, Monto, metodo_pago FROM PAGOS ORDER BY fecha_pago DESC LIMIT 50';

    db.query(queryIngresos, (err, resumen) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(queryMovimientos, (err2, movimientos) => {
            if (err2) return res.status(500).json({ error: err2.message });

            res.json({
                total_ingresos: resumen[0].total_ingresos || 0,
                movimientos
            });
        });
    });
});

module.exports = router;
