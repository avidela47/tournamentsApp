import express from "express";
import Player from "../models/Player.js";
import Team from "../models/Team.js";

const router = express.Router();

// helper para populate consistente
const playerPopulate = [
  {
    path: "team",
    select: "name logo tournamentId",
    populate: { path: "tournamentId", select: "name logo" },
  },
];

// ============================
// Obtener todos los jugadores (con equipo y torneo)
// ============================
router.get("/", async (req, res) => {
  try {
    const players = await Player.find().populate(playerPopulate);
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

    if (!team) return res.status(400).json({ message: "Falta el equipo" });

    const existingTeam = await Team.findById(team);
    if (!existingTeam) {
      return res.status(400).json({ message: "Equipo no encontrado" });
    }

    const player = new Player({ name, position, photo, team });
    const saved = await player.save();
    const populated = await saved.populate(playerPopulate);

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

    if (team) {
      const existingTeam = await Team.findById(team);
      if (!existingTeam) {
        return res.status(400).json({ message: "Equipo no encontrado" });
      }
    }

    const updated = await Player.findByIdAndUpdate(
      req.params.id,
      { name, position, photo, team },
      { new: true }
    ).populate(playerPopulate);

    if (!updated) return res.status(404).json({ message: "Jugador no encontrado" });
    res.json(updated);
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
// Jugadores de un torneo (a través de equipos del torneo)
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const teams = await Team.find({ tournamentId: req.params.tournamentId }).select("_id");
    const teamIds = teams.map((t) => t._id);

    const players = await Player.find({ team: { $in: teamIds } }).populate(playerPopulate);
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;


