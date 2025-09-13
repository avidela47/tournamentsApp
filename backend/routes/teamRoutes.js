import express from "express";
import Team from "../models/Team.js";

const router = express.Router();

// ============================
// Obtener todos los equipos (con torneo)
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
// Obtener equipos por torneo
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const teams = await Team.find({
      tournamentId: req.params.tournamentId,
    }).populate("tournamentId", "name logo");

    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Crear equipo
// ============================
router.post("/", async (req, res) => {
  try {
    const { name, logo, tournamentId } = req.body;
    if (!tournamentId) {
      return res.status(400).json({ message: "El equipo debe tener torneo" });
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
    const { name, logo, tournamentId } = req.body;
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


