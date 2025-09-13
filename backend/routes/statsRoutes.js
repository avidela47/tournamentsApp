import express from "express";
import Stat from "../models/Stat.js";
import Player from "../models/Player.js";

const router = express.Router();

// 👉 Cargar estadísticas de un jugador
router.post("/:tournamentId", async (req, res) => {
  try {
    const { playerId, goals, yellowCards, redCards, round } = req.body;

    // Si ya existe registro, actualiza
    let stat = await Stat.findOne({ tournamentId: req.params.tournamentId, playerId });
    if (stat) {
      stat.goals += Number(goals) || 0;
      stat.yellowCards += Number(yellowCards) || 0;
      stat.redCards += Number(redCards) || 0;
      if (round) stat.round = round;
      await stat.save();
    } else {
      stat = new Stat({
        tournamentId: req.params.tournamentId,
        playerId,
        goals,
        yellowCards,
        redCards,
        round,
      });
      await stat.save();
    }

    res.json(stat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👉 Obtener estadísticas de un torneo
router.get("/:tournamentId", async (req, res) => {
  try {
    const stats = await Stat.find({ tournamentId: req.params.tournamentId }).populate("playerId");

    if (!stats.length) return res.json({ topScorer: null, yellowCards: [], redCards: [], byRound: [] });

    // Goleador
    const topScorer = stats.reduce((max, s) =>
      !max || s.goals > max.goals ? s : max, null
    );

    // Amarillas ordenadas
    const yellowCards = stats
      .filter((s) => s.yellowCards > 0)
      .map((s) => ({
        playerId: s.playerId._id,
        name: s.playerId.name,
        photo: s.playerId.photo,
        yellowCards: s.yellowCards,
      }))
      .sort((a, b) => b.yellowCards - a.yellowCards);

    // Rojas ordenadas
    const redCards = stats
      .filter((s) => s.redCards > 0)
      .map((s) => ({
        playerId: s.playerId._id,
        name: s.playerId.name,
        photo: s.playerId.photo,
        redCards: s.redCards,
      }))
      .sort((a, b) => b.redCards - a.redCards);

    // Agrupado por fecha (round)
    const byRound = [];
    stats.forEach((s) => {
      if (!s.round) return;
      let roundStats = byRound.find((r) => r.round === s.round);
      if (!roundStats) {
        roundStats = { round: s.round, topScorer: null, yellowCards: 0, redCards: 0 };
        byRound.push(roundStats);
      }
      // goles
      if (!roundStats.topScorer || s.goals > roundStats.topScorer.goals) {
        roundStats.topScorer = { name: s.playerId.name, goals: s.goals };
      }
      roundStats.yellowCards += s.yellowCards;
      roundStats.redCards += s.redCards;
    });

    res.json({
      topScorer: topScorer
        ? { name: topScorer.playerId.name, photo: topScorer.playerId.photo, goals: topScorer.goals }
        : null,
      yellowCards,
      redCards,
      byRound,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
