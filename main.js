const BACKEND_URL = 'http://localhost:3000';
 
// ── MAPEO DE MÓDULOS ─────────────────────────────────────────
const MODULOS = {
    'usuarios':      { carpeta: 'AdministrarUsuarios',          archivo: 'usuarios'      },
    'inventario':    { carpeta: 'GestionarInventario',          archivo: 'inventario'    },
    'cotizaciones':  { carpeta: 'GenerarCotizacionesDigitales', archivo: 'cotizaciones'  },
    'contratos':     { carpeta: 'GenerarContrato',              archivo: 'contratos'     },
    'pagos':         { carpeta: 'RegistrarPagos',               archivo: 'pagos'         },
    'reportes':      { carpeta: 'ReportesFinancieros',          archivo: 'reportes'      },
    'proveedores':   { carpeta: 'GestionarProveedores',         archivo: 'proveedores'   },
    'danos':         { carpeta: 'RegistrarDaños',               archivo: 'daños'         },
    'recordatorios': { carpeta: 'GenerarRecordatorios',         archivo: 'recordatorios' },
    'login':         { carpeta: 'login',                        archivo: 'login'         }
};
 
// ── INICIO ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    checkSession();
});
 
function checkSession() {
    const sesion  = JSON.parse(sessionStorage.getItem('usuario'));
    const sidebar = document.getElementById('sidebar');
 
    if (!sesion) {
        sidebar.style.display = 'none';
        cargarModulo('login');
    } else {
        sidebar.style.display = 'flex';
        aplicarPermisos(sesion.tipo);
        cargarModulo('usuarios');
    }
}
 
// ── CARGAR MÓDULO ────────────────────────────────────────────
async function cargarModulo(nombre) {
    const contenedor = document.getElementById('escenario-principal');
    const main       = document.getElementById('main-content');
    const modulo     = MODULOS[nombre];
 
    if (!modulo) {
        contenedor.innerHTML = `<div style="padding:40px;text-align:center;color:#888;">
            <h2>Módulo no encontrado</h2><p>${nombre}</p>
        </div>`;
        return;
    }
 
    // Marcar ítem activo en sidebar
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    const liActivo = document.querySelector(`.sidebar li[onclick*="'${nombre}'"]`);
    if (liActivo) liActivo.classList.add('active');
 
    // Centrar solo el login
    main.style.alignItems   = (nombre === 'login') ? 'center'    : 'flex-start';
    main.style.justifyContent = (nombre === 'login') ? 'center'  : 'flex-start';
 
    try {
        const ruta     = `./modulos/${modulo.carpeta}/${modulo.archivo}.html`;
        const respuesta = await fetch(ruta);
        if (!respuesta.ok) throw new Error(`No se encontró: ${ruta}`);
 
        const html = await respuesta.text();
        contenedor.innerHTML = html;
 
        // Cargar JS del módulo
        const scriptAnterior = document.getElementById('script-modulo');
        if (scriptAnterior) scriptAnterior.remove();
 
        const script = document.createElement('script');
        script.id  = 'script-modulo';
        script.src = `./modulos/${modulo.carpeta}/${modulo.archivo}.js?t=${Date.now()}`;
        document.body.appendChild(script);
 
    } catch (e) {
        contenedor.innerHTML = `<div style="padding:40px;text-align:center;color:#888;">
            <h2>Módulo no disponible</h2><p>${e.message}</p>
        </div>`;
    }
}
 
// ── PERMISOS POR ROL ─────────────────────────────────────────
function aplicarPermisos(rol) {
    if (rol === 'Encargado') {
        const modulos = ['item-usuarios', 'item-inventario', 'item-cotizaciones', 
                         'item-contratos', 'item-pagos', 'item-reportes', 'item-proveedores'];
        modulos.forEach(id => {
            const item = document.getElementById(id);
            if (item) item.style.display = 'none';
        });
    }
}
 
// ── LOGOUT ───────────────────────────────────────────────────
function logout() {
    if (confirm("¿Deseas cerrar la sesión?")) {
        sessionStorage.removeItem('usuario');
        location.reload();
    }
}