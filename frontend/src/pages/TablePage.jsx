import express from "express";
import multer from "multer";
import Team from "../models/Team.js";

const router = express.Router();

// Configuración multer para logos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ============================
// GET todos los equipos
// ============================
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener equipos", error });
  }
});

// ============================
// POST agregar equipo
// ============================
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const { name } = req.body;
    const newTeam = new Team({
      name,
      logo: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await newTeam.save();
    res.json(newTeam);
  } catch (error) {
    res.status(500).json({ message: "Error al crear equipo", error });
  }
});

// ============================
// PUT editar equipo
// ============================
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = { name };
    if (req.file) updateData.logo = `/uploads/${req.file.filename}`;

    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: "Error al editar equipo", error });
  }
});

// ============================
// DELETE eliminar equipo
// ============================
router.delete("/:id", async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Equipo eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar equipo", error });
  }
});

export default router;
