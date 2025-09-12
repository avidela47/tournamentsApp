import express from "express";
import Match from "../models/Match.js";
import Team from "../models/Team.js";
import Tournament from "../models/Tournament.js";

const router = express.Router();

// GET standings filtrados por torneo (por nombre)
router.get("/:tournamentName", async (req, res) => {
  try {
    const { tournamentName } = req.params;

    // Buscar torneo por nombre
    const tournament = await Tournament.findOne({ name: tournamentName });
    if (!tournament) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    // Obtener todos los equipos
    const teams = await Team.find();

    // Inicializar tabla con nuevos campos
    const standings = teams.map((team) => ({
      team: team.name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,     // GF
      goalsAgainst: 0, // GC
      goalDiff: 0,     // DG
      points: 0,
    }));

    // Diccionario para actualizar rápido
    const standingsMap = {};
    standings.forEach((s) => (standingsMap[s.team] = s));

    // Obtener solo partidos de este torneo
    const matches = await Match.find({ tournament: tournament._id })
      .populate("homeTeam")
      .populate("awayTeam");

    matches.forEach((match) => {
      if (!match.score) return; // si no tiene resultado, lo ignoramos

      const [homeGoals, awayGoals] = match.score.split("-").map(Number);

      const homeTeam = standingsMap[match.homeTeam.name];
      const awayTeam = standingsMap[match.awayTeam.name];

      if (!homeTeam || !awayTeam) return;

      // PJ
      homeTeam.played++;
      awayTeam.played++;

      // Goles a favor y en contra
      homeTeam.goalsFor += homeGoals;
      homeTeam.goalsAgainst += awayGoals;
      awayTeam.goalsFor += awayGoals;
      awayTeam.goalsAgainst += homeGoals;

      // Recalcular diferencia de gol
      homeTeam.goalDiff = homeTeam.goalsFor - homeTeam.goalsAgainst;
      awayTeam.goalDiff = awayTeam.goalsFor - awayTeam.goalsAgainst;

      // Resultados
      if (homeGoals > awayGoals) {
        homeTeam.wins++;
        homeTeam.points += 3;
        awayTeam.losses++;
      } else if (awayGoals > homeGoals) {
        awayTeam.wins++;
        awayTeam.points += 3;
        homeTeam.losses++;
      } else {
        // Empate
        homeTeam.draws++;
        awayTeam.draws++;
        homeTeam.points++;
        awayTeam.points++;
      }
    });

    // Ordenar tabla por puntos y diferencia de gol
    const sorted = standings
      .filter((s) => s.played > 0)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
        return b.goalsFor - a.goalsFor; // tercer criterio: goles a favor
      });

    res.json(sorted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al calcular standings", error });
  }
});

export default router;
