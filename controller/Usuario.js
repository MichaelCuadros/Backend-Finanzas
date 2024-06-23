const Usuario = require('../model/Usuario');

// Controlador para el login
exports.loginUsuario = async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ correo:email, contrasena:password });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }
    res.status(200).json({usuario,"login":true});
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPass } = req.body;

    // Verificar si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ correo: email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizar la contraseña del usuario
    usuario.contrasena = newPass;
    await usuario.save();

    res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: error.message });
  }
};
// Controlador para la creación de un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Controlador para obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para obtener un usuario por su ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para actualizar un usuario por su ID
exports.actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Controlador para eliminar un usuario por su ID
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
