import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Vuelo from "./Vuelos.js";
import Usuario from "./Usuarios.js";

const Pasaje = sequelize.define("Pasaje", {
  tipo_asiento: {
    type: DataTypes.ENUM("business", "primera"),
    allowNull: false,
  },
  asiento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  VueloId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vuelo,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  UsuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true, // al crear pasajes aún no tienen comprador
    references: {
      model: Usuario,
      key: "id",
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  },
});

export default Pasaje;
