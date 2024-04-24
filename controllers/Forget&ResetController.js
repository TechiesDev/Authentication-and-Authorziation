// passwordController.js

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userData = require("../model/UserModel"); // Assuming you have a user model
const Mailgen = require("mailgen"); // Import Mailgen
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
  return transporter.sendMail(mailOptions);
};


const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

     // Hash the OTP
     const hashedOTP = await bcrypt.hash(otp, 10);
     const tme = new Date()
     tme.setMinutes(tme.getMinutes()+10)


    await user.update({ otp: hashedOTP, timeExpire: tme }); // OTP expires in 10 minutes

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
    const { email, password, otp } = req.body;

    const user = await userData.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Invalid User" });
    }
    // Check if OTP matches
    const otpMatch = await bcrypt.compare(otp, user.otp);
    console.log(user.timeExpire);


    // Check if OTP has expired
    if (otpMatch && new Date() < user.timeExpire) {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      await user.update({password: hashedPassword, otp: null,timeExpire: null});
      return res.status(201).json({ message: "Password Reset Successfull" });
    }

    // Update user's password
    

    res.status(500).json({ error: "Invalid or Expired Otp" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).json({ error: "Failed to reset password" });
  }
};

module.exports = { forgetPassword, resetPassword };
