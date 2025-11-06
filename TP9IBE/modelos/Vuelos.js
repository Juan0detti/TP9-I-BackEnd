// models/Vuelo.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Avion from "../modelos/Avión.js";

const Vuelo = sequelize.define("Vuelo", {
  origen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_llegada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  avionID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Avion,
      key: "id",
    },
  },
  estado: {
    type: DataTypes.ENUM(
      "Programado",
      "En curso",
      "Atrasado",
      "Cancelado",
      "Completado"
    ),
    allowNull: false,
    defaultValue: "Programado",
  },
});

export default Vuelo;
