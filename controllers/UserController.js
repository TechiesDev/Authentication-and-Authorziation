const { where, DATE } = require("sequelize");
const {validationResult} = require("express-validator")
const userData = require("../model/UserModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


require("dotenv").config();
const sk = process.env.SK;

const createToken = (user) => {
  return jwt.sign({ userId: user._id }, sk, { expiresIn: "1h" });
};

const homePage = async (req, res) => {
  res.send({message: res.__("MESSAGE")})
}


const UserRegistration = async (req, res) => {
  try {
    const { role ,name, email, phoneNumber, password} = req.body;

    const existingUser = await userData.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: res.__('signup.username_exists') });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let prefix = '';
    switch (role) {
      case 'admin':
        prefix = 'adm';
        break;
      case 'teacher':
        prefix = 'tch';
        break;
      case 'student':
        prefix = 'std';
        break;
      default:
        prefix = 'usr';
        break;
    }

    const id = `${prefix}`+(Date.now().toString(10)); 
    const userregi = await userData.create({ id, role,name, email, phoneNumber, password: hashedPassword });
    const token = createToken(email);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ token, userregi, message: res.__("signup.signup_success") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const UserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userData.findOne({ where: { email } });

    if (!user) 
      return res.status(404).json({ error: res.__('signin.invalid_credentials') });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) 
      return res.status(400).json({ error: res.__('signin.invalid_password') });

    const token = createToken(user.email);

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ token, user, message: res.__("signin.signin_success") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getUserById = async (req, res) => {
  try {
    const user = await userData.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: res.__('getById.user_not_found') });
    }
    res.status(201).json({ user,message: res.__('getById.usr_success') });
  } catch (error) {
    res.status(500).json({ error: error.message});
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
      return res.status(404).json({ message: res.__('update.user_not_found') });
    }
    res.status(200).json({ updatedUser, message: res.__('update.updated_success') });
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
      return res.status(404).json({ message: res.__('delete.user_not_found') });
    }
    res.status(200).json({ message: res.__('delete.deleted_success') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {homePage,UserRegistration,UserLogin,getUserById,updateUser,deleteUser};
