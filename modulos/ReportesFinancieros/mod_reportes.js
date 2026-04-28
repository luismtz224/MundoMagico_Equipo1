const API = 'http://localhost:3000';

async function cargarReportes() {
    try {
        const res  = await fetch(`${API}/reportes`);
        const data = await res.json();

        // Actualizar tarjetas de resumen
        const ingresos = parseFloat(data.total_ingresos) || 0;
        document.querySelector('.bg-success h3').textContent = `$${ingresos.toLocaleString()}`;

        // Cargar movimientos en la tabla
        const tbody = document.getElementById('listaReportes');
        tbody.innerHTML = '';

        if (!data.movimientos || data.movimientos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;">No hay movimientos registrados</td></tr>';
            return;
        }

        data.movimientos.forEach(m => {
            const fecha = m.fecha_pago ? new Date(m.fecha_pago).toLocaleDateString('es-MX') : '—';
            tbody.innerHTML += `
                <tr>
                    <td>${fecha}</td>
                    <td>Pago registrado</td>
                    <td><span class="badge bg-success">Ingreso</span></td>
                    <td>$${parseFloat(m.Monto).toLocaleString()}</td>
                </tr>`;
        });

    } catch (e) {
        console.error('Error cargando reportes:', e);
    }
}

function imprimirReporte() {
    window.print();
}

function filtrarPorFecha() {
    const fechaFiltro = document.querySelector('input[type="date"]').value;
    if (!fechaFiltro) {
        alert('Selecciona una fecha para filtrar');
        return;
    }

    const filas = document.querySelectorAll('#listaReportes tr');
    filas.forEach(fila => {
        const celdaFecha = fila.cells[0]?.textContent;
        fila.style.display = celdaFecha?.includes(fechaFiltro) ? '' : 'none';
    });
}

// Conectar botón de filtrar
document.addEventListener('DOMContentLoaded', () => {
    const btnFiltrar = document.querySelector('.btn-secondary');
    if (btnFiltrar) btnFiltrar.onclick = filtrarPorFecha;
});

cargarReportes();
