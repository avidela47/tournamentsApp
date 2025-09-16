import express from "express";
import Match from "../models/Match.js";
import Team from "../models/Team.js";

const router = express.Router();

router.get("/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Buscar equipos del torneo
    const teams = await Team.find({ tournament: tournamentId });

    // Inicializar tabla
    const standings = teams.map((team) => ({
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

    // Traer partidos del torneo
    const matches = await Match.find({ tournament: tournamentId })
      .populate("homeTeam")
      .populate("awayTeam");

    // Actualizar estadísticas
    matches.forEach((match) => {
      const home = standings.find((t) => String(t._id) === String(match.homeTeam._id));
      const away = standings.find((t) => String(t._id) === String(match.awayTeam._id));

      if (home && away) {
        home.played++;
        away.played++;

        home.goalsFor += match.homeGoals;
        home.goalsAgainst += match.awayGoals;

        away.goalsFor += match.awayGoals;
        away.goalsAgainst += match.homeGoals;

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

        home.goalDiff = home.goalsFor - home.goalsAgainst;
        away.goalDiff = away.goalsFor - away.goalsAgainst;
      }
    });

    // Ordenar por puntos
    standings.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff);

    res.json(standings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;



