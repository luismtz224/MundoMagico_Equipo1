const API = 'http://localhost:3000';

async function cargarInventario() {
    try {
        const res = await fetch(`${API}/inventario`);
        const items = await res.json();
        const tbody = document.getElementById('tabla-inventario');
        tbody.innerHTML = '';

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;">No hay artículos registrados</td></tr>';
            return;
        }

        items.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.nombre_item}</td>
                    <td>${item.cantidad_total}</td>
                    <td>—</td>
                    <td>${item.estado_actual}</td>
                </tr>`;
        });
    } catch (e) {
        console.error('Error cargando inventario:', e);
    }
}

function agregarArticulo() {
    const nombre   = prompt('Nombre del artículo:');
    const cantidad = prompt('Cantidad total:');
    const estado   = prompt('Estado (Excelente, Bueno, Regular):');

    if (!nombre || !cantidad || !estado) return;

    fetch(`${API}/inventario`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nombre_item: nombre, cantidad_total: parseInt(cantidad), estado_actual: estado })
    })
    .then(r => r.json())
    .then(data => {
        alert(data.mensaje || 'Artículo agregado');
        cargarInventario();
    })
    .catch(() => alert('Error al agregar artículo'));
}

function editarExistencia() {
    alert('Seleccione un artículo de la tabla para editar (próximamente).');
}

function filtrarInventario() {
    const input  = document.getElementById('buscar-item').value.toUpperCase();
    const filas  = document.querySelectorAll('#tabla-inventario tr');
    filas.forEach(fila => {
        const td = fila.getElementsByTagName('td')[0];
        if (td) {
            fila.style.display = td.textContent.toUpperCase().includes(input) ? '' : 'none';
        }
    });
}

cargarInventario();
