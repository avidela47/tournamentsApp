import express from "express";
import Match from "../models/Match.js";
import Team from "../models/Team.js";

const router = express.Router();

// GET /api/standings/:tournamentId
router.get("/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const teams = await Team.find({ tournament: tournamentId });
    const matches = await Match.find({ tournament: tournamentId });

    // Inicializar tabla
    const standings = teams.map((team) => ({
      teamId: team._id,
      team: team.name,
      logo: team.logo, // 👈 agregamos logo del equipo
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    }));

    const standingsMap = new Map();
    standings.forEach((s) => standingsMap.set(s.teamId.toString(), s));

    // Procesar partidos
    matches.forEach((match) => {
      const home = standingsMap.get(match.homeTeam.toString());
      const away = standingsMap.get(match.awayTeam.toString());

      if (!home || !away || !match.score) return;

      const [homeGoals, awayGoals] = match.score.split("-").map(Number);

      // Partidos jugados
      home.played++;
      away.played++;

      // Goles
      home.goalsFor += homeGoals;
      home.goalsAgainst += awayGoals;
      away.goalsFor += awayGoals;
      away.goalsAgainst += homeGoals;

      home.goalDiff = home.goalsFor - home.goalsAgainst;
      away.goalDiff = away.goalsFor - away.goalsAgainst;

      // Resultado
      if (homeGoals > awayGoals) {
        home.wins++;
        home.points += 3;
        away.losses++;
      } else if (homeGoals < awayGoals) {
        away.wins++;
        away.points += 3;
        home.losses++;
      } else {
        home.draws++;
        away.draws++;
        home.points++;
        away.points++;
      }
    });

    // Ordenar por puntos, diferencia de gol y GF
    const sorted = Array.from(standingsMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

