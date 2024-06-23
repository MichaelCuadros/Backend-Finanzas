const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    usuario: { type: String, required: true },
    contrasena: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', UsuarioSchema,'usuarios');
