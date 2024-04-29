// passwordController.js

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userData = require("../model/UserModel");
const Mailgen = require("mailgen");
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
    name: "YourApp",
    link: "https://yourapp.com/",
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

  const emailBody = mailGenerator.generate(emailTemplate);

  return {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Reset Password",
    html: emailBody,
  };
};

const sendMail = async (mailOptions) => {
  return transporter.sendMail(mailOptions);
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const tme = new Date();
    tme.setMinutes(tme.getMinutes() + 10);
    await user.update({ otp: hashedOTP, timeExpire: tme });
    // Generate reset password email using Mailgen
    const mailOptions = generateResetPasswordMail(email, otp);
    await sendMail(mailOptions);
    res.json({ message: res.__("forget-message") });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    const user = await userData.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid User" });
    }
    if (user.otp === null) {
      return res.status(403).json({ error:"Invalid OTP"})
    }
    const otpMatch = await bcrypt.compare(otp, user.otp);
    if (otpMatch && new Date() < user.timeExpire) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await user.update({password: hashedPassword,otp: null,timeExpire: null});
      return res.status(201).json({ message: res.__("reset-message") });
    }
    res.status(500).json({ error: "Invalid or Expired OTP" });
  } catch (error) {
    res.status(400).json({ error:error.message});
  }
};

module.exports = { forgetPassword, resetPassword };