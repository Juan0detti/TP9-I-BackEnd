import express from "express";
import { verificarToken, soloAdmin } from "../middleware/autentificacion.js";
import { actualizarUsuario } from "../controladores/controlador_usuario.js";

const router = express.Router();

router.put("/:id", verificarToken, actualizarUsuario);

export default router;
