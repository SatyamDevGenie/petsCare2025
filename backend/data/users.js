import bcrypt from "bcryptjs";

const users = [
  {
    name: "Satyam Administrator",
    email: "satyamsawant@gmail.com",
    password: bcrypt.hashSync("123", 10),
    isAdmin: true
  },
  {
    name: "Vedant Sawant",
    email: "vedantsawant1128@gmail.com",
    password: bcrypt.hashSync("123", 10),
    isAdmin: false,
  },
];

export default users;
