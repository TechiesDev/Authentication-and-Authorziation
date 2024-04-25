const User = require('../model/UserModel')
const { Sequelize } = require('sequelize')


async function clearOldOtp(){
    const timeBefore = new Date()

    const result = await User.update(
        {otp: null, timeExpire: null},
        {where: {timeExpire: {[Sequelize.Op.lt]: timeBefore}}}
    )
    console.log(`Clear otp in these row:- ${result}`,timeBefore)
}

module.exports = {clearOldOtp};