const express = require("express");
const userController = require("../controllers/UserController.js");
const authorization = require("../middleware/Authorization.js");
const {validator} = require("../middleware/Validator.js");
const passwordController = require("../controllers/Forget&ResetController.js");
const router = express.Router();

router.get('/',userController.homePage)

router.post("/usersign",validator, userController.UserRegistration);
router.post("/login",validator, userController.UserLogin);

// Protected routes requiring authorization middleware
router.get("/user/:id", authorization, userController.getUserById);
router.put("/user/:id", authorization, userController.updateUser);
router.delete("/user/:id", authorization, userController.deleteUser);

// forget and reset password
router.post("/forget", passwordController.forgetPassword);
router.patch("/reset",validator, passwordController.resetPassword);

module.exports = router;