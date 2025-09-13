import express from "express";
import Team from "../models/Team.js";

const router = express.Router();

// ============================
// Obtener todos los equipos (populate torneo)
// ============================
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find().populate("tournamentId", "name logo");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Obtener equipos por torneo (soporta tournamentId o tournament)
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const id = req.params.tournamentId;

    // Soporte de datos viejos: algunos equipos podrían tener "tournament" en lugar de "tournamentId".
    const teams = await Team.find({
      $or: [{ tournamentId: id }, { tournament: id }],
    }).populate("tournamentId", "name logo");

    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Crear equipo (acepta tournamentId o tournament)
// ============================
router.post("/", async (req, res) => {
  try {
    const { name, logo } = req.body;
    const tournamentId = req.body.tournamentId || req.body.tournament;

    if (!tournamentId) {
      return res
        .status(400)
        .json({ message: "El equipo debe pertenecer a un torneo" });
    }

    const team = new Team({ name, logo, tournamentId });
    const saved = await team.save();
    const populated = await saved.populate("tournamentId", "name logo");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Actualizar equipo
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { name, logo } = req.body;
    const tournamentId = req.body.tournamentId || req.body.tournament;

    const updated = await Team.findByIdAndUpdate(
      req.params.id,
      { name, logo, ...(tournamentId ? { tournamentId } : {}) },
      { new: true }
    ).populate("tournamentId", "name logo");

    if (!updated) return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Eliminar equipo
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Equipo no encontrado" });
    res.json({ message: "Equipo eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;



