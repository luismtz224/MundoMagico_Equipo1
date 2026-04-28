const API = 'http://localhost:3000';

async function cargarProveedores() {
    try {
        const res        = await fetch(`${API}/proveedores`);
        const proveedores = await res.json();
        const contenedor = document.getElementById('contenedorProveedores');
        contenedor.innerHTML = '';

        const colores = ['border-primary', 'border-success', 'border-warning', 'border-info'];

        if (proveedores.length === 0) {
            contenedor.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">No hay proveedores registrados.</p>';
            return;
        }

        proveedores.forEach((p, i) => {
            const color = colores[i % colores.length];
            contenedor.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card shadow-sm border-start ${color} border-4">
                        <div class="card-body">
                            <h5 class="card-title">${p.nombre_empresa}</h5>
                            <p class="text-muted mb-1"><strong>Servicio:</strong> ${p.servicio}</p>
                            <p class="mb-3">${p.contacto}</p>
                            <div class="d-flex justify-content-end gap-2">
                                <button class="btn btn-outline-danger btn-sm" onclick="eliminarProveedor(${p.id_proveedores})">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    } catch (e) {
        console.error('Error cargando proveedores:', e);
    }
}

async function agregarProveedor() {
    const nombre   = prompt('Nombre de la empresa:');
    const servicio = prompt('Tipo de servicio:');
    const contacto = prompt('Teléfono o correo:');

    if (!nombre || !servicio || !contacto) return;

    try {
        const res  = await fetch(`${API}/proveedores`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ nombre_empresa: nombre, servicio, contacto })
        });
        const data = await res.json();
        alert(data.mensaje || 'Proveedor agregado');
        cargarProveedores();
    } catch (e) {
        alert('Error al agregar proveedor');
    }
}

async function eliminarProveedor(id) {
    if (!confirm('¿Eliminar este proveedor?')) return;
    try {
        await fetch(`${API}/proveedores/${id}`, { method: 'DELETE' });
        cargarProveedores();
    } catch (e) {
        alert('Error al eliminar');
    }
}

cargarProveedores();
