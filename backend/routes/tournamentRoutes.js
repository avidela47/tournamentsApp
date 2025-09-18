import express from "express";
import Tournament from "../models/Tournament.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// ============================
// Listar torneos (logueados)
// ============================
router.get("/", verifyToken, async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener torneos", error: err.message });
  }
});

// ============================
// Obtener torneo por ID (logueados)
// ============================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: "Torneo no encontrado" });
    res.json(tournament);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener torneo", error: err.message });
  }
});

// ============================
// Crear torneo (solo admin)
// ============================
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, logo, startDate, endDate } = req.body;
    const t = await Tournament.create({ name, logo: logo || "", startDate, endDate });
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ message: "Error al crear torneo", error: err.message });
  }
});

// ============================
// Editar torneo (solo admin)
// ============================
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, logo, startDate, endDate } = req.body;

    const updated = await Tournament.findByIdAndUpdate(
      req.params.id,
      { name, logo, startDate, endDate },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Torneo no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error al actualizar torneo", error: err.message });
  }
});

// ============================
// Eliminar torneo (solo admin)
// ============================
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Tournament.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Torneo no encontrado" });
    res.json({ message: "Torneo eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar torneo", error: err.message });
  }
});

export default router;


