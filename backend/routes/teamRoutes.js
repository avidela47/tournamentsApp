import express from "express";
import Team from "../models/Team.js";
import Tournament from "../models/Tournament.js";

const router = express.Router();

// Obtener todos los equipos (con torneo populado)
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find().populate("tournament", "name logo");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear equipo
router.post("/", async (req, res) => {
  try {
    const { name, logo, tournament } = req.body;

    const existingTournament = await Tournament.findById(tournament);
    if (!existingTournament) {
      return res.status(400).json({ message: "Torneo no encontrado" });
    }

    const team = new Team({ name, logo, tournament });
    const savedTeam = await team.save();

    res.status(201).json(savedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar equipo
router.put("/:id", async (req, res) => {
  try {
    const { name, logo, tournament } = req.body;

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, logo, tournament },
      { new: true }
    ).populate("tournament", "name logo");

    if (!team) return res.status(404).json({ message: "Equipo no encontrado" });

    res.json(team);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar equipo
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




