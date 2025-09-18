import express from "express";
import Final from "../models/Final.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Crear estructura inicial
const createBracket = (teams) => {
  const quarters = [
    { home: teams[0], away: teams[7], score: [0, 0] },
    { home: teams[1], away: teams[6], score: [0, 0] },
    { home: teams[2], away: teams[5], score: [0, 0] },
    { home: teams[3], away: teams[4], score: [0, 0] },
  ];
  const semis = [
    { home: null, away: null, score: [0, 0] },
    { home: null, away: null, score: [0, 0] },
  ];
  const final = [{ home: null, away: null, score: [0, 0] }];
  return { quarters, semis, final };
};

// GET → obtener bracket
router.get("/:tournamentId", verifyToken, async (req, res) => {
  const { tournamentId } = req.params;
  let final = await Final.findOne({ tournament: tournamentId });
  res.json(final || null);
});

// POST → inicializar con top 8
router.post("/init/:tournamentId", verifyToken, isAdmin, async (req, res) => {
  const { tournamentId } = req.params;
  const { teams } = req.body;

  if (!teams || teams.length < 8) {
    return res.status(400).json({ message: "Se necesitan 8 equipos" });
  }

  await Final.deleteOne({ tournament: tournamentId }); // limpiar si existía
  const bracket = createBracket(teams);

  const newFinal = new Final({
    tournament: tournamentId,
    quarters: bracket.quarters,
    semis: bracket.semis,
    final: bracket.final,
  });

  await newFinal.save();
  res.json(newFinal);
});

// POST → actualizar resultado
router.post("/:tournamentId/update", verifyToken, isAdmin, async (req, res) => {
  const { tournamentId } = req.params;
  const { round, index, homeGoals, awayGoals } = req.body;

  let final = await Final.findOne({ tournament: tournamentId });
  if (!final) return res.status(404).json({ message: "Bracket no encontrado" });

  let match = final[round][index];
  if (!match) return res.status(400).json({ message: "Partido no válido" });

  match.score = [homeGoals, awayGoals];

  // determinar ganador
  if (homeGoals > awayGoals) match.winner = match.home;
  else if (awayGoals > homeGoals) match.winner = match.away;
  else match.winner = null;

  // avanzar ganador
  if (round === "quarters") {
    const semiIndex = Math.floor(index / 2);
    if (index % 2 === 0) final.semis[semiIndex].home = match.winner;
    else final.semis[semiIndex].away = match.winner;
  }
  if (round === "semis") {
    if (index === 0) final.final[0].home = match.winner;
    else final.final[0].away = match.winner;
  }

  await final.save();
  res.json(final);
});

export default router;

