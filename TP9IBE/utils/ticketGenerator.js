// utils/ticketGenerator.js
import { Pasaje, Avion } from "../modelos/index.js";

export async function createTicketsForFlight(VueloId, avionId) {
  const avion = await Avion.findByPk(avionId);
  if (!avion) throw new Error(`Avión con ID ${avionId} no encontrado.`);
  console.log(VueloId);

  const ticketsToCreate = [];
  const basePrice = 100;
  let seatNumber = 1;

  for (let i = 0; i < avion.capacidad_primera; i++) {
    ticketsToCreate.push({
      VueloId,
      asiento: `${seatNumber}A`,
      tipo_asiento: "primera",
      precio: basePrice * 3,
    });
    seatNumber++;
  }

  for (let i = 0; i < avion.capacidad_business; i++) {
    ticketsToCreate.push({
      VueloId,
      asiento: `${seatNumber}B`,
      tipo_asiento: "business",
      precio: basePrice * 2,
    });
    seatNumber++;
  }

  await Pasaje.bulkCreate(ticketsToCreate);
  return ticketsToCreate.length;
}
