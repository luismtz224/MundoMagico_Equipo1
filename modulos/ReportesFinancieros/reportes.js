var REPORTES_API = 'http://localhost:3000';
var _movimientos = [];
var _resumen     = {};

function fmtDinero(n) {
    return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function fmtFechaR(f) {
    if (!f) return '—';
    const d     = new Date(f);
    const local = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    return local.toLocaleDateString('es-MX');
}

async function cargarReporte(fecha = '') {
    try {
        const url = fecha
            ? `${REPORTES_API}/reportes?fecha=${fecha}`
            : `${REPORTES_API}/reportes`;

        const res  = await fetch(url);
        const data = await res.json();

        _resumen     = data;
        _movimientos = data.movimientos || [];

        document.getElementById('totalIngresos').textContent = fmtDinero(data.total_ingresos || 0);
        document.getElementById('totalEgresos').textContent  = fmtDinero(data.total_egresos  || 0);
        document.getElementById('saldoNeto').textContent     = fmtDinero(data.saldo_neto     || 0);

        renderTablaReportes(_movimientos);
    } catch (e) {
        console.error('Error cargando reporte:', e);
        document.getElementById('cuerpoTablaReportes').innerHTML =
            '<tr><td colspan="6" class="tabla-empty">Error al cargar los datos.</td></tr>';
    }
}

function renderTablaReportes(movimientos) {
    const tbody = document.getElementById('cuerpoTablaReportes');

    if (!movimientos || movimientos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="tabla-empty">No hay movimientos para mostrar.</td></tr>';
        return;
    }

    tbody.innerHTML = movimientos.map(m => {
        const esEgreso  = m.tipo === 'Egreso';
        const badge     = esEgreso ? 'badge-egreso'  : 'badge-ingreso';
        const montoClass = esEgreso ? 'monto-egreso' : 'monto-ingreso';
        return `
            <tr>
                <td>${fmtFechaR(m.fecha)}</td>
                <td>${m.cliente  || '—'}</td>
                <td>${m.concepto || '—'}</td>
                <td><span class="${badge}">${m.tipo}</span></td>
                <td class="${montoClass}">${fmtDinero(m.monto)}</td>
                <td>${m.metodo   || '—'}</td>
            </tr>
        `;
    }).join('');
}

function aplicarFiltro() {
    const fecha = document.getElementById('filtroFecha').value;
    if (!fecha) { alert('Selecciona una fecha para filtrar.'); return; }
    cargarReporte(fecha);
}

function limpiarFiltro() {
    document.getElementById('filtroFecha').value = '';
    cargarReporte();
}

async function registrarEgreso() {
    const concepto  = document.getElementById('egreso-concepto').value.trim();
    const categoria = document.getElementById('egreso-categoria').value;
    const monto     = document.getElementById('egreso-monto').value;
    const fecha     = document.getElementById('egreso-fecha').value;

    if (!concepto || !monto || !fecha) {
        alert('Por favor completa concepto, monto y fecha del egreso.');
        return;
    }

    try {
        const res  = await fetch(`${REPORTES_API}/reportes/egreso`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ concepto, monto: parseFloat(monto), fecha_egreso: fecha, categoria })
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Error'); return; }
        alert('Egreso registrado correctamente');
        document.getElementById('egreso-concepto').value = '';
        document.getElementById('egreso-monto').value    = '';
        document.getElementById('egreso-fecha').value    = '';
        cargarReporte();
    } catch (e) {
        alert('Error al registrar egreso');
    }
}

function descargarReportePDF() {
    // Cargar jsPDF y autotable dinámicamente
    const s1    = document.createElement('script');
    s1.src      = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s1.onload   = () => {
        const s2  = document.createElement('script');
        s2.src    = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
        s2.onload = () => generarPDF();
        document.body.appendChild(s2);
    };
    document.body.appendChild(s1);
}

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc  = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-MX');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SALÓN MUNDO MÁGICO', 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Reporte de Ingresos y Egresos', 105, 27, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(`Generado: ${fecha}`, 105, 34, { align: 'center' });
    doc.setTextColor(0);

    doc.line(14, 38, 196, 38);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Financiero:', 14, 46);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total Ingresos: ${fmtDinero(_resumen.total_ingresos || 0)}`, 14, 54);
    doc.text(`Total Egresos:  ${fmtDinero(_resumen.total_egresos  || 0)}`, 14, 61);
    doc.text(`Saldo Neto:     ${fmtDinero(_resumen.saldo_neto     || 0)}`, 14, 68);

    const rows = _movimientos.map(m => [
        fmtFechaR(m.fecha),
        m.cliente  || '—',
        m.concepto || '—',
        m.tipo,
        fmtDinero(m.monto),
        m.metodo   || '—'
    ]);

    doc.autoTable({
        startY     : 76,
        head       : [['Fecha', 'Cliente/Cat.', 'Concepto', 'Tipo', 'Monto', 'Método']],
        body       : rows,
        styles     : { fontSize: 8, cellPadding: 3 },
        headStyles : { fillColor: [83, 79, 255], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 250] },
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 3) {
                if (data.cell.raw === 'Egreso') {
                    data.cell.styles.textColor = [231, 76, 60];
                } else {
                    data.cell.styles.textColor = [39, 174, 96];
                }
            }
        }
    });

    const finalY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Salón Mundo Mágico — Saltillo, Coahuila', 105, finalY, { align: 'center' });

    doc.save(`Reporte_MundoMagico_${fecha.replace(/\//g, '-')}.pdf`);
}

cargarReporte();