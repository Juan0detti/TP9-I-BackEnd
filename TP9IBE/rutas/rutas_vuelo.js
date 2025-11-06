// routes/vueloRoutes.js
import express from "express";
import { verificarToken, soloAdmin } from "../middleware/autentificacion.js";
import {
  createVuelo,
  updateVuelo,
  deleteVuelo,
  getAllVuelos,
  filtrarVuelos,
} from "../controladores/controlador_vuelo.js";

const router = express.Router();

// Rutas de ADMINISTRACIÓN (Protegidas por soloAdmin)
// Se montan sobre /api/v1/vuelos

// Middleware de autenticación y admin global para las rutas CRUD de Vuelos
router.use(verificarToken, soloAdmin);

// POST /vuelos - Crear Vuelo
router.post("/", createVuelo);

// GET /vuelos - Obtener todos los vuelos (Normalmente para Admin)
router.get("/", getAllVuelos);

// GET /vuelos/filtrar - Filtrar vuelos (Debe ir antes de la ruta dinámica /:id)
router.get("/filtrar", filtrarVuelos);

// PUT /vuelos/:id - Actualizar Vuelo
router.put("/:id", updateVuelo);

// DELETE /vuelos/:id - Eliminar Vuelo
router.delete("/:id", deleteVuelo);

export default router;
