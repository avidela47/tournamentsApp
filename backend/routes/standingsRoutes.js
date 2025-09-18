import express from "express";
import Match from "../models/Match.js"; // 👈 acá asumimos que tenés un modelo Match
import Team from "../models/Team.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/standings/:tournamentId
 * Calcula la tabla de posiciones de un torneo
 */
router.get("/:tournamentId", verifyToken, async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Traer equipos del torneo
    const teams = await Team.find({ tournament: tournamentId });

    // Inicializar tabla
    const table = teams.map((team) => ({
      _id: team._id,
      team: team.name,
      logo: team.logo,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    }));

    // Crear un map para acceso rápido
    const tableMap = {};
    table.forEach((row) => {
      tableMap[row._id.toString()] = row;
    });

    // Traer partidos jugados del torneo
    const matches = await Match.find({
      tournament: tournamentId,
      played: true, // 👈 asegúrate que tu modelo tenga un flag "played"
    });

    // Procesar resultados
    matches.forEach((match) => {
      const home = tableMap[match.homeTeam.toString()];
      const away = tableMap[match.awayTeam.toString()];

      if (!home || !away) return;

      // Actualizar jugados
      home.played++;
      away.played++;

      // Goles
      home.goalsFor += match.homeGoals;
      home.goalsAgainst += match.awayGoals;
      away.goalsFor += match.awayGoals;
      away.goalsAgainst += match.homeGoals;

      // Diferencia de gol
      home.goalDiff = home.goalsFor - home.goalsAgainst;
      away.goalDiff = away.goalsFor - away.goalsAgainst;

      // Resultado
      if (match.homeGoals > match.awayGoals) {
        home.wins++;
        away.losses++;
        home.points += 3;
      } else if (match.homeGoals < match.awayGoals) {
        away.wins++;
        home.losses++;
        away.points += 3;
      } else {
        home.draws++;
        away.draws++;
        home.points++;
        away.points++;
      }
    });

    // Ordenar tabla
    table.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });

    res.json(table);
  } catch (err) {
    res.status(500).json({ message: "Error al calcular la tabla", error: err.message });
  }
});

export default router;






