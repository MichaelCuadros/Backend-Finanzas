const Cuota = require('../model/Cuota');
const Pago = require('../model/Pago');

// Controlador para la creación de una nueva cuota
exports.crearCuota = async (req, res) => {
  try {
    const nuevaCuota = new Cuota(req.body);
    const cuotaGuardada = await nuevaCuota.save();
    res.status(201).json(cuotaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Controlador para obtener todas las cuotas
exports.obtenerCuotas = async (req, res) => {
  try {
    const cuotas = await Cuota.find();
    res.status(200).json(cuotas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para obtener una cuota por su ID
exports.obtenerCuotaPorId = async (req, res) => {
  try {
    // Buscamos la cuota por su ID
    const cuota = await Cuota.findById(req.params.id).exec();

    if (!cuota) {
      return res.status(404).json({ mensaje: 'Cuota no encontrada' });
    }

    // Buscamos el pago asociado a la cuota si existe
    const pago = await Pago.findOne({ Cuota_id: cuota._id }).exec();

    const respuesta = {
      cuota,
      pago: pago || null,  // Incluimos el pago si existe, de lo contrario null
    };

    res.status(200).json(respuesta);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para actualizar una cuota por su ID
exports.actualizarCuota = async (req, res) => {
  try {
    const cuotaActualizada = await Cuota.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cuotaActualizada) {
      return res.status(404).json({ mensaje: 'Cuota no encontrada' });
    }
    res.status(200).json(cuotaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para eliminar una cuota por su ID
exports.eliminarCuota = async (req, res) => {
  try {
    const cuotaEliminada = await Cuota.findByIdAndDelete(req.params.id);
    if (!cuotaEliminada) {
      return res.status(404).json({ mensaje: 'Cuota no encontrada' });
    }
    res.status(200).json({ mensaje: 'Cuota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
