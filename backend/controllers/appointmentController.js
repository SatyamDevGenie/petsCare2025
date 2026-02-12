import asyncHandler from "express-async-handler";
import Appointment from "../models/appointmentModel.js";
import Notification from "../models/notificationModel.js";

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

  const appointment = new Appointment({
    petOwner: req.user._id,
    pet: petId,
    doctor: doctorId,
    appointmentDate,
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



// Doctor or Admin Accept/Reject Appointment (sends real-time notification to pet owner)
const respondToAppointment = asyncHandler(async (req, res) => {
  try {
    const { appointmentId, response } = req.body;

    if (!["Accepted", "Rejected"].includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Response must be either 'Accepted' or 'Rejected'.",
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

    const isAdmin = req.user && req.user.isAdmin;
    const isDoctor = req.doctor && req.doctor._id;
    const doctorId = appointment.doctor?._id || appointment.doctor;
    const petOwnerId = appointment.petOwner?._id || appointment.petOwner;

    if (isDoctor) {
      if (doctorId.toString() !== req.doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to respond to this appointment.",
        });
      }
    } else if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Doctor or Admin required.",
      });
    }

    const actedBy = isDoctor ? req.doctor.name : "Admin";
    appointment.doctorResponse = response;
    appointment.status = response;
    const updatedAppointment = await appointment.save();

    // Create in-app notification for the pet owner (recipient is User _id)
    const notificationType = response === "Accepted" ? "appointment_accepted" : "appointment_rejected";
    const title = response === "Accepted" ? "Appointment Accepted" : "Appointment Rejected";
    const message =
      response === "Accepted"
        ? `Your appointment with Dr. ${appointment.doctor?.name || "the doctor"} for ${appointment.pet?.name || "your pet"} has been accepted by ${actedBy}.`
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


export { bookAppointment, getAllAppointments, getUserAppointments, respondToAppointment, getDoctorAppointments };






