import express from "express";
import Match from "../models/Match.js";
import Tournament from "../models/Tournament.js";
import Team from "../models/Team.js";

const router = express.Router();

// ============================
// Obtener todos los partidos
// ============================
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("tournament", "name logo")
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo");

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
    const { tournament, date, homeTeam, awayTeam, homeGoals, awayGoals, referee, jornada } =
      req.body;

    const existingTournament = await Tournament.findById(tournament);
    if (!existingTournament) {
      return res.status(400).json({ message: "Torneo no encontrado" });
    }

    const existingHome = await Team.findById(homeTeam);
    const existingAway = await Team.findById(awayTeam);
    if (!existingHome || !existingAway) {
      return res.status(400).json({ message: "Equipo no encontrado" });
    }

    const match = new Match({
      tournament,
      date,
      homeTeam,
      awayTeam,
      homeGoals: homeGoals || 0,
      awayGoals: awayGoals || 0,
      referee,
      jornada: jornada || 1,
    });

    const savedMatch = await match.save();
    const populated = await savedMatch.populate([
      { path: "tournament", select: "name logo" },
      { path: "homeTeam", select: "name logo" },
      { path: "awayTeam", select: "name logo" },
    ]);

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
    const { tournament, date, homeTeam, awayTeam, homeGoals, awayGoals, referee, jornada } =
      req.body;

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { tournament, date, homeTeam, awayTeam, homeGoals, awayGoals, referee, jornada },
      { new: true }
    )
      .populate("tournament", "name logo")
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo");

    if (!match) return res.status(404).json({ message: "Partido no encontrado" });

    res.json(match);
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
// Partidos de un torneo
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const matches = await Match.find({ tournament: req.params.tournamentId })
      .populate("tournament", "name logo")
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;


