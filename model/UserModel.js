const { DataTypes } = require('sequelize');
const sequelize = require('../confir/Sequlize.js');

const userData = sequelize.define('users', {
this is dubey
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
  }
});

module.exports = userData;
