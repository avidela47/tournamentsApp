import express from "express";
import Match from "../models/Match.js";
import Team from "../models/Team.js";
import Tournament from "../models/Tournament.js";

const router = express.Router();

// ============================
// Obtener todos los partidos
// ============================
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo")
      .populate("tournamentId", "name logo");
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Crear un nuevo partido
// ============================
router.post("/", async (req, res) => {
  try {
    const { tournamentId, homeTeam, awayTeam, homeGoals, awayGoals, referee, round } = req.body;

    // Validar torneo
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(400).json({ message: "Torneo no encontrado" });

    // Validar equipos
    const local = await Team.findById(homeTeam);
    const visitante = await Team.findById(awayTeam);
    if (!local || !visitante)
      return res.status(400).json({ message: "Alguno de los equipos no existe" });

    const newMatch = new Match({
      tournamentId,
      homeTeam,
      awayTeam,
      homeGoals,
      awayGoals,
      referee,
      round,
    });

    const savedMatch = await newMatch.save();
    const populated = await savedMatch
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo")
      .populate("tournamentId", "name logo");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Actualizar un partido
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { tournamentId, homeTeam, awayTeam, homeGoals, awayGoals, referee, round } = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      { tournamentId, homeTeam, awayTeam, homeGoals, awayGoals, referee, round },
      { new: true }
    )
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo")
      .populate("tournamentId", "name logo");

    if (!updatedMatch) return res.status(404).json({ message: "Partido no encontrado" });

    res.json(updatedMatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Eliminar un partido
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
// Obtener partidos de un torneo específico
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const matches = await Match.find({ tournamentId: req.params.tournamentId })
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo")
      .populate("tournamentId", "name logo");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
