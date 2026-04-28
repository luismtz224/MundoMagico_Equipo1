const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.post('/', (req, res) => {
    const { NombreUsuario, Contrasena } = req.body;

    if (!NombreUsuario || !Contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    db.query('SELECT * FROM USUARIOS WHERE NombreUsuario = ?', [NombreUsuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const usuario = results[0];
        const passDB  = String(usuario.Contraseña || '');
        const passIn  = String(Contrasena || '');

        if (passDB !== passIn) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        res.json({
            usuario: {
                id:     usuario.id_usuario,
                nombre: usuario.NombreUsuario,
                tipo:   usuario.tipo_usuario
            }
        });
    });
});

module.exports = router;