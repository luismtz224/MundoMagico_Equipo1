const BACKEND_URL = 'http://localhost:3000';

// ── INICIO ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    checkSession();
});

function checkSession() {
    const sesion = JSON.parse(sessionStorage.getItem('usuario'));
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
    const main = document.getElementById('main-content');

    // Marcar ítem activo en sidebar
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    const liActivo = document.querySelector(`.sidebar li[onclick*="'${nombre}'"]`);
    if (liActivo) liActivo.classList.add('active');

    // Centrar solo el login
    main.style.alignItems = (nombre === 'login') ? 'center' : 'flex-start';
    main.style.justifyContent = (nombre === 'login') ? 'center' : 'flex-start';

    try {
        const respuesta = await fetch(`./modulos/${nombre}/${nombre}.html`);
        if (!respuesta.ok) throw new Error('Módulo no encontrado');
        const html = await respuesta.text();
        contenedor.innerHTML = html;

        // Cargar el JS del módulo
        const scriptAnterior = document.getElementById('script-modulo');
        if (scriptAnterior) scriptAnterior.remove();

        const script = document.createElement('script');
        script.id = 'script-modulo';
        script.src = `./modulos/${nombre}/${nombre}.js?t=${Date.now()}`;
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
        const itemUsuarios = document.getElementById('item-usuarios');
        const itemReportes = document.getElementById('item-reportes');
        if (itemUsuarios) itemUsuarios.style.display = 'none';
        if (itemReportes) itemReportes.style.display = 'none';
    }
}

// ── LOGOUT ───────────────────────────────────────────────────
function logout() {
    if (confirm("¿Deseas cerrar la sesión?")) {
        sessionStorage.removeItem('usuario');
        location.reload();
    }
}
