const express = require('express');
const userController = require('../controllers/UserController.js');
const router = express.Router();

router.post('/usersign', userController.UserRegistration);
router.post('/userlogin', userController.UserLogin);

router.get('/user', userController.HomeController);

// Protected routes requiring authentication middleware
router.get('/user/:id', userController.authenticateToken, userController.getUserById);
router.put('/user/:id', userController.authenticateToken, userController.updateUser);
router.delete('/user/:id', userController.authenticateToken, userController.deleteUser);

module.exports = router;
