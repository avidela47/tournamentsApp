import mongoose from "mongoose";

const StatSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  card: {
    type: String,
    enum: ["yellow", "red"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // guarda automáticamente la fecha
  },
});

const Stat = mongoose.model("Stat", StatSchema);
export default Stat;
