const authController = require("../controller/auth.controller");

const authRoute = require("express").Router();
authRoute.delete("/:userId",authController.deleteUserById);
authRoute.patch("/:userId",authController.updateUserById);
authRoute.post("/login",authController.login);
authRoute.post("/register",authController.register);

module.exports = authRoute;