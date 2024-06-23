const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Schema = mongoose.Schema;

const Credito = require("../model/Credito");
const Cuota = require("../model/Cuota");
const TipoInteres = require("../model/TipoInteres");
const Cliente = require('../model/Cliente');
const CuentaCorriente = require('../model/CuentaCorriente');
const Transaccion = require('../model/Transaccion');
const Producto = require('../model/Producto'); // Asegúrate de importar el modelo Producto

// Controlador para crear un nuevo crédito
exports.crearCredito = async (req, res) => {
  try {
    const {
      Cliente_id,
      FechaCredito,
      TipoCredito_id,
      TipoInteres_id,
      tasaInteres,
      monto,
      numeroCuotas,
      plazoGracia,
      productos
    } = req.body;

    // Asegurarnos de que los valores numéricos son de tipo número
    const tasaInteresNum = Number(tasaInteres);
    const montoNum = Number(monto);
    const numeroCuotasNum = Number(numeroCuotas);
    const plazoGraciaNum = Number(plazoGracia);

    // Obtener el cliente y sus créditos activos
    const cliente = await Cliente.findById(Cliente_id);
    const creditosActivos = await Credito.find({ Cliente_id, estado: true });

    // Sumar los montos de los créditos activos
    const totalCreditosActivos = creditosActivos.reduce((acc, credito) => acc + credito.monto, 0);

    // Verificar si el nuevo crédito excede el límite de crédito del cliente
    if (totalCreditosActivos + montoNum > cliente.limiteCredito) {
      return res.status(400).json({ mensaje: 'El monto del nuevo crédito excede el límite de crédito del cliente.' });
    }

    // Obtener tipo de interés para calcular TEM
    const tipoInteres = await TipoInteres.findById(TipoInteres_id);
    let TEM = 0;
    if (tipoInteres) {
      if (tipoInteres.nombre === "TNM") {
        TEM = Math.pow(1 + tasaInteresNum / 100 / 30, 30) - 1;
      } else if (tipoInteres.nombre === "TEM") {
        TEM = tasaInteresNum / 100;
      } else if (tipoInteres.nombre === "TNA") {
        const TEA = Math.pow(1 + tasaInteresNum / 100 / 360, 360) - 1;
        TEM = Math.pow(1 + TEA, 1 / 12) - 1;
      } else if (tipoInteres.nombre === "TEA") {
        TEM = Math.pow(1 + tasaInteresNum / 100, 1 / 12) - 1;
      }
    }

    // Calcular monto de cada cuota
    const cuotaFija = montoNum * (TEM / (1 - Math.pow(1 + TEM, -(plazoGraciaNum + numeroCuotasNum))));

    // Crear el nuevo crédito
    const nuevoCredito = new Credito({
      Cliente_id,
      estado: true, // Estado inicial del crédito
      FechaCredito: moment(FechaCredito).tz('America/Lima').toDate(), // Convertir la fecha al formato de Lima
      TipoCredito_id,
      TipoInteres_id,
      tasaInteres: parseFloat(tasaInteresNum.toFixed(2)),
      monto: parseFloat(montoNum.toFixed(2)),
      numeroCuotas: numeroCuotasNum,
      plazoGracia: plazoGraciaNum,
      productos: productos ? productos.map(producto => ({
        producto: producto.productoId,
        cantidad: producto.cantidad
      })) : [] // Solo agregar productos si están presentes
    });

    // Guardar el crédito en la base de datos
    const creditoGuardado = await nuevoCredito.save();

    // Crear las cuotas
    const cuotas = [];
    let saldo = montoNum;
    let mesPago = moment(FechaCredito).tz('America/Lima'); // Convertir la fecha de crédito al formato de Lima

    // Obtener cliente y día de pago mensual
    const diaPagoMensual = moment(cliente.fechaPagoMensual).date(); // Obtener el día del mes de pago en Lima

    // Crear cuotas de plazo de gracia
    for (let i = 1; i <= plazoGraciaNum; i++) {
      mesPago.add(1, 'months').date(diaPagoMensual);
      saldo = saldo * (1 + TEM); // Actualizar saldo restante del préstamo
      const nuevaCuota = new Cuota({
        numeroCuota: i,
        monto: 0, // Cuota de plazo de gracia con monto 0
        interes: 0,
        amortizacion: 0,
        estado: false,
        mes: mesPago.toDate(),
        diasMora: 0, // Asumiendo que empieza sin días de mora
        credito_id: creditoGuardado._id,
        saldo: parseFloat(saldo.toFixed(2))
      });

      const cuotaGuardada = await nuevaCuota.save();
      cuotas.push(cuotaGuardada._id);
    }

    // Crear cuotas regulares
    for (let i = 1; i <= numeroCuotasNum; i++) {
      mesPago.add(1, 'months').date(diaPagoMensual);

      // Calcular días de mora
      const hoy = moment().tz('America/Lima').toDate();
      let diasMora = 0;
      const fechaLimitePago = mesPago.toDate();
      if (hoy > fechaLimitePago) {
        const tiempoMora = hoy.getTime() - fechaLimitePago.getTime();
        diasMora = Math.ceil(tiempoMora / (1000 * 3600 * 24)); // Convertir milisegundos a días
      }

      const interes = saldo * TEM;
      const amortizacion = cuotaFija - interes;
      saldo = saldo - amortizacion; // Actualizar saldo restante del préstamo

      // Calcular monto de mora
      const montoMora = (cliente.tasaMoratoria / 100 * diasMora * amortizacion);

      const nuevaCuota = new Cuota({
        numeroCuota: plazoGraciaNum + i,
        monto: parseFloat(cuotaFija.toFixed(2)),
        interes: parseFloat(interes.toFixed(2)),
        amortizacion: parseFloat(amortizacion.toFixed(2)),
        estado: true,
        mes: mesPago.toDate(),
        diasMora: diasMora,
        montoMora: parseFloat(montoMora.toFixed(2)), // Agregar el monto de mora
        credito_id: creditoGuardado._id,
        saldo: parseFloat(saldo.toFixed(2))
      });

      const cuotaGuardada = await nuevaCuota.save();
      cuotas.push(cuotaGuardada._id);
    }

    // Actualizar el crédito con las referencias a las cuotas
    creditoGuardado.cuotas = cuotas;
    await creditoGuardado.save();

    // Buscar o crear la cuenta corriente
    let cuentaCorriente = await CuentaCorriente.findOne({ nombre: 'Cuenta Corriente General' });
    if (!cuentaCorriente) {
      cuentaCorriente = new CuentaCorriente({ nombre: 'Cuenta Corriente General', saldo: 0 });
    }
    cuentaCorriente.saldo -= parseFloat(montoNum.toFixed(2));
    await cuentaCorriente.save();

    // Crear una transacción en la cuenta corriente
    const nuevaTransaccion = new Transaccion({
      CuentaCorriente_id: cuentaCorriente._id,
      fecha: moment(FechaCredito).tz('America/Lima').toDate(),
      tipo: 'Salida',
      monto: parseFloat(montoNum.toFixed(2)),
      descripcion: `Crédito creado para el cliente con DNI: ${cliente.dni}`
    });
    const transaccionGuardada = await nuevaTransaccion.save();

    // Agregar la transacción al array de transacciones en la cuenta corriente
    cuentaCorriente.transacciones.push(transaccionGuardada._id);
    await cuentaCorriente.save();

    // Respuesta exitosa con el crédito guardado
    res.status(201).json(creditoGuardado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ mensaje: error.message });
  }
};


