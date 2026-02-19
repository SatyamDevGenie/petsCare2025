import express from "express";
import {
  bookAppointment,
  getAllAppointments,
  getUserAppointments,
  respondToAppointment,
  getDoctorAppointments,
  sendEmailToAppointmentUser,
} from "../controllers/appointmentController.js";
import { protect, admin, doctor } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for pet owners to book an appointment
router.post("/book", protect, bookAppointment);

// Route for Admin only – view all appointments (pet owners + doctors)
router.get("/all", protect, admin, getAllAppointments);

// Route for pet owners to get their appointments
router.get("/usersAppointments", protect, getUserAppointments);

// Route for doctors to accept or reject appointments
router.get("/doctorsAppointments", protect, doctor, getDoctorAppointments);

// Doctor only: accept / reject / cancel appointments (pet owners get notification + email)
router.put("/respond", protect, doctor, respondToAppointment);

// Admin only: send email to pet owner for an appointment (from dashboard "Send Email" button)
router.post("/send-email", protect, admin, sendEmailToAppointmentUser);

export default router;





