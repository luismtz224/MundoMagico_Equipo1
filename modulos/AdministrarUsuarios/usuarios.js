const API = 'http://localhost:3000';

async function cargarUsuarios() {
    try {
        const res      = await fetch(`${API}/usuarios`);
        const usuarios = await res.json();
        const tbody    = document.getElementById('tablaCuerpoUsuarios');
        tbody.innerHTML = '';

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;">No hay usuarios registrados</td></tr>';
            return;
        }

        usuarios.forEach(u => {
            tbody.innerHTML += `
                <tr>
                    <td>${u.NombreCompleto || '—'}</td>
                    <td>${u.NombreUsuario}</td>
                    <td>${u.tipo_usuario}</td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm" onclick="eliminarUsuario(${u.id_usuario})">Eliminar</button>
                    </td>
                </tr>`;
        });
    } catch (e) {
        console.error('Error cargando usuarios:', e);
    }
}

async function guardarUsuario() {
    const NombreCompleto = document.getElementById('nomUser').value.trim();
    const NombreUsuario  = document.getElementById('userLogin').value.trim();
    const Contrasena     = document.getElementById('passUser').value.trim();
    const tipo_usuario   = document.getElementById('rolUser').value;

    if (!NombreCompleto || !NombreUsuario || !Contrasena) {
        alert('Todos los campos son obligatorios');
        return;
    }

    try {
        const res  = await fetch(`${API}/usuarios`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ NombreCompleto, NombreUsuario, Contrasena, tipo_usuario })
        });
        const data = await res.json();
        if (!res.ok) {
            alert(data.error || 'Error al guardar');
            return;
        }
        alert('Usuario creado correctamente');
        document.getElementById('nomUser').value   = '';
        document.getElementById('userLogin').value = '';
        document.getElementById('passUser').value  = '';
        cargarUsuarios();
    } catch (e) {
        alert('Error al conectar con el servidor');
    }
}

async function eliminarUsuario(id) {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
        await fetch(`${API}/usuarios/${id}`, { method: 'DELETE' });
        cargarUsuarios();
    } catch (e) {
        alert('Error al eliminar');
    }
}

cargarUsuarios();