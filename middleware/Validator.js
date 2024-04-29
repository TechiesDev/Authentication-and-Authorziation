const {body} = require('express-validator');

const validator = [
    body('name').notEmpty().escape().withMessage('Name is required'),
    body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage('Email is required'),
    body('phoneNumber').notEmpty().withMessage('Number is required'),
    body('password').notEmpty().withMessage('Password is required')
]

module.exports = {validator}