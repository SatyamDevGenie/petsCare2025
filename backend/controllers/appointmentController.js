import asyncHandler from "express-async-handler";
import Appointment from "../models/appointmentModel.js";
import Notification from "../models/notificationModel.js";
import Doctor from "../models/doctorModel.js";
import { sendAppointmentStatusEmail, sendAdminMessageEmail } from "../utils/emailService.js";

// Helper: check if a date/time falls within doctor's schedule (schedule: [{ dayOfWeek, startTime, endTime }])
function isWithinDoctorSchedule(date, schedule) {
  if (!schedule || !Array.isArray(schedule) || schedule.length === 0) return true;
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const [hours, minutes] = [d.getHours(), d.getMinutes()];
  const slotMinutes = hours * 60 + minutes;
  for (const slot of schedule) {
    if (slot.dayOfWeek !== dayOfWeek) continue;
    const [startH, startM] = (slot.startTime || "00:00").split(":").map(Number);
    const [endH, endM] = (slot.endTime || "23:59").split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    if (slotMinutes >= startMinutes && slotMinutes < endMinutes) return true;
  }
  return false;
}

// Book an appointment (Only petOwners can book)
const bookAppointment = asyncHandler(async (req, res) => {
  const { petId, doctorId, appointmentDate, query } = req.body;

  if (!petId || !doctorId || !appointmentDate) {
    return res.status(400).json({
      success: false,
      message: "Please provide petId, doctorId, and appointmentDate.",
    });
  }

  if (req.user.role !== "petOwner") {
    return res.status(403).json({
      success: false,
      message: "Only pet owners can book appointments.",
    });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found.",
    });
  }

  const appointmentDateTime = new Date(appointmentDate);
  if (isNaN(appointmentDateTime.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment date or time.",
    });
  }

  if (doctor.schedule && doctor.schedule.length > 0 && !isWithinDoctorSchedule(appointmentDateTime, doctor.schedule)) {
    return res.status(400).json({
      success: false,
      message: "Selected date or time is not within this doctor's availability. Please choose a slot that matches their schedule.",
    });
  }

  const appointment = new Appointment({
    petOwner: req.user._id,
    pet: petId,
    doctor: doctorId,
    appointmentDate: appointmentDateTime,
    query,
    status: "Pending",
    doctorResponse: "Pending",
  });

  const savedAppointment = await appointment.save();

  res.status(201).json({
    success: true,
    appointment: savedAppointment,
  });
});

// Get all appointments (Only Admin)
const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate("petOwner", "name email")
    .populate("pet", "name type breed age")
    .populate("doctor", "name specialization");

  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});


// Get appointments for the logged-in petOwner
const getUserAppointments = asyncHandler(async (req, res) => {
  if (req.user.role !== "petOwner") {
    return res.status(403).json({
      success: false,
      message: "Only pet owners can view their appointments.",
    });
  }

  const appointments = await Appointment.find({ petOwner: req.user._id })
    .populate("pet", "name type breed age")
    .populate("doctor", "name specialization");

  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});



// Doctor only: Accept / Reject / Cancel appointment (sends real-time notification + email to pet owner)
const respondToAppointment = asyncHandler(async (req, res) => {
  try {
    const { appointmentId, response } = req.body;

    if (!["Accepted", "Rejected", "Cancelled"].includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Response must be 'Accepted', 'Rejected', or 'Cancelled'.",
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("petOwner", "name email")
      .populate("doctor", "name")
      .populate("pet", "name");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const doctorId = appointment.doctor?._id || appointment.doctor;
    const petOwnerId = appointment.petOwner?._id || appointment.petOwner;

    // Only the doctor assigned to this appointment can respond
    if (!req.doctor || doctorId.toString() !== req.doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the doctor assigned to this appointment can accept, reject, or cancel it.",
      });
    }

    const actedBy = req.doctor.name;
    appointment.doctorResponse = response;
    appointment.status = response;
    const updatedAppointment = await appointment.save();

    // Create in-app notification for the pet owner
    const notificationType =
      response === "Accepted"
        ? "appointment_accepted"
        : response === "Cancelled"
          ? "appointment_cancelled"
          : "appointment_rejected";
    const title =
      response === "Accepted"
        ? "Appointment Accepted"
        : response === "Cancelled"
          ? "Appointment Cancelled"
          : "Appointment Rejected";
    const message =
      response === "Accepted"
        ? `Your appointment with Dr. ${appointment.doctor?.name || "the doctor"} for ${appointment.pet?.name || "your pet"} has been accepted by ${actedBy}.`
        : response === "Cancelled"
          ? `Your appointment with Dr. ${appointment.doctor?.name || "the doctor"} for ${appointment.pet?.name || "your pet"} has been cancelled by ${actedBy}.`
          : `Your appointment with Dr. ${appointment.doctor?.name || "the doctor"} for ${appointment.pet?.name || "your pet"} has been rejected by ${actedBy}.`;

    await Notification.create({
      recipient: appointment.petOwner._id,
      type: notificationType,
      title,
      message,
      appointmentId: appointment._id,
      actedBy,
    });

    // Emit real-time event to pet owner (socket.io) – req.app.get("io") set in server.js
    const io = req.app.get("io");
    if (io) {
      io.to(`user:${petOwnerId}`).emit("appointment_response", {
        appointmentId: updatedAppointment._id,
        status: response,
        title,
        message,
        actedBy,
      });
    }

    // Send email to pet owner (from ADMIN_EMAIL) about accept/reject/cancel
    const ownerEmail = appointment.petOwner?.email || (appointment.petOwner && appointment.petOwner.email);
    const ownerName = appointment.petOwner?.name || "Pet Owner";
    const doctorName = appointment.doctor?.name || "the doctor";
    const petName = appointment.pet?.name || "your pet";
    const appointmentDateFormatted = appointment.appointmentDate
      ? new Date(appointment.appointmentDate).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "scheduled date";
    if (ownerEmail) {
      sendAppointmentStatusEmail(
        ownerEmail,
        ownerName,
        response,
        doctorName,
        petName,
        appointmentDateFormatted,
        actedBy
      );
    }

    res.status(200).json({
      success: true,
      message: `Appointment has been ${response.toLowerCase()} successfully.`,
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while responding to the appointment.",
      error: error.message,
    });
  }
});



