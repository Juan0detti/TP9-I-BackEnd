// routes/pasajeRoutes.js
import express from "express";
import { verificarToken } from "../middleware/autentificacion.js";
import {
  getAvailablePasajes,
  purchasePasaje,
  getPasajesByUsuario, // Función para Mis Pasajes
} from "../controladores/controlador_pasaje.js";

const router = express.Router();

// 1. RUTA ESPECÍFICA (DEBE IR PRIMERO)
// GET /api/v1/pasajes/mis
// Usaremos esta ruta para cargar los pasajes del usuario autenticado (ID del token).
router.get("/mis", verificarToken, getPasajesByUsuario);

// 2. RUTA DINÁMICA DE PASAJES DE OTROS USUARIOS (OPCIONAL, si necesitas ver /mis/123)
// Si el frontend *insiste* en enviar el ID:
router.get("/mis/:userId", verificarToken, getPasajesByUsuario);
// Nota: Deberás ajustar 'getPasajesByUsuario' para leer req.params.userId si se envía.

// 3. Compra de Pasajes (Requiere autenticación)
router.post("/comprar", verificarToken, purchasePasaje);

// 4. RUTA DINÁMICA (DEBE IR AL FINAL)
// GET /api/v1/pasajes/:vueloId (Consulta de Pasajes Disponibles)
router.get("/:vueloId", getAvailablePasajes);

export default router;
// Montaje en app.js: app.use('/api/v1/pasajes', pasajeRoutes);
