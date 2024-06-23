// routes/cuentaCorrienteRoutes.js
const express = require('express');
const router = express.Router();
const cuentaCorrienteController = require('../controller/CuentaCorriente');

router.get('/cuenta-corriente/general', cuentaCorrienteController.getCuentaCorrienteGeneral);

module.exports = router;
