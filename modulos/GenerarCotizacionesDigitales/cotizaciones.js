function calcularTotal() {
    const rentaBase = parseFloat(document.getElementById('tipo-evento').value);
    const numInvitados = parseInt(document.getElementById('invitados').value) || 0;
    const costoPlatillo = parseFloat(document.getElementById('costo-platillo').value) || 0;

    const banqueteTotal = numInvitados * costoPlatillo;
    const granTotal = rentaBase + banqueteTotal;

    // Actualizar vista
    document.getElementById('resumen-renta').innerText = `$${rentaBase.toLocaleString()}`;
    document.getElementById('resumen-banquete').innerText = `$${banqueteTotal.toLocaleString()}`;
    document.getElementById('total-final').innerText = `$${granTotal.toLocaleString()}`;
}

function descargarPDF() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const tipoEvento = document.getElementById('tipo-evento').options[document.getElementById('tipo-evento').selectedIndex].text;
        const invitados  = document.getElementById('invitados').value;
        const platillo   = document.getElementById('costo-platillo').value;
        const renta      = document.getElementById('resumen-renta').innerText;
        const banquete   = document.getElementById('resumen-banquete').innerText;
        const total      = document.getElementById('total-final').innerText;
        const fecha      = new Date().toLocaleDateString('es-MX');

        // Encabezado
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('SALÓN MUNDO MÁGICO', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Cotización Digital', 105, 30, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Fecha: ${fecha}`, 105, 38, { align: 'center' });

        // Línea separadora
        doc.line(20, 42, 190, 42);

        // Datos del evento
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Datos del Evento', 20, 52);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`Tipo de Evento:`, 20, 62);
        doc.text(tipoEvento, 80, 62);
        doc.text(`Número de Invitados:`, 20, 72);
        doc.text(invitados, 80, 72);
        doc.text(`Costo por Platillo:`, 20, 82);
        doc.text(`$${parseFloat(platillo).toLocaleString()}`, 80, 82);

        // Línea separadora
        doc.line(20, 90, 190, 90);

        // Resumen
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Resumen de Presupuesto', 20, 100);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text('Renta del Salón:', 20, 112);
        doc.text(renta, 160, 112, { align: 'right' });
        doc.text('Banquete:', 20, 122);
        doc.text(banquete, 160, 122, { align: 'right' });

        // Línea y total
        doc.line(20, 128, 190, 128);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('TOTAL ESTIMADO:', 20, 138);
        doc.text(total, 160, 138, { align: 'right' });

        // Pie de página
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text('Esta cotización es un estimado y está sujeta a cambios.', 105, 270, { align: 'center' });
        doc.text('Salón Mundo Mágico - Saltillo, Coahuila', 105, 276, { align: 'center' });

        doc.save(`Cotizacion_MundoMagico_${fecha.replace(/\//g, '-')}.pdf`);
    };
    document.body.appendChild(script);
}


// Ejecutar cálculo inicial al cargar
calcularTotal();
