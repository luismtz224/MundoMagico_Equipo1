async function validar() {
    const userVal  = document.getElementById('user').value.trim();
    const passVal  = document.getElementById('pass').value.trim();
    const errorMsg = document.getElementById('error');

    errorMsg.style.display = 'none';

    if (!userVal || !passVal) {
        errorMsg.textContent   = 'Por favor llena todos los campos';
        errorMsg.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ NombreUsuario: userVal, Contrasena: passVal })
        });

        const data = await response.json();

        if (!response.ok) {
            errorMsg.textContent   = data.error || 'Credenciales incorrectas';
            errorMsg.style.display = 'block';
            return;
        }

        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        mostrarBienvenida(data.usuario);

    } catch (err) {
        console.error('Error:', err);
        errorMsg.textContent   = 'No se pudo conectar con el servidor';
        errorMsg.style.display = 'block';
    }
}

function mostrarBienvenida(usuario) {
    const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('wNombre').textContent = usuario.nombre;
    document.getElementById('wRol').textContent    = usuario.tipo;
    document.getElementById('wHora').textContent   = hora;

    document.getElementById('loginCard').style.display   = 'none';
    document.getElementById('welcomeCard').style.display = 'block';
}

function continuar() {
    location.reload();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') validar();
});
