import express from "express";
import Match from "../models/Match.js";
import Team from "../models/Team.js";

const router = express.Router();

/**
 * GET /api/standings/:tournamentId
 * Devuelve la tabla de posiciones del torneo:
 * - Equipo (nombre + logo)
 * - PJ, G, E, P, GF, GC, DG, Pts
 */
router.get("/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // 1) Traer equipos del torneo (clave: tournamentId)
    const teams = await Team.find({ tournamentId })
      .select("_id name logo")
      .lean();

    // Si no hay equipos, devolvemos array vacío
    if (!teams || teams.length === 0) {
      return res.json([]);
    }

    // 2) Inicializar tabla con todos los equipos
    //    Usamos un map por teamId para sumar rápido
    const tableById = new Map();
    for (const t of teams) {
      tableById.set(String(t._id), {
        teamId: String(t._id),
        team: t.name,
        logo: t.logo || "",
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
        points: 0,
      });
    }

    // 3) Traer partidos del torneo (populate equipos para nombres/logos)
    const matches = await Match.find({ tournamentId })
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo")
      .lean();

    // 4) Sumar estadísticas
    for (const m of matches) {
      const homeId = String(m.homeTeam?._id || "");
      const awayId = String(m.awayTeam?._id || "");
      if (!tableById.has(homeId) || !tableById.has(awayId)) continue;

      const home = tableById.get(homeId);
      const away = tableById.get(awayId);

      const hg = Number(m.homeGoals || 0);
      const ag = Number(m.awayGoals || 0);

      // PJ
      home.played += 1;
      away.played += 1;

      // GF / GC
      home.goalsFor += hg;
      home.goalsAgainst += ag;

      away.goalsFor += ag;
      away.goalsAgainst += hg;

      // Resultado
      if (hg > ag) {
        home.wins += 1;
        away.losses += 1;
        home.points += 3;
      } else if (hg < ag) {
        away.wins += 1;
        home.losses += 1;
        away.points += 3;
      } else {
        // empate
        home.draws += 1;
        away.draws += 1;
        home.points += 1;
        away.points += 1;
      }
    }

    // 5) Calcular DG y ordenar
    const standings = Array.from(tableById.values()).map((row) => ({
      ...row,
      goalDiff: row.goalsFor - row.goalsAgainst,
    }));

    standings.sort((a, b) => {
      // Pts DESC
      if (b.points !== a.points) return b.points - a.points;
      // DG DESC
      const dgB = b.goalDiff;
      const dgA = a.goalDiff;
      if (dgB !== dgA) return dgB - dgA;
      // GF DESC
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      // Nombre ASC (estable)
      return a.team.localeCompare(b.team);
    });

    return res.json(standings);
  } catch (err) {
    console.error("Standings error:", err);
    res.status(500).json({ message: "Error calculando posiciones" });
  }
});

export default router;


