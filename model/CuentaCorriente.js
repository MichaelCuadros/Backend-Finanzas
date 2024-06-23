const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CuentaCorrienteSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    saldo: { type: Number, required: true, default: 0 },
    transacciones: [{ type: Schema.Types.ObjectId, ref: 'Transaccion' }]
});

module.exports = mongoose.model('CuentaCorriente', CuentaCorrienteSchema, 'cuentas_corrientes');
