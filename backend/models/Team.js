import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String,
    default: "",
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Team = mongoose.model("Team", TeamSchema);
export default Team;









