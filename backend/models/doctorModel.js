import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false, // Optional
      default: '/images/default-image.jpg', // Default image URL
    },
    notes: {
      type: String,
      required: false, // Optional notes field
    },
    isDoctor: {
      type: Boolean,
      default: true, // Set to true by default
    },
    availability: {
      type: String,
      required: false, // Optional field – human-readable summary
    },
    // Structured schedule for validation: dayOfWeek 0=Sun, 1=Mon … 6=Sat; times in 24h "HH:mm"
    schedule: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6 },
        startTime: { type: String }, // e.g. "18:00"
        endTime: { type: String },   // e.g. "20:00"
      },
    ],
  },
  { timestamps: true }
);


// Hash password before saving
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await  bcrypt.hash(this.password, salt)
})


const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;






