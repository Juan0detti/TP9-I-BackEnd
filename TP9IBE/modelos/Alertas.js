// models/Alerta.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Vuelo from "../modelos/Vuelos.js";

const Alerta = sequelize.define("Alerta", {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  vueloID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    refereces: {
      model: Vuelo,
      key: "Id",
    },
  },
});

export default Alerta;
