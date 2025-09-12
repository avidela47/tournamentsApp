import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String },
  photo: { type: String }, // URL de la imagen
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
});

export default mongoose.model("Player", playerSchema);


