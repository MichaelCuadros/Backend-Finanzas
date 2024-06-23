const express = require('express');
const router = express.Router();
const creditoController = require('../controller/Credito');

// Ruta para crear un nuevo crédito
router.post('/creditos', creditoController.crearCredito);

// Ruta para obtener todos los créditos
router.get('/creditos', creditoController.obtenerCreditos);

// Ruta para obtener un crédito por su ID
router.get('/creditos/:id', creditoController.obtenerCreditoPorId);

// Ruta para actualizar un crédito por su ID
router.put('/creditos/:id', creditoController.actualizarCredito);

// Ruta para eliminar un crédito por su ID
router.delete('/creditos/:id', creditoController.eliminarCredito);



module.exports = router;
