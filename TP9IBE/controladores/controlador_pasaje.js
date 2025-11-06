import { Pasaje, Vuelo } from "../modelos/index.js";

// GET /pasajes/:vueloId (Consulta de disponibilidad)
export const getAvailablePasajes = async (req, res) => {
  try {
    const { vueloId } = req.params;

    const vuelo = await Vuelo.findByPk(vueloId);
    if (!vuelo) return res.status(404).json({ error: "Vuelo no encontrado." });

    // Consulta de pasajes disponibles:
    // 1. VueloId (Clave foránea correcta)
    // 2. UsuarioId: null (Pasaje no vendido)
    const pasajes = await Pasaje.findAll({
      where: { VueloId: vueloId, UsuarioId: null },
      attributes: ["id", "asiento", "tipo_asiento", "precio"],
    });

    // Agrupar por tipo_asiento
    const groupedPasajes = pasajes.reduce((acc, pasaje) => {
      const tipoAsiento = pasaje.tipo_asiento;

      if (!acc[tipoAsiento]) acc[tipoAsiento] = [];
      acc[tipoAsiento].push({
        id: pasaje.id,
        asiento: pasaje.asiento,
        precio: pasaje.precio,
      });
      return acc;
    }, {});

    return res.status(200).json({ vuelo, disponibilidad: groupedPasajes });
  } catch (error) {
    console.error("Error al obtener pasajes disponibles:", error);
    return res.status(500).json({
      error: "Error al obtener pasajes disponibles.",
      details: error.message,
    });
  }
};
// -----------------------------------------------------------------------

// POST /pasajes/comprar (Compra/reserva. Requiere 'verificarToken')
export const purchasePasaje = async (req, res) => {
  try {
    const { pasajeId } = req.body;
    // Se asume que req.usuario.id es inyectado por el middleware verificarToken
    const usuarioId = req.usuario.id;

    const pasaje = await Pasaje.findByPk(pasajeId);

    if (!pasaje)
      return res.status(404).json({ error: "Pasaje no encontrado." });

    //    La disponibilidad se verifica si UsuarioId NO es nulo
    if (pasaje.UsuarioId !== null)
      return res.status(409).json({
        error: `El asiento ${pasaje.asiento} ya ha sido vendido.`,
      });

    // Actualizar el pasaje asignando el UsuarioId
    await pasaje.update({
      UsuarioId: usuarioId,
    });

    return res.status(200).json({
      message: `Pasaje de clase ${pasaje.tipo_asiento} comprado exitosamente.`,
      pasaje: {
        id: pasaje.id,
        asiento: pasaje.asiento,
        vueloId: pasaje.VueloId,
        clase: pasaje.tipo_asiento,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al procesar la compra.", details: error.message });
  }
};

export const getPasajesByUsuario = async (req, res) => {
  try {
    // req.usuario.id es inyectado por el middleware 'verificarToken'
    const usuarioId = req.usuario.id;

    const misPasajes = await Pasaje.findAll({
      // ⬅️ Filtramos por el ID del usuario
      where: { UsuarioId: usuarioId },
      // ⬅️ Incluimos la información del Vuelo para mostrar origen/destino/fecha
      include: [
        {
          model: Vuelo,
          attributes: ["origen", "destino", "fecha_salida"],
        },
      ],
      // Ordenar para que los más recientes salgan primero
      order: [["createdAt", "DESC"]],
    });

    if (!misPasajes || misPasajes.length === 0) {
      return res.status(200).json([]); // Devuelve array vacío si no hay pasajes
    }

    // Mapeamos los resultados para limpiar la estructura antes de enviarla al cliente
    const resultadosLimpios = misPasajes.map((pasaje) => ({
      id: pasaje.id,
      asiento: pasaje.asiento,
      tipo_asiento: pasaje.tipo_asiento,
      precio_pagado: pasaje.precio, // El precio del pasaje en la tabla

      // Datos del vuelo (accedidos a través del alias 'Vuelo')
      origen: pasaje.Vuelo.origen,
      destino: pasaje.Vuelo.destino,
      fecha_salida: pasaje.Vuelo.fecha_salida,
    }));

    return res.status(200).json(resultadosLimpios);
  } catch (error) {
    console.error("Error al obtener pasajes del usuario:", error);
    return res.status(500).json({
      error: "Error al obtener mis pasajes.",
      details: error.message,
    });
  }
};
