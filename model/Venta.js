const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoVentaSchema = new Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true }
});

const VentaSchema = new Schema({
  montoTotal: { type: Number, required: true },
  Cliente_id: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
  fechaVenta: { type: Date, required: true },
  numeroBoleta: { type: Number, required: true },
  formaPago: { type: String, required: true },
  productos: [ProductoVentaSchema] // Array de subdocumentos que incluye el producto y la cantidad
});

module.exports = mongoose.model('Venta', VentaSchema, 'ventas');
