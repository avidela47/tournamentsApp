import express from "express";
import Player from "../models/Player.js";
import Team from "../models/Team.js";

const router = express.Router();

// ============================
// Obtener todos los jugadores (con equipo y escudo)
// ============================
router.get("/", async (req, res) => {
  try {
    const players = await Player.find()
      .populate({
        path: "team", // 👈 el campo en Player debe ser "team"
        select: "name logo tournament",
        populate: { path: "tournament", select: "name" },
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
    const { name, position, photo, team } = req.body;

    // Validar que el equipo exista
    const existingTeam = await Team.findById(team);
    if (!existingTeam) {
      return res.status(400).json({ message: "Equipo no encontrado" });
    }

    const player = new Player({ name, position, photo, team });
    const savedPlayer = await player.save();

    // Devolver el jugador populado
    const populated = await savedPlayer.populate({
      path: "team",
      select: "name logo tournament",
      populate: { path: "tournament", select: "name" },
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Actualizar jugador
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { name, position, photo, team } = req.body;

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { name, position, photo, team },
      { new: true }
    ).populate({
      path: "team",
      select: "name logo tournament",
      populate: { path: "tournament", select: "name" },
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
// Listar jugadores de un torneo (por equipos asociados)
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const id = req.params.tournamentId;

    // Buscar equipos del torneo
    const teams = await Team.find({
      $or: [{ tournament: id }, { tournamentId: id }], // soporte ambos nombres
    }).select("_id");

    // Buscar jugadores de esos equipos
    const players = await Player.find({ team: { $in: teams.map((t) => t._id) } })
      .populate({
        path: "team",
        select: "name logo tournament",
        populate: { path: "tournament", select: "name" },
      });

    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

