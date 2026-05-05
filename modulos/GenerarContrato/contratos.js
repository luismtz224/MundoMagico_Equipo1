var CONT_API = 'http://localhost:3000';

function actualizarVistaPrevia() {
    const cliente  = document.getElementById('cliente-nombre').value  || "[NOMBRE DEL CLIENTE]";
    const fecha    = document.getElementById('contrato-fecha').value  || "[FECHA]";
    const monto    = document.getElementById('contrato-monto').value  || "0.00";
    const anticipo = document.getElementById('contrato-anticipo').value || "0.00";
    const tipo     = document.getElementById('tipo-evento').value     || "[TIPO DE EVENTO]";

    const texto = `
        <center><h2>CONTRATO DE PRESTACIÓN DE SERVICIOS</h2></center>
        <br>
        <p>En la ciudad de Saltillo, Coahuila, se celebra el presente contrato entre <b>SALÓN MUNDO MÁGICO</b> y el C. <b>${cliente}</b>.</p>
        <br>
        <p><b>PRIMERA:</b> El prestador se compromete a facilitar las instalaciones del salón para el evento de tipo <b>${tipo}</b> a realizarse el día <b>${fecha}</b>.</p>
        <br>
        <p><b>SEGUNDA:</b> El costo total del evento será de <b>$${parseFloat(monto).toLocaleString()} MXN</b>, de los cuales se recibe un anticipo de <b>$${parseFloat(anticipo).toLocaleString()} MXN</b>. El saldo restante de <b>$${(parseFloat(monto) - parseFloat(anticipo)).toLocaleString()} MXN</b> deberá ser cubierto antes del inicio del evento.</p>
        <br>
        <p><b>TERCERA:</b> El cliente se hace responsable de cualquier daño al mobiliario o instalaciones del salón ocasionado durante el evento.</p>
        <br>
        <p><b>CUARTA:</b> En caso de cancelación, el anticipo no será reembolsable.</p>
        <br><br><br>
        <div style="display:flex; justify-content: space-around; margin-top: 40px;">
            <span>_______________________<br>Firma del Cliente<br>${cliente}</span>
            <span>_______________________<br>Salón Mundo Mágico</span>
        </div>
    `;
    document.getElementById('documento-texto').innerHTML = texto;
}

async function guardarYImprimir() {
    const nombre   = document.getElementById('cliente-nombre').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const correo   = document.getElementById('cliente-correo').value.trim();
    const tipo     = document.getElementById('tipo-evento').value;
    const fecha    = document.getElementById('contrato-fecha').value;
    const horaI    = document.getElementById('hora-inicio').value;
    const horaF    = document.getElementById('hora-fin').value;
    const monto    = document.getElementById('contrato-monto').value;
    const anticipo = document.getElementById('contrato-anticipo').value;
    const status   = document.getElementById('contrato-status');

    if (!nombre || !fecha || !monto) {
        alert('Por favor completa al menos: Nombre del cliente, Fecha y Monto.');
        return;
    }

    status.style.color = 'blue';
    status.textContent = 'Verificando disponibilidad...';

    try {
        // 1. Verificar fecha disponible
        const resVerificar  = await fetch(`${CONT_API}/reservaciones`);
        const reservaciones = await resVerificar.json();
        const fechaDuplicada = reservaciones.find(r => {
            const fechaR = new Date(r.fecha_evento).toISOString().split('T')[0];
            return fechaR === fecha && r.estado !== 'Cancelado';
        });

        if (fechaDuplicada) {
            const fechaFormateada = new Date(fecha).toLocaleDateString('es-MX');
            status.style.color = 'red';
            status.textContent = `⚠️ Ya existe un evento agendado para el ${fechaFormateada}.`;
            alert(`⚠️ Ya existe un evento agendado para el ${fechaFormateada}. Por favor elige otra fecha.`);
            return;
        }

        status.textContent = 'Guardando...';

        // 2. Guardar cliente
        const resCliente  = await fetch(`${CONT_API}/clientes`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ NombreCompleto: nombre, Telefono: telefono, Correo: correo })
        });
        const dataCliente = await resCliente.json();
        const clienteId   = dataCliente.id;

        // 3. Guardar cotización
        const resCot  = await fetch(`${CONT_API}/cotizaciones`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                CLIENTES_id_clientes: clienteId,
                fecha_emision:        new Date().toISOString().split('T')[0],
                monto_estimado:       parseFloat(monto),
                detalles:             `${tipo} - Anticipo: $${anticipo}`
            })
        });
        const dataCot = await resCot.json();
        const cotId   = dataCot.id;

        // 4. Guardar reservación
        const sesion = JSON.parse(sessionStorage.getItem('usuario'));
        const resRes = await fetch(`${CONT_API}/reservaciones`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                COTIZACIONES_CLIENTES_id_clientes: clienteId,
                COTIZACIONES_id_cotizaciones:      cotId,
                USUARIOS_id_usuario:               sesion?.id || 1,
                fecha_evento:  fecha,
                hora_inicio:   horaI || '00:00',
                hora_fin:      horaF || '00:00',
                tipo_evento:   tipo,
                estado:        'Confirmado'
            })
        });
        const dataRes = await resRes.json();

        if (!resRes.ok) {
            status.style.color = 'red';
            status.textContent = `⚠️ ${dataRes.error}`;
            alert(`⚠️ ${dataRes.error}`);
            return;
        }

        status.style.color = 'green';
        status.textContent = `✅ Contrato guardado correctamente`;
        window.print();

    } catch (err) {
        console.error(err);
        status.style.color = 'red';
        status.textContent = '❌ Error al guardar. Verifica la conexión.';
    }
}

