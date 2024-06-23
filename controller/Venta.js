const Venta = require('../model/Venta');

const Transaccion = require('../model/Transaccion');
const CuentaCorriente = require('../model/CuentaCorriente');
const Cliente = require('../model/Cliente');
const moment = require('moment-timezone');
// Controlador para la creación de una nueva venta
// Controlador para la creación de una nueva venta
exports.crearVenta = async (req, res) => {
  try {
    const nuevaVenta = new Venta(req.body);
    const ventaGuardada = await nuevaVenta.save();
    const cliente = await Cliente.findById(req.body.Cliente_id);

    // Buscar o crear la cuenta corriente
    let cuentaCorriente = await CuentaCorriente.findOne({ nombre: 'Cuenta Corriente General' });
    if (!cuentaCorriente) {
      cuentaCorriente = new CuentaCorriente({ nombre: 'Cuenta Corriente General', saldo: 0 });
    }
    cuentaCorriente.saldo += Number(req.body.montoTotal);
    await cuentaCorriente.save();



    // Crear una transacción en la cuenta corriente
    const nuevaTransaccion = new Transaccion({
      CuentaCorriente_id: cuentaCorriente._id,
      fecha: moment().tz('America/Lima').toDate(),
      tipo: 'Entrada',
      monto: Number(req.body.montoTotal),
      descripcion: `Venta creada para el cliente con DNI: ${cliente.dni}`
    });
    const transaccionGuardada = await nuevaTransaccion.save();

    // Agregar la transacción al array de transacciones en la cuenta corriente
    cuentaCorriente.transacciones.push(transaccionGuardada._id);
    await cuentaCorriente.save();

    res.status(201).json(ventaGuardada);
  } catch (error) {
    console.log(error)
    res.status(400).json({ mensaje: error.message });
  }
};


// Controlador para obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para obtener una venta por su ID
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para actualizar una venta por su ID
exports.actualizarVenta = async (req, res) => {
  try {
    const ventaActualizada = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ventaActualizada) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    res.status(200).json(ventaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para eliminar una venta por su ID
exports.eliminarVenta = async (req, res) => {
  try {
    const ventaEliminada = await Venta.findByIdAndDelete(req.params.id);
    if (!ventaEliminada) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    res.status(200).json({ mensaje: 'Venta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

