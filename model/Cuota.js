const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CuotaSchema = new Schema({
    numeroCuota: { type: Number, required: true },
    monto: { type: Number, default: true },
    interes:{ type: Number, default: 0 },
    amortizacion:{ type: Number, default: 0 },
    estado: { type: Boolean,default:true },
    mes: { type: String, required: true }, // Agregado como string
    diasMora: { type: Number, required: true }, // Agregado como número
    montoMora:{ type: Number, default: 0 },
    credito_id: { type: Schema.Types.ObjectId, ref: 'Credito', required: true },
    saldo: { type: Number }, 
});

module.exports = mongoose.model('Cuota', CuotaSchema, 'cuotas');
