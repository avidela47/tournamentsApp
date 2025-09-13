import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  goals: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
  round: { type: Number, default: null }, // opcional para agrupar por fecha
});

const Stat = mongoose.model("Stat", statSchema);
export default Stat;


