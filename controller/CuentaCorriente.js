// controllers/cuentaCorrienteController.js
const CuentaCorriente = require('../model/CuentaCorriente');
const Transaccion = require('../model/Transaccion');

const getCuentaCorrienteGeneral = async (req, res) => {
    try {
        const cuentaCorriente = await CuentaCorriente.findOne().populate('transacciones');
        
        if (!cuentaCorriente) {
            return res.status(404).json({ error: 'No se encontró ninguna cuenta corriente.' });
        }
        
        res.json(cuentaCorriente);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error del servidor.' });
    }
};

module.exports = {
    getCuentaCorrienteGeneral
};
