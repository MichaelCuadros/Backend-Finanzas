const express = require('express');
const router = express.Router();
const clienteController = require('../controller/Cliente');

// Ruta para crear un nuevo cliente
router.post('/clientes', clienteController.crearCliente);

// Ruta para obtener todos los clientes
router.get('/clientes', clienteController.obtenerClientes);

// Ruta para obtener un cliente por su ID
router.get('/clientes/:id', clienteController.obtenerClientePorId);

// Ruta para actualizar un cliente por su ID
router.put('/clientes/:id', clienteController.actualizarCliente);

// Ruta para eliminar un cliente por su ID
router.delete('/clientes/:id', clienteController.eliminarCliente);

module.exports = router;
