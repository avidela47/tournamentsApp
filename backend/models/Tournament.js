import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // URL del logo
  totalRounds: { type: Number, default: 1 }, // cantidad de fechas
  totalTeams: { type: Number, default: 0 },  // cantidad de equipos
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Tournament", tournamentSchema);


