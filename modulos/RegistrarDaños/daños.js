var DANOS_API  = 'http://localhost:3000';
var _reservas  = [];
var _clientes  = [];
var _inventario = [];

async function inicializarDanos() {
    try {
        const [resR, resC, resI] = await Promise.all([
            fetch(`${DANOS_API}/reservaciones`),
            fetch(`${DANOS_API}/clientes`),
            fetch(`${DANOS_API}/inventario`)
        ]);

        _reservas   = await resR.json();
        _clientes   = await resC.json();
        _inventario = await resI.json();

        // Llenar selector de reservaciones
        const selRes = document.getElementById('reservacion-dano');
        selRes.innerHTML = '<option value="">-- Selecciona un evento --</option>';

        const activas = _reservas.filter(r => r.estado !== 'Cancelado');
        activas.forEach(r => {
            const cliente = _clientes.find(c => c.id_clientes === r.COTIZACIONES_CLIENTES_id_clientes);
            const nombre  = cliente ? cliente.NombreCompleto : `Cliente #${r.COTIZACIONES_CLIENTES_id_clientes}`;
            const fecha   = new Date(r.fecha_evento).toLocaleDateString('es-MX');
            selRes.innerHTML += `<option value="${r.id_reservaciones}|${r.COTIZACIONES_id_cotizaciones}|${r.COTIZACIONES_CLIENTES_id_clientes}|${r.USUARIOS_id_usuario}">
                ${nombre} — ${r.tipo_evento} — ${fecha}
            </option>`;
        });

        // Llenar selector de inventario
        const selInv = document.getElementById('articulo-danado');
        selInv.innerHTML = '<option value="">-- Selecciona un artículo --</option>';
        _inventario.forEach(item => {
            selInv.innerHTML += `<option value="${item.id_inventario}">${item.nombre_item}</option>`;
        });

        cargarReportesDanos();
    } catch (e) {
        console.error('Error inicializando daños:', e);
    }
}

async function cargarReportesDanos() {
    try {
        const res      = await fetch(`${DANOS_API}/danos`);
        const reportes = await res.json();
        const container = document.getElementById('lista-danos-container');
        container.innerHTML = '';

        if (!Array.isArray(reportes) || reportes.length === 0) {
            container.innerHTML = '<p style="color:#888;text-align:center;">No hay reportes recientes.</p>';
            return;
        }

        reportes.forEach(r => {
            const reserva  = _reservas.find(rv => rv.id_reservaciones === r.RESERVACIONES_id_reservaciones);
            const cliente  = reserva ? _clientes.find(c => c.id_clientes === reserva.COTIZACIONES_CLIENTES_id_clientes) : null;
            const nombre   = cliente  ? cliente.NombreCompleto : '—';
            const articulo = _inventario.find(i => i.id_inventario === r.INVENTARIO_id_inventario);
            const nomArt   = articulo ? articulo.nombre_item : '—';

            const div = document.createElement('div');
            div.className = 'item-dano';
            div.innerHTML = `
                <h4>Reporte #${r.id_reportedanos} — ${nombre}</h4>
                <p><b>Artículo:</b> ${nomArt}</p>
                <p><b>Descripción:</b> ${r.Descripcion}</p>
                <p class="costo"><b>Costo estimado:</b> $${parseFloat(r.costo_estimado || 0).toLocaleString()}</p>`;
            container.appendChild(div);
        });
    } catch (e) {
        console.error('Error cargando reportes:', e);
    }
}

async function guardarReporteDano() {
    const selVal   = document.getElementById('reservacion-dano').value;
    const invId    = document.getElementById('articulo-danado').value;
    const desc     = document.getElementById('descripcion-dano').value.trim();
    const costo    = document.getElementById('costo-dano').value;

    if (!selVal || !invId || !desc || !costo) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const [resId, cotId, clienteId, usuarioId] = selVal.split('|');
    const sesion = JSON.parse(sessionStorage.getItem('usuario'));

    try {
        const res = await fetch(`${DANOS_API}/danos`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                RESERVACIONES_COTIZACIONES_id_cotizaciones:      parseInt(cotId),
                RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes: parseInt(clienteId),
                RESERVACIONES_id_reservaciones:                  parseInt(resId),
                INVENTARIO_id_inventario:                        parseInt(invId),
                RESERVACIONES_USUARIOS_id_usuario:               parseInt(usuarioId),
                USUARIOS_id_usuario:                             sesion?.id || 1,
                Descripcion:    desc,
                costo_estimado: parseFloat(costo)
            })
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Error'); return; }

        alert('Reporte de daño registrado correctamente');
        document.getElementById('descripcion-dano').value = '';
        document.getElementById('costo-dano').value       = '';
        document.getElementById('reservacion-dano').value = '';
        document.getElementById('articulo-danado').value  = '';
        cargarReportesDanos();
    } catch (e) {
        alert('Error al guardar reporte');
    }
}

inicializarDanos();