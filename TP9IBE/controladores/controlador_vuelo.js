// controllers/vueloController.js
import { Vuelo, Pasaje, sequelize } from "../modelos/index.js";
import { createTicketsForFlight } from "../utils/ticketGenerator.js";
import { Op } from "sequelize";

// ✅ POST /vuelos (Crea el Vuelo y sus Pasajes automáticamente)
export const createVuelo = async (req, res) => {
  try {
    const { avionID, estado = "Programado", ...vueloData } = req.body;

    // Crear el vuelo
    const newVuelo = await Vuelo.create({ ...vueloData, avionID, estado });

    // Crear los pasajes asociados según capacidad del avión
    const idAvion = avionID || newVuelo.avionID;
    const totalTickets = await createTicketsForFlight(newVuelo.id, idAvion);

    return res.status(201).json({
      message: "Vuelo y pasajes registrados exitosamente.",
      vuelo: newVuelo,
      asientos_creados: totalTickets,
    });
  } catch (error) {
    console.error("❌ Error al registrar el vuelo:", error);
    return res.status(500).json({
      error: "Error interno al registrar vuelo/asientos.",
      details: error.message,
    });
  }
};

// ✅ GET /vuelos — Listar todos los vuelos con info de pasajes
export const getAllVuelos = async (req, res) => {
  try {
    const vuelos = await Vuelo.findAll({
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("Pasajes.id")),
            "numPasajesVendidos",
          ],
        ],
      },
      include: [
        {
          model: Pasaje,
          attributes: [],
        },
      ],
      group: ["Vuelo.id"],
      order: [["id", "ASC"]],
    });

    return res.status(200).json(vuelos);
  } catch (error) {
    console.error("❌ Error al obtener vuelos:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ PUT /vuelos/:id — Modificar vuelo
export const updateVuelo = async (req, res) => {
  try {
    const [updated] = await Vuelo.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated)
      return res.status(404).json({ error: "Vuelo no encontrado." });

    const updatedVuelo = await Vuelo.findByPk(req.params.id);
    return res
      .status(200)
      .json({ message: "Vuelo actualizado.", vuelo: updatedVuelo });
  } catch (error) {
    console.error("❌ Error al actualizar vuelo:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ GET /vuelos/filtrar — Filtra vuelos según query params
export const filtrarVuelos = async (req, res) => {
  try {
    const {
      origen,
      destino,
      fechaDesde,
      fechaHasta,
      precioMin,
      precioMax,
      estado,
    } = req.query;

    const filtros = {};

    if (origen) filtros.origen = { [Op.like]: `%${origen}%` };
    if (destino) filtros.destino = { [Op.like]: `%${destino}%` };
    if (estado) filtros.estado = estado;

    if (fechaDesde || fechaHasta) {
      filtros.fecha_salida = {};
      if (fechaDesde) filtros.fecha_salida[Op.gte] = fechaDesde;
      if (fechaHasta) filtros.fecha_salida[Op.lte] = fechaHasta;
    }

    if (precioMin || precioMax) {
      filtros.precio = {};
      if (precioMin) filtros.precio[Op.gte] = precioMin;
      if (precioMax) filtros.precio[Op.lte] = precioMax;
    }

    const vuelos = await Vuelo.findAll({ where: filtros });
    res.status(200).json(vuelos);
  } catch (error) {
    console.error("❌ Error al filtrar vuelos:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE /vuelos/:id — Eliminar vuelo
export const deleteVuelo = async (req, res) => {
  try {
    const result = await Vuelo.destroy({ where: { id: req.params.id } });

    if (result === 0)
      return res.status(404).json({ error: "Vuelo no encontrado." });

    return res
      .status(200)
      .json({ message: `Vuelo con ID ${req.params.id} eliminado.` });
  } catch (error) {
    console.error("❌ Error al eliminar vuelo:", error);
    return res.status(500).json({ error: error.message });
  }
};
