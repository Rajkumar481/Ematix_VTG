import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: String,
    age: String,
    phone: String,
    gender: String,
    address: String,
    diagnosis: [String],
    symptoms: String,
    daysTakenMedicine: String,
    pendingDays: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Patient", patientSchema);
