import express from "express";
import multer from "multer";
import Player from "../models/Player.js";
import Team from "../models/Team.js";

const router = express.Router();

// Configuración de multer para guardar imágenes en /uploads
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
// GET todos los jugadores
// ============================
router.get("/", async (req, res) => {
  try {
    const players = await Player.find().populate("team");
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener jugadores", error });
  }
});

// ============================
// POST agregar jugador
// ============================
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { name, position, team } = req.body;

    // Validar que el equipo exista
    const existingTeam = await Team.findById(team);
    if (!existingTeam) {
      return res.status(400).json({ message: "El equipo no existe" });
    }

    const newPlayer = new Player({
      name,
      position,
      team,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newPlayer.save();
    res.json(newPlayer);
  } catch (error) {
    res.status(500).json({ message: "Error al crear jugador", error });
  }
});

// ============================
// PUT editar jugador
// ============================
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const { name, position, team } = req.body;
    const updateData = { name, position, team };

    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ message: "Error al editar jugador", error });
  }
});

// ============================
// DELETE eliminar jugador
// ============================
router.delete("/:id", async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: "Jugador eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar jugador", error });
  }
});

export default router;
