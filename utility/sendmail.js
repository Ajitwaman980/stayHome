const nodemailer = require("nodemailer");
require("dotenv").config();
// import nodemailer from 'nodemailer'
async function sendVerificationEmail(to, code) {
  // Create a transporter object using the Gmail service
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD,
      },
      secure: false,
    });

    // Send email
    await transport.sendMail({
      from: process.env.EMAIL_ID, // Sender email
      to: to, // Receiver email
      subject: "verification account",
      text: `Your verification code is: ${code}.
          Please use this code to complete your verification process.
          
`, // Email body
    });
  } catch (err) {
    console.error(err);
    console.log("Error sending email");
  }
}

// sendVerificationEmail("ajitwaman43@gmail.com",1243)
// export default sendVerificationEmail;
module.exports = sendVerificationEmail;
