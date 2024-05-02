const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task1', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
    console.log("Model synced successfully");
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
module.exports = {dbConnection ,sequelize};
