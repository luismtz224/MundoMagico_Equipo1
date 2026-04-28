function actualizarVistaPrevia() {
    const cliente = document.getElementById('cliente-nombre').value || "[NOMBRE DEL CLIENTE]";
    const fecha = document.getElementById('contrato-fecha').value || "[FECHA]";
    const monto = document.getElementById('contrato-monto').value || "0.00";
    const anticipo = document.getElementById('contrato-anticipo').value || "0.00";

    const texto = `
        <center><h2>CONTRATO DE PRESTACIÓN DE SERVICIOS</h2></center>
        <br>
        <p>En la ciudad de Saltillo, Coahuila, se celebra el presente contrato entre <b>SALÓN MUNDO MÁGICO</b> y el C. <b>${cliente}</b>.</p>
        <br>
        <p><b>PRIMERA:</b> El prestador se compromete a facilitar las instalaciones del salón para el evento a realizarse el día <b>${fecha}</b>.</p>
        <br>
        <p><b>SEGUNDA:</b> El costo total del evento será de <b>$${parseFloat(monto).toLocaleString()} MXN</b>, de los cuales se recibe un anticipo de <b>$${parseFloat(anticipo).toLocaleString()} MXN</b>.</p>
        <br>
        <p><b>TERCERA:</b> El cliente se hace responsable de cualquier daño al mobiliario o instalaciones...</p>
        <br><br><br>
        <div style="display:flex; justify-content: space-around;">
            <span>_______________________<br>Firma del Cliente</span>
            <span>_______________________<br>Mundo Mágico</span>
        </div>
    `;

    document.getElementById('documento-texto').innerHTML = texto;
}

function imprimirContrato() {
    window.print(); // Abre el diálogo de impresión del navegador
}

// Iniciar con texto base
actualizarVistaPrevia();