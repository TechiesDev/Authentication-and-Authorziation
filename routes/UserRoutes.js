const express = require("express");
const userController = require("../controllers/UserController.js");
const authorization = require("../middleware/Authorization.js");
const {signupValidator,loginValidator,forgetValidator,resetValidator} = require("../middleware/Validator.js");
const passwordController = require("../controllers/Forget&ResetController.js");
const router = express.Router();

router.get('/',userController.homePage)

router.post("/signup",signupValidator, userController.UserRegistration);
router.post("/login",loginValidator, userController.UserLogin);

// Protected routes requiring authorization middleware
router.get("/user/:id", authorization, userController.getUserById);
router.put("/user/:id", authorization, userController.updateUser);
router.delete("/user/:id", authorization, userController.deleteUser);

// forget and reset password
router.post("/forget",forgetValidator, passwordController.forgetPassword);
router.patch("/reset",resetValidator, passwordController.resetPassword);

module.exports = router;