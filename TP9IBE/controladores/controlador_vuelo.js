// controllers/vueloController.js
import { Vuelo, Pasaje, sequelize } from "../modelos/index.js";
import { createTicketsForFlight } from "../utils/ticketGenerator.js";

// POST /vuelos (Crea el Vuelo y sus Pasajes automáticamente)
export const createVuelo = async (req, res) => {
  try {
    // La autorización 'soloAdmin' debe ejecutarse antes de llegar aquí.
    const { avionID, ...vueloData } = req.body;
    console.log(req.body);

    // 1. Crear el Vuelo
    const newVuelo = await Vuelo.create({ ...vueloData, avionID });

    // 2. Crear los pasajes asociados, basándose en la capacidad del avión
    const idAvion = avionID || newVuelo.avionID;
    const totalTickets = await createTicketsForFlight(newVuelo.id, idAvion);

    return res.status(201).json({
      message: "Vuelo y pasajes registrados exitosamente.",
      vuelo: newVuelo,
      asientos_creados: totalTickets,
    });
  } catch (error) {
    console.error("Error al registrar el vuelo:", error);
    return res.status(500).json({
      error: "Error interno al registrar vuelo/asientos.",
      details: error.message,
    });
  }
};

// GET /vuelos (Opcional: Listar todos los vuelos. Podría ser admin o público)
export const getAllVuelos = async (req, res) => {
  try {
    const vuelos = await Vuelo.findAll({
      // 1. Seleccionar todos los atributos del Vuelo
      attributes: {
        include: [
          // 2. Añadir el nuevo atributo: el conteo de Pasajes
          [
            // COUNT(Pasajes.id) es la función de agregación
            sequelize.fn("COUNT", sequelize.col("Pasajes.id")),
            "numPasajesVendidos", // Alias del nuevo atributo
          ],
        ],
      },
      // 3. Incluir el modelo Pasaje para hacer la JOIN
      include: [
        {
          model: Pasaje,
          attributes: [], // No queremos los datos de los pasajes individuales, solo el conteo
        },
      ],
      // 4. Agrupar por el ID del Vuelo para que la función COUNT funcione correctamente
      group: ["Vuelo.id"],
      // Opcional: ordenar por ID de vuelo
      order: [["id", "ASC"]],
    });

    return res.status(200).json(vuelos);
  } catch (error) {
    console.error("Error al obtener vuelos con información de pasajes:", error);
    return res.status(500).json({ error: error.message });
  }
};

// PUT /vuelos/:id (Modificar Vuelo)
export const updateVuelo = async (req, res) => {
  try {
    const [updated] = await Vuelo.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedVuelo = await Vuelo.findByPk(req.params.id);
      return res
        .status(200)
        .json({ message: "Vuelo actualizado.", vuelo: updatedVuelo });
    }
    return res.status(404).json({ error: "Vuelo no encontrado." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const filtrarVuelos = async (req, res) => {
  try {
    const { origen, destino, fechaDesde, fechaHasta, precioMin, precioMax } =
      req.query;

    const filtros = {};

    if (origen) filtros.origen = { [Op.like]: `%${origen}%` };
    if (destino) filtros.destino = { [Op.like]: `%${destino}%` };
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
    res.status(500).json({ error: error.message });
  }
};

// DELETE /vuelos/:id (Eliminar Vuelo)
export const deleteVuelo = async (req, res) => {
  try {
    // Asumiendo eliminación en cascada de pasajes
    const result = await Vuelo.destroy({ where: { id: req.params.id } });

    if (result === 0)
      return res.status(404).json({ error: "Vuelo no encontrado." });
    return res
      .status(200)
      .json({ message: `Vuelo con ID ${req.params.id} eliminado.` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
