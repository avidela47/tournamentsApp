import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  _id: String,
  name: String,
  logo: String,
});

const MatchSchema = new mongoose.Schema({
  home: { type: TeamSchema, default: null },
  away: { type: TeamSchema, default: null },
  score: { type: [Number], default: [0, 0] },
  winner: { type: TeamSchema, default: null },
});

const FinalSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
  quarters: [MatchSchema],
  semis: [MatchSchema],
  final: [MatchSchema],
});

export default mongoose.model("Final", FinalSchema);
