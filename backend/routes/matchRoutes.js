import express from "express";
import Match from "../models/Match.js";
import Team from "../models/Team.js";
import Tournament from "../models/Tournament.js";

const router = express.Router();

// helper para populate consistente
const matchPopulate = [
  { path: "tournamentId", select: "name logo" },
  { path: "homeTeam", select: "name logo" },
  { path: "awayTeam", select: "name logo" },
];

// ============================
// Obtener todos los partidos (con torneo y equipos)
// ============================
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find().populate(matchPopulate).sort({ round: 1, date: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Crear partido
// ============================
router.post("/", async (req, res) => {
  try {
    const { tournamentId, round, homeTeam, awayTeam, homeGoals, awayGoals, referee, date } =
      req.body;

    // validaciones básicas
    if (!tournamentId || !round || !homeTeam || !awayTeam) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(400).json({ message: "Torneo no encontrado" });

    const home = await Team.findById(homeTeam);
    const away = await Team.findById(awayTeam);
    if (!home || !away) return res.status(400).json({ message: "Equipo no encontrado" });

    const match = new Match({
      tournamentId,
      round,
      homeTeam,
      awayTeam,
      homeGoals,
      awayGoals,
      referee,
      date,
    });

    const saved = await match.save();
    const populated = await saved.populate(matchPopulate);
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Actualizar partido
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { tournamentId, round, homeTeam, awayTeam, homeGoals, awayGoals, referee, date } =
      req.body;

    const updated = await Match.findByIdAndUpdate(
      req.params.id,
      { tournamentId, round, homeTeam, awayTeam, homeGoals, awayGoals, referee, date },
      { new: true }
    ).populate(matchPopulate);

    if (!updated) return res.status(404).json({ message: "Partido no encontrado" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Eliminar partido
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Match.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Partido no encontrado" });
    res.json({ message: "Partido eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Obtener partidos por torneo
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const matches = await Match.find({ tournamentId: req.params.tournamentId })
      .populate(matchPopulate)
      .sort({ round: 1, date: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

