const express = require('express');
const router = express.Router();
const pagoController = require('../controller/Pago');

// Ruta para crear un nuevo pago
router.post('/pagos', pagoController.crearPago);

// Ruta para obtener todos los pagos
router.get('/pagos', pagoController.obtenerPagos);

// Ruta para obtener un pago por su ID
router.get('/pagos/:id', pagoController.obtenerPagoPorId);

// Ruta para actualizar un pago por su ID
router.put('/pagos/:id', pagoController.actualizarPago);

// Ruta para eliminar un pago por su ID
router.delete('/pagos/:id', pagoController.eliminarPago);

module.exports = router;
