// routes/alertaRoutes.js
import express from "express";
import { verificarToken, soloAdmin } from "../middleware/autentificacion.js";
import {
  createAlerta,
  deleteAlerta,
  getAlertasByVuelo,
  getRecentAlerts,
} from "../controladores/controlador_alertas.js";

const router = express.Router();

// ===========================================
// RUTAS DE GESTIÓN (ADMINISTRADOR)
// Montadas sobre /api/v1/alertas/
// ===========================================

// POST /alertas/admin

router.post("/admin", verificarToken, soloAdmin, createAlerta);

// DELETE /alertas/admin/:id
router.delete("/admin/:id", verificarToken, soloAdmin, deleteAlerta);

// ===========================================
// RUTAS DE CONSULTA (USUARIO/CLIENTE)
// Montadas sobre /api/v1/alertas
// ===========================================

// GET /alertas/recientes (Puede ser pública o requerir token)
router.get("/recientes", getRecentAlerts);

// GET /alertas/vuelo/:vueloID (Consulta de alertas por vuelo ID)
router.get("/vuelo/:vueloID", getAlertasByVuelo);

// Si el cliente necesita ver SUS alertas específicas:
// router.get('/mis', verificarToken, getAlertasByUsuario);

export default router;

// Montaje en app.js: app.use('/api/v1/alertas', alertaRoutes);
