const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa el paquete cors
const usuarioRoutes = require('./Router/Usuario');
const clienteRoutes = require('./Router/Cliente');
const creditoRoutes = require('./Router/Credito');
const pagoRoutes = require('./Router/Pago');
const productoRoutes = require('./Router/Producto');
const tipoCreditoRoutes = require('./Router/TipoCredito');
const tipoInteresRoutes = require('./Router/TipoInteres');
const ventaRoutes = require('./Router/Venta');
const cuotaRoutes = require('./Router/Cuota');
const cuentaCorrienteRoutes = require('./Router/CuentaCorriente');
const graficoRoutes = require('./Router/Grafico');
const morgan = require('morgan');


const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/finanzas';

// Conexión a la base de datos MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('No se pudo conectar a MongoDB', err));

// Middleware
app.use(cors()); // Usa el middleware cors para habilitar CORS
app.use(express.json());
app.use(morgan('dev')); // Integrar Morgan para el registro de solicitudes

// Rutas
app.use(usuarioRoutes);
app.use(clienteRoutes);
app.use(creditoRoutes);
app.use(pagoRoutes);
app.use(productoRoutes);
app.use(tipoCreditoRoutes);
app.use(tipoInteresRoutes);

app.use(ventaRoutes);

app.use(cuotaRoutes);
app.use(cuentaCorrienteRoutes);
app.use(graficoRoutes);

// Usa Morgan para el registro de solicitudes
app.use(morgan('combined'));
// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
