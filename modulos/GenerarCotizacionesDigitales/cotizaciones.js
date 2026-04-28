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
    alert("Generando PDF de la cotización... (Aquí conectarías con jsPDF en el futuro)");
}

// Ejecutar cálculo inicial al cargar
calcularTotal();