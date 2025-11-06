import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Asumiendo que usas bcryptjs para hashear y comparar
import { Usuario } from "../modelos/index.js";

// ===========================================
// 1. Registro de Usuario (POST /auth/register)
// ===========================================
export const register = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol = "cliente" } = req.body;

    // 1. Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "El email ya está registrado." });
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10); // 10 es el costo del salt

    // 3. Crear el nuevo usuario
    const newUser = await Usuario.create({
      nombre,
      email,
      contraseña: hashedPassword,
      rol, // Puede ser 'usuario' por defecto, o tomado del body si se permite
    });

    // 4. Excluir la contraseña hasheada de la respuesta
    const userResponse = newUser.toJSON();
    delete userResponse.contraseña;

    return res.status(201).json({
      message: "Registro exitoso.",
      usuario: userResponse,
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({
      error: "Error interno del servidor durante el registro.",
      details: error.message,
    });
  }
};

// ===========================================
// 2. Inicio de Sesión (Login) (POST /auth/login)
// ===========================================
export const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // 1. Buscar el usuario por email
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // 2. Comparar la contraseña proporcionada con la hasheada
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // 3. Generar el Token JWT
    const token = jwt.sign(
      { id: user.id, rol: user.rol }, // Payload del token
      process.env.JWT_SECRET, // La misma clave secreta que usas en el middleware
      { expiresIn: "1d" } // Expira en 1 día
    );

    // 4. Respuesta exitosa
    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token: token,
      rol: user.rol,
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return res.status(500).json({
      error: "Error interno del servidor durante el inicio de sesión.",
      details: error.message,
    });
  }
};
