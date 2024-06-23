const express = require('express');
const router = express.Router();
const graficoController = require('../controller/Grafico');

// Ruta para obtener los clientes con más créditos
router.get('/grafico/clientes/top', graficoController.getTopClientes);

// Ruta para obtener las ventas por cliente
router.get('/grafico/ventas/por-cliente', graficoController.getVentasPorCliente);

// Ruta para obtener los créditos por cliente
router.get('/grafico/creditos/por-cliente', graficoController.getCreditosPorCliente);

module.exports = router;
