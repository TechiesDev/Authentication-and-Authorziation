// passwordController.js

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const userData = require("../model/UserModel"); // Assuming you have a user model
const Mailgen  = require("mailgen"); // Import Mailgen
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Create Mailgen instance
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "YourApp",
    link: "https://yourapp.com/",
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});

const generateResetPasswordMail = (email, otp) => {
  // Generate email template using Mailgen
  const emailTemplate = {
    body: {
      name: "User",
      intro: "You requested to reset your password. Here is your OTP:",
      action: {
        instructions: "Please use the following OTP to reset your password:",
        button: {
          color: "#DC4D2F",
          text: otp,
        },
      },
      outro: "If you did not request this, please ignore this email.",
    },
  };

  // Generate HTML from the template
  const emailBody = mailGenerator.generate(emailTemplate);

  return {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Reset Password",
    html: emailBody,
  };
};

const sendMail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP in the database or in memory cache for verification later
    await user.update({ otp, timeExpire: Date.now() + 3600000 }); // OTP expires in 1 hour

    // Generate reset password email using Mailgen
    const mailOptions = generateResetPasswordMail(email, otp);
    await sendMail(mailOptions);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, otp } = req.body;

    // Find user by OTP
    const user = await userData.findOne({where: {otp} });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Update user's password
    await user.update({ password, otp: null, timeExpire: null });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).json({ error: "Failed to reset password" });
  }
};

module.exports = { forgetPassword, resetPassword };
