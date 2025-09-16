import express from "express";
import Stat from "../models/Stat.js";

const router = express.Router();

/**
 * POST /api/stats
 * Registrar un evento de jugador (gol, amarilla, roja)
 */
router.post("/", async (req, res) => {
  try {
    const { player, team, tournament, type } = req.body;

    if (!["goal", "yellow", "red"].includes(type)) {
      return res.status(400).json({ message: "Tipo inválido" });
    }

    // Buscar si ya existe un registro para ese jugador en ese torneo/equipo y tipo
    let stat = await Stat.findOne({ player, team, tournament, type });

    if (stat) {
      stat.count += 1;
      await stat.save();
    } else {
      stat = new Stat({ player, team, tournament, type, count: 1 });
      await stat.save();
    }

    res.status(201).json(stat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/stats/scorers/:tournamentId
 * Ranking de goleadores de un torneo
 */
router.get("/scorers/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const stats = await Stat.find({
      tournament: tournamentId,
      type: "goal",
    })
      .populate("player", "name photo")
      .populate("team", "name logo")
      .sort({ count: -1 });

    const scorers = stats.map((s) => ({
      playerId: s.player._id,
      name: s.player.name,
      photo: s.player.photo,
      teamName: s.team.name,
      teamLogo: s.team.logo,
      goals: s.count,
    }));

    res.json(scorers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/stats/cards/:tournamentId
 * Ranking de tarjetas amarillas y rojas
 */
router.get("/cards/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const stats = await Stat.find({
      tournament: tournamentId,
      type: { $in: ["yellow", "red"] },
    })
      .populate("player", "name photo")
      .populate("team", "name logo");

    const yellow = stats
      .filter((s) => s.type === "yellow")
      .map((s) => ({
        playerId: s.player._id,
        name: s.player.name,
        photo: s.player.photo,
        teamName: s.team.name,
        teamLogo: s.team.logo,
        count: s.count,
      }));

    const red = stats
      .filter((s) => s.type === "red")
      .map((s) => ({
        playerId: s.player._id,
        name: s.player.name,
        photo: s.player.photo,
        teamName: s.team.name,
        teamLogo: s.team.logo,
        count: s.count,
      }));

    res.json({ yellow, red });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear estadística (ej: tarjeta)
router.post("/", async (req, res) => {
  try {
    const { playerId, card } = req.body;
    const newStat = new Stat({ playerId, card });
    await newStat.save();
    res.json(newStat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Obtener todas las estadísticas
router.get("/", async (req, res) => {
  try {
    const stats = await Stat.find().populate("playerId");
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error });
  }
});

// ➤ Registrar una tarjeta
router.post("/", async (req, res) => {
  try {
    const { playerId, card } = req.body;

    if (!playerId || !card) {
      return res
        .status(400)
        .json({ message: "Faltan datos: playerId o tipo de tarjeta" });
    }

    const newStat = new Stat({
      playerId,
      card,
      date: new Date(), // se registra automáticamente
    });

    await newStat.save();
    res.json(newStat);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar tarjeta", error });
  }
});

// ➤ Obtener estadísticas de un jugador
router.get("/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const stats = await Stat.find({ playerId }).sort({ date: -1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tarjetas", error });
  }
});

export default router;
