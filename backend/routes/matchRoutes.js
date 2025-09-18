import express from "express";
import Match from "../models/Match.js";
import Tournament from "../models/Tournament.js";
import Team from "../models/Team.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// ============================
// Listar partidos (logueados)
// ============================
router.get("/", verifyToken, async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("tournament", "name logo")
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo");
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener partidos", error: err.message });
  }
});

// ============================
// Obtener partido por ID (logueados)
// ============================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("tournament", "name logo")
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo");

    if (!match) return res.status(404).json({ message: "Partido no encontrado" });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener partido", error: err.message });
  }
});

// ============================
// Crear partido (solo admin)
// ============================
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { tournament, date, homeTeam, awayTeam, homeGoals = 0, awayGoals = 0 } = req.body;

    const t = await Tournament.findById(tournament);
    if (!t) return res.status(400).json({ message: "Torneo inválido" });

    const h = await Team.findById(homeTeam);
    const a = await Team.findById(awayTeam);
    if (!h || !a) return res.status(400).json({ message: "Equipos inválidos" });

    const match = await Match.create({
      tournament,
      date,
      homeTeam,
      awayTeam,
      homeGoals,
      awayGoals,
    });

    const populated = await match.populate([
      { path: "tournament", select: "name logo" },
      { path: "homeTeam", select: "name logo" },
      { path: "awayTeam", select: "name logo" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: "Error al crear partido", error: err.message });
  }
});

// ============================
// Actualizar partido (solo admin)
// ============================
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { tournament, date, homeTeam, awayTeam, homeGoals, awayGoals } = req.body;

    if (tournament) {
      const t = await Tournament.findById(tournament);
      if (!t) return res.status(400).json({ message: "Torneo inválido" });
    }
    if (homeTeam) {
      const h = await Team.findById(homeTeam);
      if (!h) return res.status(400).json({ message: "Equipo local inválido" });
    }
    if (awayTeam) {
      const a = await Team.findById(awayTeam);
      if (!a) return res.status(400).json({ message: "Equipo visitante inválido" });
    }

    const updated = await Match.findByIdAndUpdate(
      req.params.id,
      { tournament, date, homeTeam, awayTeam, homeGoals, awayGoals },
      { new: true, runValidators: true }
    ).populate([
      { path: "tournament", select: "name logo" },
      { path: "homeTeam", select: "name logo" },
      { path: "awayTeam", select: "name logo" },
    ]);

    if (!updated) return res.status(404).json({ message: "Partido no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error al actualizar partido", error: err.message });
  }
});

// ============================
// Eliminar partido (solo admin)
// ============================
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Match.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Partido no encontrado" });
    res.json({ message: "Partido eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar partido", error: err.message });
  }
});

export default router;



