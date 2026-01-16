import bcrypt from "bcryptjs";


const doctors = [
  {
    name: "Dr. Ramesh Kumar",
    email: "ramesh.kumar@gmail.com",
    password: bcrypt.hashSync("ramesh123", 10),
    specialization: "Veterinary Surgeon",
    contactNumber: "9326903988",
    profileImage: "/images/male-doctor.png", // Replace with actual image URL or path
    notes: "Specializes in surgical procedures and emergency cases. Compassionate and thorough.",
    isDoctor: true,
    availability: "Mon-Tue Evening 6:00-8:00 PM"
  },
  {
    name: "Dr. Vidhi Rai",
    email: "vidhi.rai@gmail.com",
    password: bcrypt.hashSync("vidhi123", 10),
    specialization: "Pets Animal Specialist",
    contactNumber: "9833447013",
    profileImage: "/images/female-doctor.png", // Replace with actual image URL or path
    notes: "USA Return and well expert in pets staff care for a animals.",
    isDoctor: true,
    availability: "Sat-Sun Afternoon 1:00-3:00 PM"
  }
];

export default doctors;
