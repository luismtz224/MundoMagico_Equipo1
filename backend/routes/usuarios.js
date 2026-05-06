const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT id_usuario, NombreCompleto, NombreUsuario, tipo_usuario, activo FROM USUARIOS', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { NombreCompleto, NombreUsuario, Contrasena, tipo_usuario } = req.body;
    if (!NombreUsuario || !Contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    db.query(
        'INSERT INTO USUARIOS (NombreCompleto, NombreUsuario, Contraseña, tipo_usuario, activo) VALUES (?, ?, ?, ?, 1)',
        [NombreCompleto, NombreUsuario, Contrasena, tipo_usuario],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Usuario creado', id: result.insertId });
        }
    );
});

router.put('/:id', (req, res) => {
    const { NombreCompleto, NombreUsuario, Contrasena, tipo_usuario, activo } = req.body;

    let query  = 'UPDATE USUARIOS SET NombreCompleto=?, NombreUsuario=?, tipo_usuario=?, activo=?';
    let params = [NombreCompleto, NombreUsuario, tipo_usuario, activo !== undefined ? activo : 1];

    if (Contrasena) {
        query += ', Contraseña=?';
        params.push(Contrasena);
    }

    // Si solo se desactiva
    if (activo !== undefined && !NombreUsuario) {
        query  = 'UPDATE USUARIOS SET activo=? WHERE id_usuario=?';
        params = [activo, req.params.id];
        db.query(query, params, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Usuario actualizado' });
        });
        return;
    }

    query += ' WHERE id_usuario=?';
    params.push(req.params.id);

    db.query(query, params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Usuario actualizado' });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM USUARIOS WHERE id_usuario = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Usuario eliminado' });
    });
});

module.exports = router;
