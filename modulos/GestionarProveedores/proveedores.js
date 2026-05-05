var PROV_API = 'http://localhost:3000';

async function cargarProveedores() {
    try {
        const res         = await fetch(`${PROV_API}/proveedores`);
        const proveedores = await res.json();
        const contenedor  = document.getElementById('contenedorProveedores');
        const selectProv  = document.getElementById('serv-proveedor');

        contenedor.innerHTML  = '';
        selectProv.innerHTML  = '<option value="">Selecciona un proveedor...</option>';

        const colores = ['#3498db', '#27ae60', '#f39c12', '#9b59b6', '#e74c3c'];

        if (!Array.isArray(proveedores) || proveedores.length === 0) {
            contenedor.innerHTML = '<p style="color:#888;text-align:center;padding:20px;grid-column:span 3;">No hay proveedores registrados.</p>';
            return;
        }

        proveedores.forEach((p, i) => {
            const color = colores[i % colores.length];

            // Card del proveedor
            contenedor.innerHTML += `
                <div style="background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.05);border-left:4px solid ${color};padding:20px;">
                    <h5 style="margin:0 0 8px 0;font-size:1rem;font-weight:700;">${p.nombre_empresa}</h5>
                    <p style="color:#888;font-size:0.85rem;margin-bottom:6px;"><strong>Servicio:</strong> ${p.servicio}</p>
                    <p style="font-size:0.85rem;margin-bottom:15px;">📞 ${p.contacto}</p>
                    <div style="display:flex;justify-content:flex-end;gap:8px;">
                        <button style="padding:6px 12px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.8rem;"
                            onclick="eliminarProveedor(${p.id_proveedores})">Eliminar</button>
                    </div>
                </div>`;

            // Opción en el select
            selectProv.innerHTML += `<option value="${p.id_proveedores}|${p.nombre_empresa}|${p.servicio}">${p.nombre_empresa} — ${p.servicio}</option>`;
        });
    } catch (e) {
        console.error('Error cargando proveedores:', e);
    }
}

async function agregarProveedor() {
    const nombre   = document.getElementById('prov-nombre').value.trim();
    const servicio = document.getElementById('prov-servicio').value.trim();
    const contacto = document.getElementById('prov-contacto').value.trim();

    if (!nombre || !servicio || !contacto) {
        alert('Por favor completa todos los campos.');
        return;
    }

    try {
        const res  = await fetch(`${PROV_API}/proveedores`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ nombre_empresa: nombre, servicio, contacto })
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Error'); return; }
        alert('Proveedor agregado correctamente');
        document.getElementById('prov-nombre').value   = '';
        document.getElementById('prov-servicio').value = '';
        document.getElementById('prov-contacto').value = '';
        cargarProveedores();
    } catch (e) {
        alert('Error al agregar proveedor');
    }
}

async function eliminarProveedor(id) {
    if (!confirm('¿Eliminar este proveedor?')) return;
    try {
        await fetch(`${PROV_API}/proveedores/${id}`, { method: 'DELETE' });
        cargarProveedores();
    } catch (e) {
        alert('Error al eliminar');
    }
}

async function registrarServicio() {
    const selVal      = document.getElementById('serv-proveedor').value;
    const descripcion = document.getElementById('serv-descripcion').value.trim();
    const costo       = document.getElementById('serv-costo').value;
    const fecha       = document.getElementById('serv-fecha').value;

    if (!selVal || !descripcion || !costo || !fecha) {
        alert('Por favor completa todos los campos del servicio.');
        return;
    }

    const [provId, nombre, servicio] = selVal.split('|');

    try {
        // Registrar como egreso en reportes
        const res = await fetch(`${PROV_API}/reportes/egreso`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                concepto:     `${nombre} — ${descripcion}`,
                monto:        parseFloat(costo),
                fecha_egreso: fecha,
                categoria:    'Proveedor'
            })
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Error'); return; }

        alert(`Servicio registrado correctamente. Se agregó $${parseFloat(costo).toLocaleString()} como egreso en Reportes Financieros.`);
        document.getElementById('serv-descripcion').value = '';
        document.getElementById('serv-costo').value       = '';
        document.getElementById('serv-fecha').value       = '';
        document.getElementById('serv-proveedor').value   = '';
    } catch (e) {
        alert('Error al registrar servicio');
    }
}

cargarProveedores();
