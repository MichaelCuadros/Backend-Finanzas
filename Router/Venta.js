const express = require('express');
const router = express.Router();
const ventaController = require('../controller/Venta');

// Ruta para crear una nueva venta
router.post('/ventas', ventaController.crearVenta);

// Ruta para obtener todas las ventas
router.get('/ventas', ventaController.obtenerVentas);

// Ruta para obtener una venta por su ID
router.get('/ventas/:id', ventaController.obtenerVentaPorId);

// Ruta para actualizar una venta por su ID
router.put('/ventas/:id', ventaController.actualizarVenta);

// Ruta para eliminar una venta por su ID
router.delete('/ventas/:id', ventaController.eliminarVenta);



module.exports = router;
