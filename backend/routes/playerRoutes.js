import express from "express";
import Player from "../models/Player.js";
import Team from "../models/Team.js";

const router = express.Router();

// ============================
// Obtener todos los jugadores (con equipo y torneo populado)
// ============================
router.get("/", async (req, res) => {
  try {
    const players = await Player.find()
      .populate({
        path: "team",
        select: "name logo tournament",
        populate: { path: "tournament", select: "name logo" },
      });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Crear jugador
// ============================
router.post("/", async (req, res) => {
  try {
    const { name, position, photo, goals, yellowCards, redCards, team } =
      req.body;

    const existingTeam = await Team.findById(team);
    if (!existingTeam) {
      return res.status(400).json({ message: "Equipo no encontrado" });
    }

    const player = new Player({
      name,
      position,
      photo,
      goals: goals || 0,
      yellowCards: yellowCards || 0,
      redCards: redCards || 0,
      team,
    });

    const savedPlayer = await player.save();
    const populatedPlayer = await savedPlayer.populate({
      path: "team",
      select: "name logo tournament",
      populate: { path: "tournament", select: "name logo" },
    });

    res.status(201).json(populatedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Actualizar jugador (general)
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { name, position, photo, goals, yellowCards, redCards, team } =
      req.body;

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { name, position, photo, goals, yellowCards, redCards, team },
      { new: true }
    ).populate({
      path: "team",
      select: "name logo tournament",
      populate: { path: "tournament", select: "name logo" },
    });

    if (!player) return res.status(404).json({ message: "Jugador no encontrado" });

    res.json(player);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Eliminar jugador
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Player.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Jugador no encontrado" });
    res.json({ message: "Jugador eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Jugadores de un torneo
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const teams = await Team.find({ tournament: req.params.tournamentId }).select("_id");
    const players = await Player.find({ team: { $in: teams.map((t) => t._id) } })
      .populate({
        path: "team",
        select: "name logo tournament",
        populate: { path: "tournament", select: "name logo" },
      });

    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Actualizar SOLO estadísticas (goles, amarillas, rojas)
// ============================
router.patch("/:id/stats", async (req, res) => {
  try {
    const { goals, yellowCards, redCards } = req.body;

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      {
        ...(goals !== undefined && { goals }),
        ...(yellowCards !== undefined && { yellowCards }),
        ...(redCards !== undefined && { redCards }),
      },
      { new: true }
    ).populate({
      path: "team",
      select: "name logo tournament",
      populate: { path: "tournament", select: "name logo" },
    });

    if (!player) return res.status(404).json({ message: "Jugador no encontrado" });

    res.json(player);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;




