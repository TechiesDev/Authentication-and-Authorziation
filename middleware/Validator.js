
const { body, validationResult } = require('express-validator');

const valid = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();

}

const signupValidator = [
    body('name').notEmpty().escape().withMessage('Name is required'),
    body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage('Input correct mail'),
    body('phoneNumber').notEmpty().isLength({ min: 10, max: 10}).matches(/^[0-9]+$/).withMessage('Number is required'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage("put atleast six character"),
    body('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/).withMessage("Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."),
    valid
]



const loginValidator = [
    body('email').notEmpty().withMessage("Fill email").isEmail().normalizeEmail().escape().trim().withMessage('Input correct mail'),
    body('password').notEmpty().withMessage("Fill the password").isLength({ min: 6 }).withMessage("Incorrect Password"),
    valid
]

const forgetValidator = [
    body('email').notEmpty().withMessage("Fill email").isEmail().normalizeEmail().escape().trim().withMessage('Input correct mail'),
    valid
]


const resetValidator = [
    body('email').notEmpty().withMessage("Fill email").isEmail().normalizeEmail().escape().trim().withMessage('Input correct mail'),
    body('password').notEmpty().withMessage("Fill the password").isLength({ min: 6 }).withMessage("Incorrect Password"),
    body('otp').notEmpty().withMessage("Fill the otp").isLength({ min: 6 }).withMessage("Incorrect OTP"),
    valid
]



module.exports = {signupValidator,loginValidator,forgetValidator,resetValidator}