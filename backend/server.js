import dotenv from "dotenv";
import express from "express";
import chalk from "chalk";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirnameServer = path.dirname(__filename);
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import userRoutes from "../backend/routes/userRoutes.js";
import petRoutes from "../backend/routes/petRoutes.js";
import serviceRoutes from "../backend/routes/serviceRoutes.js";
import doctorRoutes from "../backend/routes/doctorRoutes.js";
import appointmentRoutes from "../backend/routes/appointmentRoutes.js";
import uploadRoutes from "../backend/routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";


dotenv.config(); // For Env

connectDB(); // connection to Mongodb

const app = express();
app.use(express.json()); // Accepting the json data
app.use(cookieParser());
app.use(cors());



// Serve static files: uploads + seed images (backend/data/images)
const __dirnameRoot = path.resolve();
app.use("/uploads", express.static(path.join(__dirnameRoot, "uploads")));
app.use("/images", express.static(path.join(__dirnameServer, "data", "images")));




// Routes
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/services", serviceRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/appointment", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/", (req, res) => {
  res.send("petsCare API is running");
});



// Middlewares
app.use(notFound);
app.use(errorHandler);


// ENV Setup
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:5173", methods: ["GET", "POST"] },
});

app.set("io", io);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const room = `user:${socket.userId}`;
  socket.join(room);
  socket.on("disconnect", () => {});
});

httpServer.listen(PORT, () => {
  console.log(chalk.yellow(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`));
  console.log(chalk.cyan("Socket.io enabled for real-time notifications."));
});
