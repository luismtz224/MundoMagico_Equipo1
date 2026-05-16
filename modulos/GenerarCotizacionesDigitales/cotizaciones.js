var COT_API = 'https://mundomagicoequipo1-production.up.railway.app';

function calcularTotal() {
    const rentaBase     = parseFloat(document.getElementById('tipo-evento').value) || 0;
    const numInvitados  = parseInt(document.getElementById('invitados').value) || 0;
    const costoPlatillo = parseFloat(document.getElementById('costo-platillo').value) || 0;
    const extras        = parseFloat(document.getElementById('cot-extras').value) || 0;

    const banqueteTotal = numInvitados * costoPlatillo;
    const granTotal     = rentaBase + banqueteTotal + extras;

    document.getElementById('resumen-renta').innerText    = `$${rentaBase.toLocaleString()}`;
    document.getElementById('resumen-banquete').innerText = `$${banqueteTotal.toLocaleString()}`;
    document.getElementById('resumen-extras').innerText   = `$${extras.toLocaleString()}`;
    document.getElementById('total-final').innerText      = `$${granTotal.toLocaleString()}`;

    actualizarResumen();
}

function actualizarResumen() {
    const nombre = document.getElementById('cot-nombre').value || '—';
    const fecha  = document.getElementById('cot-fecha').value;
    const fechaFmt = fecha ? new Date(fecha).toLocaleDateString('es-MX') : '—';

    document.getElementById('resumen-cliente').textContent     = `Cliente: ${nombre}`;
    document.getElementById('resumen-fechaevento').textContent = `Fecha tentativa: ${fechaFmt}`;
}

async function guardarYDescargar() {
    const nombre   = document.getElementById('cot-nombre').value.trim();
    const telefono = document.getElementById('cot-telefono').value.trim();
    const correo   = document.getElementById('cot-correo').value.trim();
    const fecha    = document.getElementById('cot-fecha').value;
    const tipo     = document.getElementById('tipo-evento').options[document.getElementById('tipo-evento').selectedIndex].text;
    const total    = document.getElementById('total-final').innerText;
    const notas    = document.getElementById('cot-notas').value.trim();
    const status   = document.getElementById('cot-status');

    if (!nombre || !fecha) {
        alert('Por favor completa el nombre del cliente y la fecha tentativa.');
        return;
    }

    status.style.color   = 'blue';
    status.textContent   = 'Guardando cotización...';

    try {
        // 1. Guardar cliente
        const resCliente  = await fetch(`${COT_API}/clientes`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ NombreCompleto: nombre, Telefono: telefono, Correo: correo })
        });
        const dataCliente = await resCliente.json();
        const clienteId   = dataCliente.id;

        // 2. Guardar cotización
        const montoNum = parseFloat(total.replace(/[$,]/g, '')) || 0;
        const resCot   = await fetch(`${COT_API}/cotizaciones`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                CLIENTES_id_clientes: clienteId,
                fecha_emision:        new Date().toISOString().split('T')[0],
                monto_estimado:       montoNum,
                detalles:             `${tipo} | Fecha: ${fecha} | ${notas}`
            })
        });
        const dataCot = await resCot.json();

        status.style.color = 'green';
        status.textContent = `✅ Cotización guardada (ID: ${dataCot.id})`;

        // 3. Descargar PDF
        descargarPDF(nombre, tipo, fecha, notas);

    } catch (e) {
        console.error(e);
        status.style.color = 'orange';
        status.textContent = '⚠️ Error al guardar, descargando PDF de todas formas...';
        descargarPDF(nombre, tipo, fecha, notas);
    }
}

function descargarPDF(nombre, tipo, fecha, notas) {
    const script  = document.createElement('script');
    script.src    = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = function() {
        const { jsPDF } = window.jspdf;
        const doc        = new jsPDF();
        const fechaHoy   = new Date().toLocaleDateString('es-MX');
        const fechaEvento = fecha ? new Date(fecha).toLocaleDateString('es-MX') : '—';

        const invitados  = document.getElementById('invitados').value;
        const platillo   = document.getElementById('costo-platillo').value;
        const renta      = document.getElementById('resumen-renta').innerText;
        const banquete   = document.getElementById('resumen-banquete').innerText;
        const extras     = document.getElementById('resumen-extras').innerText;
        const total      = document.getElementById('total-final').innerText;

        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('SALÓN MUNDO MÁGICO', 105, 20, { align: 'center' });
        doc.setFontSize(13);
        doc.text('Cotización Personalizada', 105, 30, { align: 'center' });
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha de emisión: ${fechaHoy}`, 105, 38, { align: 'center' });
        doc.line(20, 42, 190, 42);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Datos del Cliente:', 20, 52);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`Nombre:`, 20, 62);   doc.text(nombre || '—', 70, 62);
        doc.text(`Teléfono:`, 20, 70); doc.text(document.getElementById('cot-telefono').value || '—', 70, 70);
        doc.text(`Correo:`, 20, 78);   doc.text(document.getElementById('cot-correo').value || '—', 70, 78);

        doc.line(20, 84, 190, 84);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Datos del Evento:', 20, 92);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`Tipo de Evento:`,      20, 102); doc.text(tipo, 80, 102);
        doc.text(`Fecha Tentativa:`,     20, 110); doc.text(fechaEvento, 80, 110);
        doc.text(`Núm. de Invitados:`,   20, 118); doc.text(invitados, 80, 118);
        doc.text(`Costo por Platillo:`,  20, 126); doc.text(`$${parseFloat(platillo).toLocaleString()}`, 80, 126);

        doc.line(20, 132, 190, 132);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Resumen de Costos:', 20, 140);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text('Renta del Salón:',        20, 150); doc.text(renta,    160, 150, { align: 'right' });
        doc.text('Banquete:',               20, 158); doc.text(banquete, 160, 158, { align: 'right' });
        doc.text('Servicios adicionales:',  20, 166); doc.text(extras,   160, 166, { align: 'right' });
        doc.line(20, 172, 190, 172);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('TOTAL ESTIMADO:', 20, 182);
        doc.text(total, 160, 182, { align: 'right' });

        if (notas) {
            doc.line(20, 190, 190, 190);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text('Notas:', 20, 198);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const notasLines = doc.splitTextToSize(notas, 160);
            doc.text(notasLines, 20, 206);
        }

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150);
        doc.text('Esta cotización es un estimado y está sujeta a cambios.', 105, 270, { align: 'center' });
        doc.text('Salón Mundo Mágico — Saltillo, Coahuila', 105, 276, { align: 'center' });

        doc.save(`Cotizacion_${nombre.replace(/ /g,'_')}_${fechaHoy.replace(/\//g,'-')}.pdf`);
    };
    document.body.appendChild(script);
}

calcularTotal();
