import express from "express";
import Team from "../models/Team.js";
import Tournament from "../models/Tournament.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// ============================
// Listar equipos (logueados)
// ============================
router.get("/", verifyToken, async (req, res) => {
  try {
    const teams = await Team.find().populate("tournament", "name logo");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener equipos", error: err.message });
  }
});

// ============================
// Obtener equipo por ID (logueados)
// ============================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("tournament", "name logo");
    if (!team) return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener equipo", error: err.message });
  }
});

// ============================
// Crear equipo (solo admin)
// ============================
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, logo, tournament } = req.body;

    // validar torneo
    const t = await Tournament.findById(tournament);
    if (!t) return res.status(400).json({ message: "Torneo inválido" });

    const team = await Team.create({ name, logo: logo || "", tournament });
    const populated = await team.populate("tournament", "name logo");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: "Error al crear equipo", error: err.message });
  }
});

// ============================
// Editar equipo (solo admin)
// ============================
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, logo, tournament } = req.body;

    if (tournament) {
      const t = await Tournament.findById(tournament);
      if (!t) return res.status(400).json({ message: "Torneo inválido" });
    }

    const updated = await Team.findByIdAndUpdate(
      req.params.id,
      { name, logo, tournament },
      { new: true, runValidators: true }
    ).populate("tournament", "name logo");

    if (!updated) return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error al editar equipo", error: err.message });
  }
});

// ============================
// Eliminar equipo (solo admin)
// ============================
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Equipo no encontrado" });
    res.json({ message: "Equipo eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar equipo", error: err.message });
  }
});

export default router;
