import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  date: { type: Date, required: true },
  score: { type: String }, // ej: "2-1"
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
});

export default mongoose.model("Match", matchSchema);


