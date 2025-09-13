import express from "express";
import Tournament from "../models/Tournament.js";

const router = express.Router();

// ============================
// Obtener todos los torneos
// ============================
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// Crear torneo
// ============================
router.post("/", async (req, res) => {
  try {
    const { name, logo, rounds, teamsCount, startDate, endDate } = req.body;

    const tournament = new Tournament({
      name,
      logo,
      rounds,
      teamsCount,
      startDate,
      endDate,
    });

    const saved = await tournament.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Actualizar torneo
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { name, logo, rounds, teamsCount, startDate, endDate } = req.body;

    const updated = await Tournament.findByIdAndUpdate(
      req.params.id,
      { name, logo, rounds, teamsCount, startDate, endDate },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Torneo no encontrado" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ============================
// Eliminar torneo
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Tournament.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Torneo no encontrado" });
    res.json({ message: "Torneo eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
