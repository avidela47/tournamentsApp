import express from "express";
import Match from "../models/Match.js";
import Team from "../models/Team.js";

const router = express.Router();

// GET all matches
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("homeTeam")
      .populate("awayTeam")
      .populate("tournament");
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener partidos", err });
  }
});

// POST add match
router.post("/", async (req, res) => {
  try {
    const { homeTeam, awayTeam, date, score, tournament } = req.body;

    const home = await Team.findById(homeTeam);
    const away = await Team.findById(awayTeam);
    if (!home || !away) return res.status(400).json({ message: "Equipos inválidos" });

    const newMatch = new Match({ homeTeam, awayTeam, date, score, tournament });
    await newMatch.save();
    res.json(newMatch);
  } catch (err) {
    res.status(500).json({ message: "Error al crear partido", err });
  }
});

// DELETE match
router.delete("/:id", async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: "Partido eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar partido", err });
  }
});

export default router;
