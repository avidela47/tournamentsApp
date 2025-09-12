import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // opcional: logo del equipo
});

export default mongoose.model("Team", teamSchema);


