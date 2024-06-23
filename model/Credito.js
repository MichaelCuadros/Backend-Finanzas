const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Schema = mongoose.Schema;

const ProductoCreditoSchema = new Schema({
  producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true }
});

const CreditoSchema = new Schema({
  Cliente_id: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
  estado: { type: Boolean, default: true },
  FechaCredito: { type: Date, required: true, default: () => moment().tz('America/Lima').toDate() },
  TipoCredito_id: { type: Schema.Types.ObjectId, ref: 'TipoCredito', required: true },
  TipoInteres_id: { type: Schema.Types.ObjectId, ref: 'TipoInteres', required: true },
  tasaInteres: { type: Number, required: true },
  monto: { type: Number, required: true },
  numeroCuotas: { type: Number, required: true },
  plazoGracia: { type: Number, required: true },
  cuotas: [{ type: Schema.Types.ObjectId, ref: 'Cuota' }],
  productos: [ProductoCreditoSchema] // Array de subdocumentos que incluye el producto y la cantidad
});

CreditoSchema.pre('save', function (next) {
  this.FechaCredito = moment(this.FechaCredito).tz('America/Lima').toDate();
  next();
});

module.exports = mongoose.model('Credito', CreditoSchema, 'creditos');
