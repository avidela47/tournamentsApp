import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    default: "",
  },
  photo: {
    type: String,
    default: "",
  },
  goals: {
    type: Number,
    default: 0,
  },
  yellowCards: {
    type: Number,
    default: 0,
  },
  redCards: {
    type: Number,
    default: 0,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Player = mongoose.model("Player", PlayerSchema);
export default Player;







