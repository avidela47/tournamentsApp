import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String },       // opcional
  photo: { type: String },           // opcional (URL)
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
});

export default mongoose.model("Player", playerSchema);






