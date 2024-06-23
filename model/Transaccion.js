const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Schema = mongoose.Schema;

const TransaccionSchema = new Schema({
    CuentaCorriente_id: { type: Schema.Types.ObjectId, ref: 'CuentaCorriente', required: true },
    fecha: { type: Date, required: true, default: () => moment().tz('America/Lima').toDate() },
    tipo: { type: String, required: true, enum: ['Entrada', 'Salida'] },
    monto: { type: Number, required: true },
    descripcion: { type: String }
});

TransaccionSchema.pre('save', function (next) {
    this.fecha = moment(this.fecha).tz('America/Lima').toDate();
    next();
});

module.exports = mongoose.model('Transaccion', TransaccionSchema, 'transacciones');
