const express = require('express');
const router = express.Router();

let pagos = []; // Simulación

router.get('/', (req, res) => {
    let total = 0;

    pagos.forEach(pago => {
        total += pago.monto || 0;
    });

    res.json({
        totalPagos: total,
        cantidad: pagos.length
    });
});

module.exports = router;
