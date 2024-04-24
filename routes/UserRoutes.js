const express = require("express");
const userController = require("../controllers/UserController.js");
const authorization = require("../middleware/Authorization.js");
const router = express.Router();
const passwordController = require("../controllers/Forget&ResetController.js");

router.post("/usersign", userController.UserRegistration);
router.post("/userlogin", userController.UserLogin);

// Protected routes requiring authorization middleware
router.get("/user/:id", authorization, userController.getUserById);
router.put("/user/:id", authorization, userController.updateUser);
router.delete("/user/:id", authorization, userController.deleteUser);

// forget and reset password
router.post("/forget", passwordController.forgetPassword);
router.patch("/reset", passwordController.resetPassword);

module.exports = router;