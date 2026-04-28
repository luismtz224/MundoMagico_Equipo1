function actualizarMensaje() {
    const select = document.getElementById('cliente-select');
    const cliente = select.value;
    const tipo = document.getElementById('tipo-recordatorio').value;
    const textarea = document.getElementById('mensaje-texto');

    if (!cliente) {
        textarea.value = "";
        return;
    }

    const fecha = select.options[select.selectedIndex].getAttribute('data-fecha');
    const saldo = select.options[select.selectedIndex].getAttribute('data-saldo');

    let texto = "";
    if (tipo === 'pago') {
        texto = `Hola ${cliente}, te saludamos de Mundo Mágico. Te recordamos que tienes un saldo pendiente de $${saldo} para tu evento del día ${fecha}. Quedamos a tus órdenes.`;
    } else if (tipo === 'cita') {
        texto = `Hola ${cliente}, ¿cómo estás? Te escribimos de Mundo Mágico para agendar tu cita de planeación para los detalles de tu evento el día ${fecha}.`;
    } else {
        texto = `¡Hola ${cliente}! Ya falta poco para tu gran evento el ${fecha}. En Mundo Mágico estamos listos para recibirte.`;
    }

    textarea.value = texto;
}

function enviarSimulacion(medio) {
    const cliente = document.getElementById('cliente-select').value;
    if (!cliente) {
        alert("Por favor, selecciona un cliente primero.");
        return;
    }

    const log = document.getElementById('log-envios');
    if (log.querySelector('.log-vacio')) log.innerHTML = "";

    const li = document.createElement('li');
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    li.innerHTML = `<strong>${hora}</strong> - Recordatorio enviado a ${cliente} vía ${medio}`;
    log.prepend(li);

    alert(`Mensaje enviado exitosamente a ${cliente} por ${medio}.`);
}
