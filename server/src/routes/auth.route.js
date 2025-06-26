const authController = require("../controller/auth.controller");

const authRoute = require("express").Router();

authRoute.post("/login",authController.login);
authRoute.post("/register",authController.register);

module.exports = authRoute;