import { Usuario } from "../modelos/index.js";

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, contraseña } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (contraseña) usuario.contraseña = await bcrypt.hash(contraseña, 10);

    await usuario.save();
    res.json({ message: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
