// controllers/alertaController.js

import { Alerta, Vuelo } from "../modelos/index.js";

// ===============================================
// FUNCIONES DE GESTIÓN (ADMINISTRADOR)
// ===============================================

// POST /alertas (Crear una nueva alerta)
// REQUIERE soloAdmin
export const createAlerta = async (req, res) => {
  try {
    const { tipo, mensaje, fecha, vueloID } = req.body;

    // Opcional: Verificar que el Vuelo exista
    const vuelo = await Vuelo.findByPk(vueloID);
    if (!vuelo) {
      return res
        .status(404)
        .json({ error: "Vuelo no encontrado para esta alerta." });
    }

    const newAlerta = await Alerta.create({ tipo, mensaje, fecha, vueloID });
    return res.status(201).json({
      message: "Alerta creada exitosamente.",
      alerta: newAlerta,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al crear la alerta.", details: error.message });
  }
};

// DELETE /alertas/:id (Eliminar una alerta)
// REQUIERE soloAdmin
export const deleteAlerta = async (req, res) => {
  try {
    const result = await Alerta.destroy({ where: { id: req.params.id } });

    if (result === 0)
      return res.status(404).json({ error: "Alerta no encontrada." });
    return res
      .status(200)
      .json({ message: `Alerta con ID ${req.params.id} eliminada.` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ===============================================
// FUNCIONES DE CONSULTA (CLIENTE/USUARIO)
// ===============================================

// GET /alertas/vuelo/:vueloID (Obtener alertas por Vuelo ID)
// REQUIERE verificarToken (para clientes que tengan pasajes en ese vuelo) o ser público si la alerta es general
export const getAlertasByVuelo = async (req, res) => {
  try {
    const { vueloID } = req.params;

    // Se pueden incluir condiciones para filtrar por fecha (solo futuras/recientes)
    const alertas = await Alerta.findAll({
      where: { vueloID: vueloID },
      order: [["fecha", "DESC"]],
    });

    if (alertas.length === 0) {
      return res.status(200).json({
        message: "No hay alertas activas para este vuelo.",
        alertas: [],
      });
    }

    return res.status(200).json(alertas);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al obtener las alertas.", details: error.message });
  }
};

// GET /alertas/recientes (Obtener las alertas más recientes, ej. las de hoy)
// Podría ser una ruta general o para el usuario autenticado
export const getRecentAlerts = async (req, res) => {
  try {
    // En un caso real, esto filtraría por vuelos del usuario.
    const alertas = await Alerta.findAll({
      // Ejemplo de filtro (simplificado: solo ordenar)
      order: [["fecha", "DESC"]],
      limit: 10,
    });

    return res.status(200).json(alertas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
