const { DataTypes } = require('sequelize');
const sequelize = require('../config/Sequlize.js');

const userData = sequelize.define('users', {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  timeExpire: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});

module.exports = userData;





// const getToken = (req, res) => {
//   try {
//     const { token } = req.query;

//     if (!token) {
//       return res
//         .status(400)
//         .json({ error: "Token not found in query parameters" });
//     }

//     res.cookie("token", token, { httpOnly: true }).json({ message: "Now you can login" });
//   } catch (error) {
//     console.error("Error getting token:", error);
//     res.status(500).json({ error: "Failed to get token" });
//   }
// };
