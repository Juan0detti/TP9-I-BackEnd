import express from "express";
// Importa las funciones del controlador
import {
  createAvion,
  getAllAviones,
  deleteAvion,
} from "../controladores/controlador_avión.js";
// Importa el middleware de autenticación
import { verificarToken, soloAdmin } from "../middleware/autentificacion.js";

const router = express.Router();

// Rutas protegidas que requieren ser 'admin'
// ------------------------------------------

// POST /api/v1/avion: Registrar un nuevo avión
// Middleware: verificarToken -> soloAdmin -> createAvion
router.post("/", verificarToken, soloAdmin, createAvion);

// GET /api/v1/avion: Obtener todos los aviones
// Middleware: verificarToken -> soloAdmin -> getAllAviones
router.get("/", verificarToken, soloAdmin, getAllAviones);

// DELETE /api/v1/avion/:id: Eliminar un avión
// Middleware: verificarToken -> soloAdmin -> deleteAvion
router.delete("/:id", verificarToken, soloAdmin, deleteAvion);

export default router;
