// ── USUARIOS ─────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos los usuarios
router.get('/', (req, res) => {
    db.query('SELECT id_usuario, NombreUsuario, tipo_usuario FROM USUARIOS', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST crear usuario
router.post('/', (req, res) => {
    const { NombreUsuario, Contraseña, tipo_usuario } = req.body;
    db.query(
        'INSERT INTO USUARIOS (NombreUsuario, Contraseña, tipo_usuario) VALUES (?, ?, ?)',
        [NombreUsuario, Contraseña, tipo_usuario],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Usuario creado', id: result.insertId });
        }
    );
});

// DELETE eliminar usuario
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM USUARIOS WHERE id_usuario = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Usuario eliminado' });
    });
});

module.exports = router;
