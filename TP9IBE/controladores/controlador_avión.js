import { Avion } from "../modelos/index.js";

// ===========================================
// 1. Crear/Registrar un nuevo Avión (POST /aviones)
// SOLO ADMIN
// ===========================================
export const createAvion = async (req, res) => {
  try {
    // Los campos que esperamos recibir
    const { modelo, capacidad_business, capacidad_primera, matricula } =
      req.body;

    // Validar campos requeridos
    if (
      !modelo ||
      capacidad_business === undefined ||
      capacidad_primera === undefined ||
      !matricula
    ) {
      return res.status(400).json({
        error:
          "Faltan campos requeridos: modelo, capacidad_business, capacidad_primera o matricula.",
      });
    }

    // Validar que no exista ya una matrícula igual
    const existente = await Avion.findOne({ where: { matricula } });
    if (existente) {
      return res.status(400).json({
        error: `Ya existe un avión con la matrícula '${matricula}'.`,
      });
    }

    // Crear nuevo avión
    const newAvion = await Avion.create({
      modelo,
      capacidad_business,
      capacidad_primera,
      matricula,
    });

    return res.status(201).json({
      message: "Avión registrado exitosamente.",
      avion: newAvion,
    });
  } catch (error) {
    console.error("Error al registrar el avión:", error);
    return res.status(500).json({
      error: "Error interno del servidor al registrar el avión.",
      details: error.message,
    });
  }
};

// ===========================================
// 2. Obtener todos los Aviones (GET /aviones)
// ===========================================
export const getAllAviones = async (req, res) => {
  try {
    const aviones = await Avion.findAll();
    return res.status(200).json(aviones);
  } catch (error) {
    console.error("Error al obtener la lista de aviones:", error);
    return res.status(500).json({
      error: "Error interno del servidor al obtener aviones.",
      details: error.message,
    });
  }
};

// ===========================================
// 3. Eliminar un Avión por ID (DELETE /aviones/:id)
// ===========================================
export const deleteAvion = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Avion.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ error: "Avión no encontrado." });
    }

    return res.status(200).json({
      message: `Avión con ID ${id} eliminado exitosamente.`,
    });
  } catch (error) {
    console.error(`Error al eliminar el avión con ID ${req.params.id}:`, error);
    return res.status(500).json({
      error: "Error interno del servidor al eliminar el avión.",
      details: error.message,
    });
  }
};
