const {body} = require('express-validator');

const validator = [
    body('name').notEmpty().escape().withMessage('Name is required'),
    body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage('Input correct mail'),
    body('phoneNumber').notEmpty().isLength({ min: 10, max: 10}).matches(/^[0-9]+$/).withMessage('Number is required'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage("put atleast six character"),
    body('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/).withMessage("Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.")

]

module.exports = {validator}