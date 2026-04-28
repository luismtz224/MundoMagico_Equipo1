const API = 'http://localhost:3000';

async function cargarReportesDanos() {
    try {
        const res      = await fetch(`${API}/danos`);
        const reportes = await res.json();
        const container = document.getElementById('lista-danos-container');
        container.innerHTML = '';

        if (reportes.length === 0) {
            container.innerHTML = '<p style="color:#888;text-align:center;">No hay reportes recientes.</p>';
            return;
        }

        reportes.forEach(r => {
            const div = document.createElement('div');
            div.className = 'item-dano';
            div.innerHTML = `
                <h4>Reporte #${r.id_reportedanos}</h4>
                <p><b>Descripción:</b> ${r.Descripcion}</p>
                <p><b>Costo estimado:</b> $${parseFloat(r.costo_estimado || 0).toLocaleString()}</p>`;
            container.appendChild(div);
        });
    } catch (e) {
        console.error('Error cargando reportes:', e);
    }
}

async function guardarReporteDano() {
    const folio    = document.getElementById('folio-evento').value.trim();
    const articulo = document.getElementById('articulo-danado').value;
    const desc     = document.getElementById('descripcion-dano').value.trim();
    const costo    = document.getElementById('costo-dano').value;

    if (!folio || !desc || !costo) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const sesion = JSON.parse(sessionStorage.getItem('usuario'));

    try {
        const res = await fetch(`${API}/danos`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                RESERVACIONES_COTIZACIONES_id_cotizaciones:      1,
                RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes: 1,
                RESERVACIONES_id_reservaciones:                  1,
                INVENTARIO_id_inventario:                        1,
                RESERVACIONES_USUARIOS_id_usuario:               sesion?.id || 1,
                USUARIOS_id_usuario:                             sesion?.id || 1,
                Descripcion:    `[${articulo}] ${desc}`,
                costo_estimado: parseFloat(costo)
            })
        });
        const data = await res.json();
        alert(data.mensaje || 'Reporte registrado');

        document.getElementById('folio-evento').value      = '';
        document.getElementById('descripcion-dano').value  = '';
        document.getElementById('costo-dano').value        = '';
        cargarReportesDanos();
    } catch (e) {
        alert('Error al guardar reporte');
    }
}

cargarReportesDanos();
