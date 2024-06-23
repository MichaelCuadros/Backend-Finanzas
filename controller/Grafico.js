const Cliente = require('../model/Cliente');
const Venta = require('../model/Venta');
const Credito = require('../model/Credito');

// Controller to get the top clients by credits
exports.getTopClientes = async (req, res) => {
  try {
    const topClientes = await Cliente.aggregate([
      {
        $lookup: {
          from: 'creditos', 
          localField: '_id', 
          foreignField: 'Cliente_id', 
          as: 'creditos' 
        }
      },
      {
        $project: {
          nombres: 1,
          apellidos: 1,
          totalCreditos: { $size: '$creditos' } 
        }
      },
      { $sort: { totalCreditos: -1 } }, 
      { $limit: 5 }
    ]);

    res.json(topClientes);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controller to get sales by client
exports.getVentasPorCliente = async (req, res) => {
  try {
    const ventas = await Venta.aggregate([
      { $group: { _id: "$Cliente_id", totalVentas: { $sum: "$montoTotal" } } },
      { $lookup: { from: "clientes", localField: "_id", foreignField: "_id", as: "cliente" } },
      { $unwind: "$cliente" }
    ]);

    const ventasPorCliente = ventas.map(venta => ({
      cliente: venta.cliente.nombres + ' ' + venta.cliente.apellidos,
      totalVentas: venta.totalVentas
    }));

    res.json(ventasPorCliente);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controller to get credits by client
exports.getCreditosPorCliente = async (req, res) => {
  try {
    const creditos = await Credito.aggregate([
      { $group: { _id: "$Cliente_id", totalCreditos: { $sum: "$monto" } } },
      { $lookup: { from: "clientes", localField: "_id", foreignField: "_id", as: "cliente" } },
      { $unwind: "$cliente" }
    ]);

    const creditosPorCliente = creditos.map(credito => ({
      cliente: credito.cliente.nombres + ' ' + credito.cliente.apellidos,
      totalCreditos: credito.totalCreditos
    }));

    res.json(creditosPorCliente);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
