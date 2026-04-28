const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/login',        require('./routes/login'));
app.use('/usuarios',     require('./routes/usuarios'));
app.use('/inventario',   require('./routes/inventario'));
app.use('/cotizaciones', require('./routes/cotizaciones'));
app.use('/contratos',    require('./routes/contratos'));
app.use('/pagos',        require('./routes/pagos'));
app.use('/proveedores',  require('./routes/proveedores'));
app.use('/danos',        require('./routes/danos'));
app.use('/reportes',     require('./routes/reportes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});