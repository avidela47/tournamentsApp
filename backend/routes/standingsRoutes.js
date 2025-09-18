// routes/standingsRoutes.js
import express from "express";
import Match from "../models/Match.js";
import Team from "../models/Team.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// 📊 Tabla de posiciones por torneo
router.get("/:tournamentId", verifyToken, async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // 1) Equipos del torneo
    const teams = await Team.find({ tournament: tournamentId });

    // 2) Inicializar standings
    const standings = teams.map((t) => ({
      _id: t._id,       // ID del equipo
      name: t.name,     // Nombre del equipo
      logo: t.logo,     // Logo del equipo
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    }));

    // 3) Partidos del torneo
    const matches = await Match.find({ tournament: tournamentId })
      .populate("homeTeam")
      .populate("awayTeam");

    // 4) Calcular acumulados
    matches.forEach((m) => {
      const home = standings.find((x) => String(x._id) === String(m.homeTeam?._id));
      const away = standings.find((x) => String(x._id) === String(m.awayTeam?._id));
      if (!home || !away) return;

      home.played++; away.played++;
      home.goalsFor += m.homeGoals; home.goalsAgainst += m.awayGoals;
      away.goalsFor += m.awayGoals; away.goalsAgainst += m.homeGoals;

      if (m.homeGoals > m.awayGoals) { home.wins++; away.losses++; home.points += 3; }
      else if (m.homeGoals < m.awayGoals) { away.wins++; home.losses++; away.points += 3; }
      else { home.draws++; away.draws++; home.points += 1; away.points += 1; }
    });

    // 5) Diferencia de gol
    standings.forEach((s) => { s.goalDiff = s.goalsFor - s.goalsAgainst; });

    // 6) Orden
    standings.sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDiff - a.goalDiff ||
        b.goalsFor - a.goalsFor
    );

    res.json(standings);
  } catch (err) {
    res.status(500).json({ message: "Error al calcular la tabla", error: err.message });
  }
});

export default router;





