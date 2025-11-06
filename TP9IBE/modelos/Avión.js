// models/Avion.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Avion = sequelize.define("Avion", {
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacidad_business: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  capacidad_primera: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Avion;
