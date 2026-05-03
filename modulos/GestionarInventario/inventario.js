var INV_API = 'http://localhost:3000';

async function cargarInventario() {
    try {
        const res   = await fetch(`${INV_API}/inventario`);
        const items = await res.json();
        const tbody = document.getElementById('tabla-inventario');
        tbody.innerHTML = '';

        if (!Array.isArray(items) || items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">No hay artículos registrados</td></tr>';
            return;
        }

        items.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.nombre_item}</td>
                    <td>${item.cantidad_total}</td>
                    <td>—</td>
                    <td>${item.estado_actual}</td>
                    <td>
                        <button class="btn-primary" style="padding:5px 10px;font-size:0.8rem;"
                            onclick="editarArticulo(${item.id_inventario}, ${item.cantidad_total}, '${item.estado_actual}')">
                            Editar
                        </button>
                        <button style="padding:5px 10px;font-size:0.8rem;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;margin-left:5px;"
                            onclick="eliminarArticulo(${item.id_inventario})">
                            Eliminar
                        </button>
                    </td>
                </tr>`;
        });
    } catch (e) {
        console.error('Error cargando inventario:', e);
    }
}

async function agregarArticulo() {
    const nombre   = prompt('Nombre del artículo:');
    const cantidad = prompt('Cantidad total:');
    const estado   = prompt('Estado (Excelente, Bueno, Regular, Limpieza requerida):');

    if (!nombre || !cantidad || !estado) return;

    try {
        const res  = await fetch(`${INV_API}/inventario`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ nombre_item: nombre, cantidad_total: parseInt(cantidad), estado_actual: estado })
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Error'); return; }
        alert('Artículo agregado correctamente');
        cargarInventario();
    } catch (e) {
        alert('Error al agregar artículo');
    }
}

async function editarArticulo(id, cantidadActual, estadoActual) {
    const cantidad = prompt('Nueva cantidad total:', cantidadActual);
    const estado   = prompt('Nuevo estado:', estadoActual);

    if (!cantidad || !estado) return;

    try {
        const res  = await fetch(`${INV_API}/inventario/${id}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ cantidad_total: parseInt(cantidad), estado_actual: estado })
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Error'); return; }
        alert('Artículo actualizado');
        cargarInventario();
    } catch (e) {
        alert('Error al editar artículo');
    }
}

async function eliminarArticulo(id) {
    if (!confirm('¿Eliminar este artículo del inventario?')) return;
    try {
        await fetch(`${INV_API}/inventario/${id}`, { method: 'DELETE' });
        cargarInventario();
    } catch (e) {
        alert('Error al eliminar');
    }
}

function editarExistencia() {
    alert('Haz click en el botón "Editar" del artículo que deseas modificar.');
}

function filtrarInventario() {
    const input = document.getElementById('buscar-item').value.toUpperCase();
    const filas = document.querySelectorAll('#tabla-inventario tr');
    filas.forEach(fila => {
        const td = fila.getElementsByTagName('td')[0];
        if (td) {
            fila.style.display = td.textContent.toUpperCase().includes(input) ? '' : 'none';
        }
    });
}

cargarInventario();
