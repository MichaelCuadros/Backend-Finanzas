const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  dni: { type: Number, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  tasaMoratoria: { type: Number, required: true },
  limiteCredito: { type: Number, required: true },
  fechaPagoMensual: { type: Date, required: true }
});

// Middleware para convertir la fecha de pago mensual a la zona horaria de Lima
ClienteSchema.pre('save', function (next) {
  this.fechaPagoMensual = moment(this.fechaPagoMensual).tz('America/Lima').toDate();
  next();
});

module.exports = mongoose.model('Cliente', ClienteSchema, 'clientes');
