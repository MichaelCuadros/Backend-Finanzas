const express = require('express');
const router = express.Router();
const productoController = require('../controller/Producto');

// Ruta para crear un nuevo producto
router.post('/productos', productoController.crearProducto);

// Ruta para obtener todos los productos
router.get('/productos', productoController.obtenerProductos);

// Ruta para obtener un producto por su ID
router.get('/productos/:id', productoController.obtenerProductoPorId);

// Ruta para actualizar un producto por su ID
router.put('/productos/:id', productoController.actualizarProducto);

// Ruta para eliminar un producto por su ID
router.delete('/productos/:id', productoController.eliminarProducto);

module.exports = router;
