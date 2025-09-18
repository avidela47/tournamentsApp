import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Importar rutas
import tournamentRoutes from "./routes/tournamentRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import standingsRoutes from "./routes/standingsRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import finalsRoutes from "./routes/finals.js";

dotenv.config();
const app = express();

// ============================
// Middlewares
// ============================
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// ============================
// Conexión a MongoDB
// ============================
mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión MongoDB:", err));

// ============================
// Rutas de la API
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/standings", standingsRoutes);
app.use("/api/finals", finalsRoutes);

// Ruta de prueba
app.get("/ping", (_req, res) => res.send("API funcionando 🚀"));

// ============================
// Levantar servidor
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
