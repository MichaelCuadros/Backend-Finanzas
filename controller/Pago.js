const Pago = require('../model/Pago');
const Cuota = require('../model/Cuota');
const Credito = require('../model/Credito');
const moment = require('moment-timezone');
const Transaccion = require('../model/Transaccion');
const CuentaCorriente = require('../model/CuentaCorriente');
const Cliente = require('../model/Cliente');

// Controlador para la creación de un nuevo pago
exports.crearPago = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud:', req.body);

    const { montoTotal, Cuota_id } = req.body;

    console.log('montoTotal:', montoTotal);
    console.log('Cuota_id:', Cuota_id);

    // Validar que todos los campos requeridos están presentes
    if (montoTotal === undefined || Cuota_id === undefined) {
      console.log('Faltan campos requeridos');
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
    }

    // Verificar que Cuota existe
    const cuota = await Cuota.findById(Cuota_id);
    if (!cuota) {
      console.log('Cuota no encontrada');
      return res.status(404).json({ mensaje: 'Cuota no encontrada' });
    }

    console.log('Cuota encontrada:', cuota);

    // Establecer la fecha de pago a la fecha y hora actuales en la zona horaria de Perú
    const fechaPago = moment().tz('America/Lima').toDate();

    // Crear un nuevo pago
    const nuevoPago = new Pago({
      montoTotal:montoTotal+cuota.montoMora,
      fechaPago,
      Cuota_id
    });

    console.log('Nuevo pago a guardar:', nuevoPago);

    // Guardar el nuevo pago en la base de datos
    const pagoGuardado = await nuevoPago.save();

    console.log('Pago guardado:', pagoGuardado);

    // Actualizar el estado de la cuota a false (pagada)
    cuota.estado = false;
    await cuota.save();

    console.log('Cuota actualizada:', cuota);

    // Verificar si todas las cuotas del crédito están pagadas
    const credito = await Credito.findById(cuota.credito_id).populate('cuotas');
    const todasCuotasPagadas = credito.cuotas.every(c => c.estado === false);

    console.log('Todas las cuotas pagadas:', todasCuotasPagadas);

    // Si todas las cuotas están pagadas, actualizar el estado del crédito a false
    if (todasCuotasPagadas) {
      credito.estado = false;
      await credito.save();
      console.log('Estado del crédito actualizado:', credito);
    }

    let cuentaCorriente = await CuentaCorriente.findOne({ nombre: 'Cuenta Corriente General' });
    if (!cuentaCorriente) {
      cuentaCorriente = new CuentaCorriente({ nombre: 'Cuenta Corriente General', saldo: 0 });
    }
    cuentaCorriente.saldo += montoTotal;
    await cuentaCorriente.save();

    const cliente = await Cliente.findById(credito.Cliente_id);

    // Crear una transacción en la cuenta corriente
    const nuevaTransaccion = new Transaccion({
      CuentaCorriente_id: cuentaCorriente._id,
      fecha: moment().tz('America/Lima').toDate(),
      tipo: 'Entrada',
      monto: montoTotal,
      descripcion: `Pago Realizado por el cliente con DNI: ${cliente.dni}`
    });
    const transaccionGuardada = await nuevaTransaccion.save();

    // Agregar la transacción al array de transacciones en la cuenta corriente
    cuentaCorriente.transacciones.push(transaccionGuardada._id);
    await cuentaCorriente.save();

    res.status(201).json(pagoGuardado);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para obtener todos los pagos
exports.obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.find();
    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para obtener un pago por su ID
exports.obtenerPagoPorId = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id);
    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }
    res.status(200).json(pago);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para actualizar un pago por su ID
exports.actualizarPago = async (req, res) => {
  try {
    const pagoActualizado = await Pago.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pagoActualizado) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }
    res.status(200).json(pagoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para eliminar un pago por su ID
exports.eliminarPago = async (req, res) => {
  try {
    const pagoEliminado = await Pago.findByIdAndDelete(req.params.id);
    if (!pagoEliminado) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }
    res.status(200).json({ mensaje: 'Pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
