const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { usuario, contraseña } = req.body;

    // Por ahora, solo para probar:
    if (usuario === "admin" && contraseña === "1234") {
        return res.json({ mensaje: "Login correcto ✔️" });
    }

    res.status(401).json({ mensaje: "Credenciales incorrectas ❌" });
});

module.exports = router;
