var PAGOS_API = 'http://localhost:3000';
var _clientes  = [];
var _reservas  = [];

async function cargarReservaciones() {
    try {
        const resR = await fetch(`${PAGOS_API}/reservaciones`);
        _reservas  = await resR.json();
        const resC = await fetch(`${PAGOS_API}/clientes`);
        _clientes  = await resC.json();

        const sel     = document.getElementById('reservacion-select');
        sel.innerHTML = '<option value="">-- Selecciona un cliente/evento --</option>';

        const activas = _reservas.filter(r => r.estado !== 'Cancelado');

        if (!Array.isArray(activas) || activas.length === 0) {
            sel.innerHTML = '<option value="">No hay reservaciones activas</option>';
            return;
        }

        activas.forEach(r => {
            const cliente = _clientes.find(c => c.id_clientes === r.COTIZACIONES_CLIENTES_id_clientes);
            const nombre  = cliente ? cliente.NombreCompleto : `Cliente #${r.COTIZACIONES_CLIENTES_id_clientes}`;
            const fecha   = new Date(r.fecha_evento).toLocaleDateString('es-MX');
            sel.innerHTML += `<option value="${r.id_reservaciones}|${r.COTIZACIONES_id_cotizaciones}|${r.COTIZACIONES_CLIENTES_id_clientes}|${r.USUARIOS_id_usuario}">
                ${nombre} — ${r.tipo_evento} — ${fecha}
            </option>`;
        });
    } catch (e) {
        console.error('Error cargando reservaciones:', e);
    }
}

async function cargarPagos(filtroReservaId = null) {
    try {
        const res   = await fetch(`${PAGOS_API}/pagos`);
        const pagos = await res.json();
        const tbody = document.getElementById('tabla-pagos-body');
        tbody.innerHTML = '';

        if (!Array.isArray(pagos) || pagos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">No hay pagos registrados</td></tr>';
            return;
        }

        // Excluir pagos de reservaciones canceladas
        const pagosActivos = pagos.filter(p => {
            const reserva = _reservas.find(r => r.id_reservaciones === p.RESERVACIONES_id_reservaciones);
            return reserva && reserva.estado !== 'Cancelado';
        });

        const pagosFiltrados = filtroReservaId
            ? pagosActivos.filter(p => p.RESERVACIONES_id_reservaciones === parseInt(filtroReservaId))
            : pagosActivos;

        if (pagosFiltrados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">No hay pagos registrados</td></tr>';
            return;
        }

        pagosFiltrados.forEach(p => {
            const reserva  = _reservas.find(r => r.id_reservaciones === p.RESERVACIONES_id_reservaciones);
            const cliente  = reserva ? _clientes.find(c => c.id_clientes === reserva.COTIZACIONES_CLIENTES_id_clientes) : null;
            const nombre   = cliente ? cliente.NombreCompleto : '—';
            const concepto = p.concepto || '—';
            const fecha    = p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString('es-MX') : '—';

            tbody.innerHTML += `
                <tr>
                    <td>${fecha}</td>
                    <td>${nombre}</td>
                    <td>${concepto}</td>
                    <td>$${parseFloat(p.Monto).toLocaleString()}</td>
                    <td>${p.metodo_pago}</td>
                </tr>`;
        });
    } catch (e) {
        console.error('Error cargando pagos:', e);
    }
}

function onReservacionChange() {
    const selVal = document.getElementById('reservacion-select').value;
    if (!selVal) { cargarPagos(); return; }
    cargarPagos(selVal.split('|')[0]);
}

async function registrarNuevoPago() {
    const selVal  = document.getElementById('reservacion-select').value;
    const concepto = document.getElementById('concepto-pago').value.trim();
    const monto   = document.getElementById('monto-pago').value;
    const metodo  = document.getElementById('metodo-pago').value;

    if (!selVal || !monto) {
        alert('Por favor selecciona una reservación e ingresa el monto.');
        return;
    }

    const [resId, cotId, clienteId, usuarioId] = selVal.split('|');
    const sesion = JSON.parse(sessionStorage.getItem('usuario'));
    const fecha  = new Date().toISOString().split('T')[0];

    try {
        const res = await fetch(`${PAGOS_API}/pagos`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                RESERVACIONES_id_reservaciones:                  parseInt(resId),
                RESERVACIONES_COTIZACIONES_id_cotizaciones:      parseInt(cotId),
                RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes: parseInt(clienteId),
                RESERVACIONES_USUARIOS_id_usuario:               parseInt(usuarioId),
                USUARIOS_id_usuario:                             sesion?.id || 1,
                concepto:    concepto,
                Monto:       parseFloat(monto),
                fecha_pago:  fecha,
                metodo_pago: metodo
            })
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Error al registrar'); return; }
        alert('Pago registrado correctamente');
        document.getElementById('concepto-pago').value = '';
        document.getElementById('monto-pago').value    = '';
        cargarPagos(resId);
    } catch (e) {
        alert('Error al registrar pago');
    }
}

cargarReservaciones().then(() => cargarPagos());