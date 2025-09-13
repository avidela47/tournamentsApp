import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // logo o escudo del torneo
  rounds: { type: Number, required: true }, // cantidad de fechas/jornadas
  teamsCount: { type: Number, required: true }, // cantidad de equipos
  startDate: { type: Date },
  endDate: { type: Date },
});

export default mongoose.model("Tournament", tournamentSchema);




