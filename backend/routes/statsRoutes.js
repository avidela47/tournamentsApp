import express from "express";
import Stats from "../models/Stats.js";
import Player from "../models/Player.js";
import Tournament from "../models/Tournament.js";

const router = express.Router();

// GET goleadores de un torneo
router.get("/topscorers/:tournamentId", async (req, res) => {
  try {
    const stats = await Stats.find({ tournament: req.params.tournamentId })
      .populate("player")
      .sort({ goals: -1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener goleadores", err });
  }
});

// POST agregar evento (gol o tarjeta)
router.post("/", async (req, res) => {
  try {
    const { playerId, tournamentId, type } = req.body;

    let stat = await Stats.findOne({ player: playerId, tournament: tournamentId });
    if (!stat) {
      stat = new Stats({ player: playerId, tournament: tournamentId });
    }

    if (type === "goal") stat.goals++;
    if (type === "yellow") stat.yellowCards++;
    if (type === "red") stat.redCards++;

    await stat.save();
    res.json(stat);
  } catch (err) {
    res.status(500).json({ message: "Error al registrar evento", err });
  }
});

// GET ranking de tarjetas amarillas de un torneo
router.get("/topcards/yellow/:tournamentId", async (req, res) => {
  try {
    const stats = await Stats.find({ tournament: req.params.tournamentId })
      .populate("player")
      .sort({ yellowCards: -1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener amarillas", err });
  }
});

// GET ranking de tarjetas rojas de un torneo
router.get("/topcards/red/:tournamentId", async (req, res) => {
  try {
    const stats = await Stats.find({ tournament: req.params.tournamentId })
      .populate("player")
      .sort({ redCards: -1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener rojas", err });
  }
});


export default router;
