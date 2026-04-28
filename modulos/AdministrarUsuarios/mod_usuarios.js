const API = 'http://localhost:3000';

async function cargarUsuarios() {
    try {
        const res = await fetch(`${API}/usuarios`);
        const usuarios = await res.json();
        const tbody = document.getElementById('tablaCuerpoUsuarios');
        tbody.innerHTML = '';

        usuarios.forEach(u => {
            tbody.innerHTML += `
                <tr>
                    <td>${u.NombreUsuario}</td>
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
    const NombreUsuario = document.getElementById('userLogin').value.trim();
    const Contraseña    = document.getElementById('nomUser').value.trim(); // reutilizamos campo
    const tipo_usuario  = document.getElementById('rolUser').value;

    if (!NombreUsuario) {
        alert('El nombre de usuario es obligatorio');
        return;
    }

    try {
        const res = await fetch(`${API}/usuarios`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ NombreUsuario, Contraseña: NombreUsuario, tipo_usuario })
        });
        const data = await res.json();
        alert(data.mensaje || 'Usuario creado');
        cargarUsuarios();
    } catch (e) {
        alert('Error al guardar usuario');
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

// Cargar al iniciar
cargarUsuarios();