// Get all appointments for the logged-in doctor
const getDoctorAppointments = asyncHandler(async (req, res) => {
  if (!req.doctor) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only doctors can view their appointments.",
    });
  }

  const appointments = await Appointment.find({ doctor: req.doctor._id })
    .populate("petOwner", "name email")
    .populate("pet", "name type breed age");

  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});


// Admin only: send email to pet owner for an appointment (e.g. from "Send Email" button on dashboard)
// req.body: appointmentId (required), subject (optional), message (optional) – these are request params, not model fields
const sendEmailToAppointmentUser = asyncHandler(async (req, res) => {
  const { appointmentId, subject, message } = req.body;

  if (!appointmentId) {
    return res.status(400).json({
      success: false,
      message: "Please provide appointmentId.",
    });
  }
  // Optional: require subject and message from client (uncomment if needed)
  // if (!subject || !message) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Please provide subject and message.",
  //   });
  // }

  const appointment = await Appointment.findById(appointmentId)
    .populate("petOwner", "name email")
    .populate("doctor", "name specialization")
    .populate("pet", "name");

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found.",
    });
  }

  const ownerEmail = appointment.petOwner?.email;
  const ownerName = appointment.petOwner?.name || "Pet Owner";
  if (!ownerEmail) {
    return res.status(400).json({
      success: false,
      message: "Pet owner email not found for this appointment.",
    });
  }

  const doctorName = appointment.doctor?.name || "the doctor";
  const petName = appointment.pet?.name || "your pet";
  const appointmentDateFormatted = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "scheduled date";
  const status = appointment.status || appointment.doctorResponse || "Pending";

  const htmlBody = message
    ? `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #059669;">Message from PetsCare</h2>
      <p>Hello ${ownerName},</p>
      <p>${message}</p>
      <p><strong>Appointment details:</strong> Dr. ${doctorName}, ${petName}, ${appointmentDateFormatted}, Status: ${status}.</p>
      <br/><p style="color: #6b7280; font-size: 14px;">This message was sent from <strong>PetsCare</strong>.</p>
    </div>`
    : `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #059669;">Update on your appointment</h2>
      <p>Hello ${ownerName},</p>
      <p>This is an update regarding your appointment with <strong>Dr. ${doctorName}</strong> for <strong>${petName}</strong> on <strong>${appointmentDateFormatted}</strong>.</p>
      <p>Current status: <strong>${status}</strong>.</p>
      <p>If you have any questions, please log in to PetsCare or contact us.</p>
      <br/><p style="color: #6b7280; font-size: 14px;">This message was sent from <strong>PetsCare</strong>.</p>
    </div>`;

  const result = await sendAdminMessageEmail(
    ownerEmail,
    ownerName,
    subject || "PetsCare – Update on your appointment",
    htmlBody
  );

  if (!result.sent) {
    return res.status(500).json({
      success: false,
      message: "Failed to send email. Check server logs and ADMIN_EMAIL_APP_PASSWORD in .env.",
      error: result.error,
    });
  }

  res.status(200).json({
    success: true,
    message: "Email sent successfully to the pet owner.",
  });
});

export { bookAppointment, getAllAppointments, getUserAppointments, respondToAppointment, getDoctorAppointments, sendEmailToAppointmentUser };






