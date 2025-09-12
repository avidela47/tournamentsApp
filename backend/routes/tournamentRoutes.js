import express from "express";
import Tournament from "../models/Tournament.js";

const router = express.Router();

// GET all tournaments
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener torneos", err });
  }
});

// POST add tournament
router.post("/", async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const newTournament = new Tournament({ name, startDate, endDate });
    await newTournament.save();
    res.json(newTournament);
  } catch (err) {
    res.status(500).json({ message: "Error al crear torneo", err });
  }
});

// DELETE tournament
router.delete("/:id", async (req, res) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ message: "Torneo eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar torneo", err });
  }
});

export default router;
