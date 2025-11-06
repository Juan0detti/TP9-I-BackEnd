import express from "express";
import "dotenv/config"; // Importante para cargar variables como JWT_SECRET

// --- Importaciones del Sistema de Aerolínea ---
import AuthRoutes from "./rutas/rutas_auten.js";
import VueloRoutes from "./rutas/rutas_vuelo.js";
import PasajeRoutes from "./rutas/rutas_pasajes.js";
import AlertasRoutes from "./rutas/rutas_alertas.js";
import AvionRoutes from "./rutas/rutas_avion.js";

import { sequelize } from "./modelos/index.js"; // Necesario para la DB
import cors from "cors"; // Necesario para la comunicación con el frontend

const app = express();

// --- Middlewares ---
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// --- Montaje de Rutas del Sistema de Vuelos ---

// 1. Rutas de Autenticación (Registro, Login)
app.use("/api/v1/auth", AuthRoutes);

// 2. Rutas de Vuelos (CRUD Admin)
// Nota: Puedes montarlas bajo /api/v1/admin/vuelos o directamente bajo /api/v1/vuelos
app.use("/api/v1/vuelos", VueloRoutes);

// 3. Rutas de Pasajes (Consulta y Compra de asientos)
app.use("/api/v1/pasajes", PasajeRoutes);

// 4. Rutas de Alertas (Consulta y Gestión)
app.use("/api/v1/alertas", AlertasRoutes);

app.use("/api/v1/avion", AvionRoutes);

// Ruta Raíz
app.get("/", (req, res) => {
  res.send("✈️ Bienvenido a la API de Servicios de Vuelos");
});

const PORT = process.env.PORT || 3000;

// Sincroniza DB y luego levanta el servidor
const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log("🔗 Conexión a la base de datos exitosa.");

    // Sincroniza modelos con la DB
    await sequelize.sync({ alter: true });
    console.log("🔄 Modelos sincronizados con la base de datos.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor de Vuelos iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
};

iniciarServidor();
