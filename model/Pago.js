const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PagoSchema = new Schema({
  montoTotal: { type: Number, required: true },
  fechaPago: { type: Date, required: true },
  Cuota_id: { type: Schema.Types.ObjectId, ref: 'Cuota', required: true }
});

module.exports = mongoose.model('Pago', PagoSchema, 'pagos');
