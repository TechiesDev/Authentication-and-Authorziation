const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task1', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
