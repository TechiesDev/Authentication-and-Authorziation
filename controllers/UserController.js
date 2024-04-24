const { where } = require("sequelize");
const crypto = require("crypto");
const userData = require("../model/UserModel.js");
const jwt = require("jsonwebtoken");
const {
  isValidEmail,
  isValidPassword,
  isValidName,
} = require("../validation/Validation.js");

require("dotenv").config();
const sk = process.env.SK;

const createToken = (user) => {
  return jwt.sign({ userId: user._id }, sk, { expiresIn: "1h" });
};

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const UserRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = hashPassword(password);

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ error: "Password should have at least 8 characters" });
    }

    // Validate name
    if (!isValidName(name)) {
      return res.status(400).json({ error: "Invalid name format" });
    }

    const userregi = await userData.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = createToken(userregi);
    res.cookie("token", token, { httpOnly: true });
    res
      .status(201)
      .json({ token, userregi, message: res.__("create-message") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!isValidPassword(password)) {
    return res
      .status(400)
      .json({ error: "Password should have at least 8 characters" });
  }

  const hashedPassword = hashPassword(password);
  try {
    const user = await userData.findOne({
      where: { email, password: hashedPassword },
    });
    if (user && user.password === password) {
      const token = createToken(user);
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ token, user, message: res.__("login-message") });
    } else {
      res.status(401).json({ error: "Invalid User" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userData.findByPk(req.params.id);
    res.status(201).json({ user, message: res.__("find-message") });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const [updatedUser] = await userData.update(
      { name, email, password },
      { where: { id: req.params.id } }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ updatedUser, message: res.__("update-message") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userData.destroy({
      where: { id: req.params.id },
    });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: res.__("delete-message") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  UserRegistration,
  UserLogin,
  getUserById,
  updateUser,
  deleteUser,
};
