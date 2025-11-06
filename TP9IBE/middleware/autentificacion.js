import jwt from "jsonwebtoken";
import { Usuario } from "../modelos/index.js";

export async function verificarToken(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ error: "Token no proporcionado" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario)
      return res.status(401).json({ error: "Usuario no encontrado" });

    req.usuario = usuario; // Guardamos el usuario autenticado
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function soloAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso denegado: solo administradores" });
  }
  next();
}
