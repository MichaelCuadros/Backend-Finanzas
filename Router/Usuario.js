const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/Usuario');

// Ruta para crear un nuevo usuario
router.post('/usuarios', usuarioController.crearUsuario);

// Ruta para obtener todos los usuarios
router.get('/usuarios', usuarioController.obtenerUsuarios);

// Ruta para obtener un usuario por su ID
router.get('/usuarios/:id', usuarioController.obtenerUsuarioPorId);

// Ruta para actualizar un usuario por su ID
router.put('/usuarios/:id', usuarioController.actualizarUsuario);

// Ruta para eliminar un usuario por su ID
router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

router.post('/usuarios/login', usuarioController.loginUsuario);

// Ruta para el cambio de contraseña
router.post('/usuarios/reset-password', usuarioController.resetPassword);

module.exports = router;
