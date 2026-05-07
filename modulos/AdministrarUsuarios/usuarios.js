var USR_API  = 'https://mundomagicoequipo1-production.up.railway.app';
var _usuarios = [];
var _modoEditar = false;

async function cargarUsuarios() {
    try {
        const res      = await fetch(`${USR_API}/usuarios`);
        _usuarios      = await res.json();
        const tbody    = document.getElementById('tablaCuerpoUsuarios');
        tbody.innerHTML = '';

        if (!Array.isArray(_usuarios) || _usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;padding:20px;">No hay usuarios registrados</td></tr>';
            return;
        }

        _usuarios.forEach(u => {
            const activo = u.activo !== 0;
            tbody.innerHTML += `
                <tr style="${!activo ? 'opacity:0.4;' : ''}">
                    <td>${u.NombreCompleto || '—'}</td>
                    <td>${u.NombreUsuario}</td>
                    <td>••••••••</td>
                    <td>${u.tipo_usuario}</td>
                </tr>`;
        });
    } catch (e) {
        console.error('Error cargando usuarios:', e);
    }
}

function abrirModalCrear() {
    _modoEditar = false;
    document.getElementById('modal-titulo').textContent = 'Crear nuevo usuario';
    document.getElementById('modal-id').value    = '';
    document.getElementById('modal-nombre').value = '';
    document.getElementById('modal-user').value  = '';
    document.getElementById('modal-pass').value  = '';
    document.getElementById('modal-rol').value   = 'Dueño';
    document.getElementById('modalUsuario').classList.add('active');
}

function abrirModalEditar() {
    if (_usuarios.length === 0) { alert('No hay usuarios para editar.'); return; }

    let opciones = 'Selecciona el número del usuario a editar:\n\n';
    _usuarios.forEach((u, i) => {
        opciones += `${i + 1}. ${u.NombreCompleto || u.NombreUsuario} (${u.tipo_usuario})\n`;
    });

    const sel = prompt(opciones);
    if (!sel) return;

    const idx = parseInt(sel) - 1;
    const u   = _usuarios[idx];
    if (!u) { alert('Selección inválida'); return; }

    _modoEditar = true;
    document.getElementById('modal-titulo').textContent  = 'Editar usuario';
    document.getElementById('modal-id').value    = u.id_usuario;
    document.getElementById('modal-nombre').value = u.NombreCompleto || '';
    document.getElementById('modal-user').value  = u.NombreUsuario;
    document.getElementById('modal-pass').value  = '';
    document.getElementById('modal-rol').value   = u.tipo_usuario;
    document.getElementById('modalUsuario').classList.add('active');
}

function cerrarModal() {
    document.getElementById('modalUsuario').classList.remove('active');
}

async function guardarUsuario() {
    const id             = document.getElementById('modal-id').value;
    const NombreCompleto = document.getElementById('modal-nombre').value.trim();
    const NombreUsuario  = document.getElementById('modal-user').value.trim();
    const Contrasena     = document.getElementById('modal-pass').value.trim();
    const tipo_usuario   = document.getElementById('modal-rol').value;

    if (!NombreCompleto || !NombreUsuario) {
        alert('Nombre completo y usuario son obligatorios.');
        return;
    }

    if (!_modoEditar && !Contrasena) {
        alert('La contraseña es obligatoria para nuevos usuarios.');
        return;
    }

    try {
        let res;
        if (_modoEditar) {
            // Editar usuario existente
            const body = { NombreCompleto, NombreUsuario, tipo_usuario };
            if (Contrasena) body.Contrasena = Contrasena;
            res = await fetch(`${USR_API}/usuarios/${id}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body)
            });
        } else {
            // Crear nuevo usuario
            res = await fetch(`${USR_API}/usuarios`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ NombreCompleto, NombreUsuario, Contrasena, tipo_usuario })
            });
        }

        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Error'); return; }

        alert(_modoEditar ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
        cerrarModal();
        cargarUsuarios();
    } catch (e) {
        alert('Error al conectar con el servidor');
    }
}

async function desactivarUsuario() {
    if (_usuarios.length === 0) { alert('No hay usuarios para desactivar.'); return; }

    let opciones = 'Selecciona el número del usuario a desactivar:\n\n';
    _usuarios.forEach((u, i) => {
        opciones += `${i + 1}. ${u.NombreCompleto || u.NombreUsuario} (${u.tipo_usuario})\n`;
    });

    const sel = prompt(opciones);
    if (!sel) return;

    const idx = parseInt(sel) - 1;
    const u   = _usuarios[idx];
    if (!u) { alert('Selección inválida'); return; }

    if (!confirm(`¿Desactivar al usuario ${u.NombreUsuario}? No podrá iniciar sesión.`)) return;

    try {
        const res  = await fetch(`${USR_API}/usuarios/${u.id_usuario}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ activo: 0 })
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Error'); return; }
        alert(`Usuario ${u.NombreUsuario} desactivado correctamente`);
        cargarUsuarios();
    } catch (e) {
        alert('Error al desactivar usuario');
    }
}

cargarUsuarios();