import bcrypt from "bcryptjs";

const users = [
  {
    name: "Satyam Administrator",
    email: "satyamsawant54@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true
  },
  {
    name: "Vedant Sawant",
    email: "vedantsawant1128@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
];

export default users;
