const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/Sequlize.js');

const userData = sequelize.define('users', {

  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    autoIncrement: false,
  },
  role: {
    type: DataTypes.ENUM("admin","teacher","student"),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
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