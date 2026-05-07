var REC_API    = 'https://mundomagicoequipo1-production.up.railway.app';
var _reservas  = [];
var _clientes  = [];
var _pagos     = [];

async function inicializarRecordatorios() {
    try {
        const [resR, resC, resP] = await Promise.all([
            fetch(`${REC_API}/reservaciones`),
            fetch(`${REC_API}/clientes`),
            fetch(`${REC_API}/pagos`)
        ]);

        _reservas = await resR.json();
        _clientes = await resC.json();
        _pagos    = await resP.json();

        const sel = document.getElementById('cliente-select');
        sel.innerHTML = '<option value="">-- Selecciona un cliente --</option>';

        const activas = _reservas.filter(r => r.estado !== 'Cancelado');

        if (activas.length === 0) {
            sel.innerHTML = '<option value="">No hay eventos activos</option>';
            return;
        }

        activas.forEach(r => {
            const cliente = _clientes.find(c => c.id_clientes === r.COTIZACIONES_CLIENTES_id_clientes);
            const nombre  = cliente ? cliente.NombreCompleto : `Cliente #${r.COTIZACIONES_CLIENTES_id_clientes}`;
            const telefono = cliente ? (cliente.Telefono || '') : '';
            const correo   = cliente ? (cliente.Correo   || '') : '';
            const fecha    = new Date(r.fecha_evento).toLocaleDateString('es-MX');

            // Calcular saldo pagado
            const pagosCli = _pagos.filter(p => p.RESERVACIONES_id_reservaciones === r.id_reservaciones);
            const pagado   = pagosCli.reduce((s, p) => s + parseFloat(p.Monto || 0), 0);

            sel.innerHTML += `
                <option value="${r.id_reservaciones}"
                    data-nombre="${nombre}"
                    data-fecha="${fecha}"
                    data-tipo="${r.tipo_evento}"
                    data-pagado="${pagado}"
                    data-telefono="${telefono}"
                    data-correo="${correo}">
                    ${nombre} — ${r.tipo_evento} — ${fecha}
                </option>`;
        });
    } catch (e) {
        console.error('Error inicializando recordatorios:', e);
    }
}

function actualizarMensaje() {
    const sel  = document.getElementById('cliente-select');
    const opt  = sel.options[sel.selectedIndex];
    const tipo = document.getElementById('tipo-recordatorio').value;
    const textarea = document.getElementById('mensaje-texto');

    if (!sel.value) { textarea.value = ''; return; }

    const nombre  = opt.getAttribute('data-nombre');
    const fecha   = opt.getAttribute('data-fecha');
    const tipoEv  = opt.getAttribute('data-tipo');
    const pagado  = parseFloat(opt.getAttribute('data-pagado') || 0);

    let texto = '';
    if (tipo === 'pago') {
        texto = `Hola ${nombre}, te saludamos del Salón Mundo Mágico. Te recordamos que tienes un saldo pendiente para tu evento de ${tipoEv} el día ${fecha}. Hasta el momento llevas abonado $${pagado.toLocaleString()} MXN. Quedamos a tus órdenes para cualquier duda. 😊`;
    } else if (tipo === 'cita') {
        texto = `Hola ${nombre}, ¿cómo estás? Te escribimos del Salón Mundo Mágico para coordinar tu cita de planeación para tu evento de ${tipoEv} programado el ${fecha}. ¿Cuándo tienes disponibilidad? Estamos para servirte. 🌟`;
    } else {
        texto = `¡Hola ${nombre}! Ya falta muy poco para tu gran evento de ${tipoEv} el día ${fecha}. En el Salón Mundo Mágico estamos listos para recibirte y hacer de este día algo inolvidable. ¡Nos vemos pronto! 🎉`;
    }

    textarea.value = texto;
}

function agregarLog(nombre, medio) {
    const log  = document.getElementById('log-envios');
    const vacio = log.querySelector('.log-vacio');
    if (vacio) vacio.remove();

    const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const li   = document.createElement('li');
    li.className = medio === 'WhatsApp' ? 'log-whatsapp' : 'log-email';
    li.innerHTML = `<strong>${hora}</strong> — ${nombre} vía ${medio}`;
    log.prepend(li);
}

function enviarWhatsApp() {
    const sel     = document.getElementById('cliente-select');
    const opt     = sel.options[sel.selectedIndex];
    const mensaje = document.getElementById('mensaje-texto').value.trim();

    if (!sel.value || !mensaje) {
        alert('Por favor selecciona un cliente y verifica el mensaje.');
        return;
    }

    const nombre    = opt.getAttribute('data-nombre');
    const telefono  = opt.getAttribute('data-telefono');
    const msgCod    = encodeURIComponent(mensaje);

    if (telefono) {
        // Abrir WhatsApp con el número del cliente
        const tel = telefono.replace(/\D/g, '');
        window.open(`https://wa.me/52${tel}?text=${msgCod}`, '_blank');
    } else {
        // Abrir WhatsApp sin número
        window.open(`https://wa.me/?text=${msgCod}`, '_blank');
    }

    agregarLog(nombre, 'WhatsApp');
}

function enviarCorreo() {
    const sel     = document.getElementById('cliente-select');
    const opt     = sel.options[sel.selectedIndex];
    const mensaje = document.getElementById('mensaje-texto').value.trim();

    if (!sel.value || !mensaje) {
        alert('Por favor selecciona un cliente y verifica el mensaje.');
        return;
    }

    const nombre  = opt.getAttribute('data-nombre');
    const correo  = opt.getAttribute('data-correo');
    const asunto  = encodeURIComponent(`Recordatorio - Salón Mundo Mágico`);
    const cuerpo  = encodeURIComponent(mensaje);

    if (correo) {
        window.open(`mailto:${correo}?subject=${asunto}&body=${cuerpo}`, '_blank');
    } else {
        window.open(`mailto:?subject=${asunto}&body=${cuerpo}`, '_blank');
    }

    agregarLog(nombre, 'Correo');
}

inicializarRecordatorios();
