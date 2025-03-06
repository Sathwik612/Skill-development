import mongoose from "mongoose";

const coachSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  team: String,
});

const Coach = mongoose.models.Coach || mongoose.model("Coach", coachSchema);

export default Coach;
