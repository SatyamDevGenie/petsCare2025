import nodemailer from "nodemailer";

/**
 * Transporter using admin Gmail (satyamsawant54@gmail.com).
 * Requires ADMIN_EMAIL and ADMIN_EMAIL_APP_PASSWORD in .env.
 * For Gmail: use App Password (Google Account → Security → 2-Step Verification → App passwords).
 */
const createTransporter = () => {
  const user = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_EMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.warn("Email: ADMIN_EMAIL or ADMIN_EMAIL_APP_PASSWORD not set. Skipping send.");
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

/**
 * Send email to pet owner when doctor accepts, rejects, or cancels the appointment.
 * @param {string} toEmail - Pet owner's email
 * @param {string} ownerName - Pet owner's name
 * @param {string} status - "Accepted", "Rejected", or "Cancelled"
 * @param {string} doctorName - Doctor's name
 * @param {string} petName - Pet's name
 * @param {string} appointmentDate - Formatted appointment date
 * @param {string} actedBy - Doctor name (who performed the action)
 */
export const sendAppointmentStatusEmail = async (
  toEmail,
  ownerName,
  status,
  doctorName,
  petName,
  appointmentDate,
  actedBy
) => {
  const transporter = createTransporter();
  if (!transporter) return;

  const isAccepted = status === "Accepted";
  const subject = `PetsCare – Your appointment has been ${status}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: ${isAccepted ? "#059669" : "#dc2626"};">
        Appointment ${status}
      </h2>
      <p>Hello ${ownerName},</p>
      <p>
        Your appointment with <strong>Dr. ${doctorName}</strong> for <strong>${petName}</strong>
        scheduled on <strong>${appointmentDate}</strong> has been <strong>${status.toLowerCase()}</strong>
        by ${actedBy}.
      </p>
      ${isAccepted ? "<p>Please visit the clinic on the scheduled date. Contact us if you need to reschedule.</p>" : "<p>If you have questions or wish to book another slot, please log in to PetsCare or contact us.</p>"}
      <br/>
      <p style="color: #6b7280; font-size: 14px;">
        This is an automated message from <strong>PetsCare</strong>. Please do not reply directly to this email.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"PetsCare Admin" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject,
      html,
    });
    console.log(`Email sent to ${toEmail}: Appointment ${status}`);
  } catch (err) {
    console.error("Failed to send appointment status email:", err.message);
  }
};

/**
 * Send a custom email from admin to a user (e.g. pet owner).
 * Used when admin clicks "Send Email" on the dashboard for an appointment.
 * @param {string} toEmail - Recipient email
 * @param {string} ownerName - Recipient name
 * @param {string} subject - Email subject
 * @param {string} htmlBody - HTML body (optional; default is a simple message)
 */
export const sendAdminMessageEmail = async (toEmail, ownerName, subject, htmlBody) => {
  const transporter = createTransporter();
  if (!transporter) return { sent: false, error: "Email not configured" };

  const html =
    htmlBody ||
    `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #059669;">Message from PetsCare</h2>
      <p>Hello ${ownerName},</p>
      <p>You have a message from the PetsCare team regarding your appointment.</p>
      <p>Please log in to your account for details or contact us if you have questions.</p>
      <br/>
      <p style="color: #6b7280; font-size: 14px;">
        This message was sent from <strong>PetsCare</strong>. Please do not reply directly to this email.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"PetsCare Admin" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: subject || "PetsCare – Message from Admin",
      html,
    });
    console.log(`Admin email sent to ${toEmail}: ${subject}`);
    return { sent: true };
  } catch (err) {
    console.error("Failed to send admin email:", err.message);
    return { sent: false, error: err.message };
  }
};
