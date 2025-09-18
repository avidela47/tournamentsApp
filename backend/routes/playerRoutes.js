import express from "express";
import Player from "../models/Player.js";
import Team from "../models/Team.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// ============================
// Listar jugadores (logueados)
// ============================
router.get("/", verifyToken, async (req, res) => {
  try {
    const players = await Player.find().populate({
      path: "team",
      select: "name logo tournament",
      populate: { path: "tournament", select: "name logo" },
    });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener jugadores", error: err.message });
  }
});

// ============================
// Obtener jugador por ID (logueados)
// ============================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate({
      path: "team",
      select: "name logo tournament",
      populate: { path: "tournament", select: "name logo" },
    });
    if (!player) return res.status(404).json({ message: "Jugador no encontrado" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener jugador", error: err.message });
  }
});

// ============================
// Crear jugador (solo admin)
// ============================
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, number, position, team } = req.body;

    const t = await Team.findById(team);
    if (!t) return res.status(400).json({ message: "Equipo inválido" });

    const player = await Player.create({ name, number, position, team });
    const populated = await player.populate({
      path: "team",
      select: "name logo tournament",
      populate: { path: "tournament", select: "name logo" },
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: "Error al crear jugador", error: err.message });
  }
});

// ============================
// Editar jugador (solo admin)
// ============================
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, number, position, team } = req.body;

    if (team) {
      const t = await Team.findById(team);
      if (!t) return res.status(400).json({ message: "Equipo inválido" });
    }

    const updated = await Player.findByIdAndUpdate(
      req.params.id,
      { name, number, position, team },
      { new: true, runValidators: true }
    ).populate({
      path: "team",
      select: "name logo tournament",
      populate: { path: "tournament", select: "name logo" },
    });

    if (!updated) return res.status(404).json({ message: "Jugador no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error al editar jugador", error: err.message });
  }
});

// ============================
// Eliminar jugador (solo admin)
// ============================
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Player.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Jugador no encontrado" });
    res.json({ message: "Jugador eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar jugador", error: err.message });
  }
});

export default router;





