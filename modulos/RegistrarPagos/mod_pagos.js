const API = 'http://localhost:3000';

async function cargarPagos() {
    try {
        const res   = await fetch(`${API}/pagos`);
        const pagos = await res.json();
        const tbody = document.getElementById('tabla-pagos-body');
        tbody.innerHTML = '';

        if (pagos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;">No hay pagos registrados</td></tr>';
            return;
        }

        pagos.forEach(p => {
            const fecha = p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString('es-MX') : '—';
            tbody.innerHTML += `
                <tr>
                    <td>${fecha}</td>
                    <td>${p.id_pagos}</td>
                    <td>$${parseFloat(p.Monto).toLocaleString()}</td>
                    <td>${p.metodo_pago}</td>
                </tr>`;
        });
    } catch (e) {
        console.error('Error cargando pagos:', e);
    }
}

async function registrarNuevoPago() {
    const folio  = document.getElementById('folio-contrato').value.trim();
    const monto  = document.getElementById('monto-pago').value;
    const metodo = document.getElementById('metodo-pago').value;

    if (!folio || !monto) {
        alert('Por favor completa el folio y el monto.');
        return;
    }

    const sesion = JSON.parse(sessionStorage.getItem('usuario'));
    const fecha  = new Date().toISOString().split('T')[0];

    try {
        const res = await fetch(`${API}/pagos`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                RESERVACIONES_COTIZACIONES_id_cotizaciones:        1,
                RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes:   1,
                RESERVACIONES_id_reservaciones:                    1,
                RESERVACIONES_USUARIOS_id_usuario:                 sesion?.id || 1,
                USUARIOS_id_usuario:                               sesion?.id || 1,
                Monto:       parseFloat(monto),
                fecha_pago:  fecha,
                metodo_pago: metodo
            })
        });
        const data = await res.json();
        alert(data.mensaje || 'Pago registrado');

        document.getElementById('folio-contrato').value = '';
        document.getElementById('monto-pago').value     = '';
        cargarPagos();
    } catch (e) {
        alert('Error al registrar pago');
    }
}

cargarPagos();
