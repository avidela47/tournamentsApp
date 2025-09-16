import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  jornada: {
    type: Number,
    default: 1,
  },
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
  homeGoals: {
    type: Number,
    default: 0,
  },
  awayGoals: {
    type: Number,
    default: 0,
  },
  referee: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Match = mongoose.model("Match", MatchSchema);
export default Match;







