// models/index.js
import sequelize from "../config/db.js";
import Avion from "./Avión.js";
import Vuelo from "./Vuelos.js";
import Alerta from "./Alertas.js";
import Usuario from "./Usuarios.js";
import Pasaje from "./Pasajes.js";

// Usuario.hasMany(Pasaje) | Un usuario tiene muchos pasajes
Usuario.hasMany(Pasaje, { foreignKey: "usuarioID" });
Pasaje.belongsTo(Usuario, { foreignKey: "usuarioID" });

Vuelo.hasMany(Pasaje, {
  foreignKey: "VueloId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Pasaje.belongsTo(Vuelo, { foreignKey: "VueloId" });

Alerta.belongsTo(Vuelo, { foreignKey: "vueloID" });
Vuelo.hasMany(Alerta, {
  foreignKey: "vueloID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Avion.hasMany(Vuelo, {
  foreignKey: "AvionID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Vuelo.belongsTo(Avion, { foreignKey: "AvionID" });

export { sequelize, Avion, Vuelo, Usuario, Alerta, Pasaje };