async function cancelarEvento() {
    const status = document.getElementById('contrato-status');

    try {
        const resR          = await fetch(`${CONT_API}/reservaciones`);
        const reservaciones = await resR.json();
        const activas       = reservaciones.filter(r => r.estado !== 'Cancelado');

        if (activas.length === 0) {
            alert('No hay eventos activos para cancelar.');
            return;
        }

        const resC     = await fetch(`${CONT_API}/clientes`);
        const clientes = await resC.json();

        let opciones = 'Selecciona el número del evento a cancelar:\n\n';
        activas.forEach((r, i) => {
            const cliente = clientes.find(c => c.id_clientes === r.COTIZACIONES_CLIENTES_id_clientes);
            const nombre  = cliente ? cliente.NombreCompleto : `Cliente #${r.COTIZACIONES_CLIENTES_id_clientes}`;
            const fecha   = new Date(r.fecha_evento).toLocaleDateString('es-MX');
            opciones += `${i + 1}. ${nombre} — ${r.tipo_evento} — ${fecha}\n`;
        });

        const seleccion = prompt(opciones);
        if (!seleccion) return;

        const idx     = parseInt(seleccion) - 1;
        const reserva = activas[idx];
        if (!reserva) { alert('Selección inválida'); return; }

        const cliente = clientes.find(c => c.id_clientes === reserva.COTIZACIONES_CLIENTES_id_clientes);
        const nombre  = cliente ? cliente.NombreCompleto : 'este cliente';
        const fecha   = new Date(reserva.fecha_evento).toLocaleDateString('es-MX');

        const motivo = prompt(`¿Cuál es el motivo de cancelación del evento de ${nombre} el ${fecha}?`);
        if (!motivo) return;

        if (!confirm(`¿Confirmas la cancelación del evento de ${nombre} el ${fecha}?`)) return;

        // Cancelar en BD
        const resCan = await fetch(`${CONT_API}/reservaciones/${reserva.id_reservaciones}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ estado: 'Cancelado' })
        });

        if (!resCan.ok) {
            alert('Error al cancelar el evento');
            return;
        }

        // Mostrar contrato de cancelación
        mostrarContratoCancelacion(nombre, fecha, reserva.tipo_evento, motivo);

        status.style.color = 'orange';
        status.textContent = `❌ Evento de ${nombre} cancelado`;

    } catch (err) {
        console.error(err);
        alert('Error al cancelar el evento');
    }
}

function mostrarContratoCancelacion(nombre, fecha, tipo, motivo) {
    const fechaHoy = new Date().toLocaleDateString('es-MX');

    const texto = `
        <center><h2>CONTRATO DE CANCELACIÓN DE EVENTO</h2></center>
        <br>
        <p>En la ciudad de Saltillo, Coahuila, a fecha <b>${fechaHoy}</b>, se hace constar la cancelación del contrato de prestación de servicios celebrado entre <b>SALÓN MUNDO MÁGICO</b> y el C. <b>${nombre}</b>.</p>
        <br>
        <p><b>EVENTO CANCELADO:</b> ${tipo} programado para el día <b>${fecha}</b>.</p>
        <br>
        <p><b>MOTIVO DE CANCELACIÓN:</b> ${motivo}</p>
        <br>
        <p><b>PRIMERA:</b> Ambas partes acuerdan de manera voluntaria la cancelación del evento antes mencionado.</p>
        <br>
        <p><b>SEGUNDA:</b> Conforme a los términos del contrato original, el anticipo entregado por el cliente <b>NO será reembolsable</b>, quedando como compensación para el Salón Mundo Mágico por los gastos de reservación incurridos.</p>
        <br>
        <p><b>TERCERA:</b> Con la firma del presente documento, ambas partes dan por terminada toda obligación derivada del contrato original.</p>
        <br><br><br>
        <div style="display:flex; justify-content: space-around; margin-top: 40px;">
            <span>_______________________<br>Firma del Cliente<br>${nombre}</span>
            <span>_______________________<br>Salón Mundo Mágico</span>
        </div>
    `;

    document.getElementById('documento-texto').innerHTML = texto;

    // Imprimir el contrato de cancelación
    setTimeout(() => window.print(), 500);
}

function imprimirContrato() {
    window.print();
}

actualizarVistaPrevia();