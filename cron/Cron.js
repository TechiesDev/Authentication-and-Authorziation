const cron = require('node-cron');
const {clearOldOtp} = require('./Task');


cron.schedule('0 0 * * *',()=>{
    console.log('Checking and Clearing old OTP');
    clearOldOtp()
});