// Controlador para obtener todos los créditos
exports.obtenerCreditos = async (req, res) => {
  try {
    const creditos = await Credito.find()
      .populate("Cliente_id")
      .populate("TipoCredito_id")
      .populate("TipoInteres_id")
      .populate("cuotas");
    res.status(200).json(creditos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para obtener un crédito por su ID
exports.obtenerCreditoPorId = async (req, res) => {
  try {
    // Realizar el populate de todas las relaciones del crédito, incluyendo las cuotas y sus relaciones
    const credito = await Credito.findById(req.params.id)
      .populate("Cliente_id")
      .populate("TipoCredito_id")
      .populate("TipoInteres_id")
      .populate({
        path: "cuotas",
        populate: {
          path: "credito_id",
          model: "Credito",
        },
      });

    if (!credito) {
      return res.status(404).json({ mensaje: "Crédito no encontrado" });
    }
    console.log(credito);
    res.status(200).json(credito);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para actualizar un crédito por su ID
exports.actualizarCredito = async (req, res) => {
  try {
    const creditoActualizado = await Credito.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!creditoActualizado) {
      return res.status(404).json({ mensaje: "Crédito no encontrado" });
    }
    res.status(200).json(creditoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para eliminar un crédito por su ID
exports.eliminarCredito = async (req, res) => {
  try {
    const creditoEliminado = await Credito.findByIdAndDelete(req.params.id);
    if (!creditoEliminado) {
      return res.status(404).json({ mensaje: "Crédito no encontrado" });
    }
    res.status(200).json({ mensaje: "Crédito eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
