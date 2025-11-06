import express from "express";
import { register, login } from "../controladores/controlador_auten.js";

const router = express.Router();

// POST /api/v1/auth/register: Registrar un nuevo usuario
router.post("/register", register);

// POST /api/v1/auth/login: Iniciar sesión y obtener el token
router.post("/login", login);

export default router;
