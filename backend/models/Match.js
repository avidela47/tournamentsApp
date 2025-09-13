import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  round: { type: Number, required: true }, // número de fecha
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  homeGoals: { type: Number, default: 0 },
  awayGoals: { type: Number, default: 0 },
  referee: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Match", matchSchema);






