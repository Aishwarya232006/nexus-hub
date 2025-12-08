const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

async function sendEmail(to, subject, message) {
  if (!to) throw new Error("Recipient email (to) is required");
  if (!subject) throw new Error("Email subject is required");
  if (!message) throw new Error("Email message is required");

  try {
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: to,
      subject: subject,
      text: message
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
}

module.exports = sendEmail;