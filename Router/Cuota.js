const express = require('express');
const router = express.Router();
const cuotaController = require('../controller/Cuota');

// Ruta para crear una nueva cuota
router.post('/cuotas', cuotaController.crearCuota);

// Ruta para obtener todas las cuotas
router.get('/cuotas', cuotaController.obtenerCuotas);

// Ruta para obtener una cuota por su ID
router.get('/cuotas/:id', cuotaController.obtenerCuotaPorId);

// Ruta para actualizar una cuota por su ID
router.put('/cuotas/:id', cuotaController.actualizarCuota);

// Ruta para eliminar una cuota por su ID
router.delete('/cuotas/:id', cuotaController.eliminarCuota);

module.exports = router;
