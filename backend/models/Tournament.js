import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
  fechas: { type: Number, default: 0 }, // cantidad de fechas
  teamsCount: { type: Number, default: 0 }, // cantidad de equipos
});

export default mongoose.model("Tournament", tournamentSchema);



