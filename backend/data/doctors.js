import bcrypt from "bcryptjs";

const doctors = [
  {
    name: "Dr. Ramesh Kumar",
    email: "ramesh.kumar@gmail.com",
    password: bcrypt.hashSync("ramesh123", 10),
    specialization: "Veterinary Surgeon",
    contactNumber: "9326903988",
    profileImage: "/images/male-doctor.jpg",
    notes: "Dr. Ramesh Kumar has over 18 years of experience in veterinary surgery and emergency care. He holds an MVSc (Surgery) from IVRI and is a member of the Indian Veterinary Association. Awards: Best Veterinarian (State Level) 2022, Excellence in Small Animal Surgery 2019. He has performed 5000+ successful surgeries and specializes in orthopedic and soft-tissue procedures. His compassionate approach and clear communication put both pets and owners at ease. He is available on Monday and Tuesday evenings for consultations.",
    isDoctor: true,
    availability: "Monday & Tuesday, 6:00 PM – 8:00 PM",
    schedule: [
      { dayOfWeek: 1, startTime: "18:00", endTime: "20:00" }, // Monday
      { dayOfWeek: 2, startTime: "18:00", endTime: "20:00" }, // Tuesday
    ],
  },
  {
    name: "Dr. Vidhi Rai",
    email: "vidhi.rai@gmail.com",
    password: bcrypt.hashSync("vidhi123", 10),
    specialization: "Pet Care & Wellness Specialist",
    contactNumber: "9833447013",
    profileImage: "/images/female-doctor.jpg",
    notes: "Dr. Vidhi Rai is a USA-returned specialist with 12+ years of experience in pet wellness, preventive care, and nutrition. She holds a DVM and a postgraduate diploma in Companion Animal Practice. Awards: Young Veterinarian of the Year 2021, IVA Gold Medal for Clinical Excellence. She is certified in Feline Friendly Practice and has a special interest in behavioral health and senior pet care. Fluent in English and Hindi. She consults on weekends for the convenience of working pet parents.",
    isDoctor: true,
    availability: "Saturday & Sunday, 1:00 PM – 3:00 PM",
    schedule: [
      { dayOfWeek: 6, startTime: "13:00", endTime: "15:00" }, // Saturday
      { dayOfWeek: 0, startTime: "13:00", endTime: "15:00" }, // Sunday
    ],
  },
];

export default doctors;
