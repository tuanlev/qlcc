const authController = require("../controller/auth.controller");

const departmentRoute = require("express").Router();
departmentRoute.post("/login",authController.login);
departmentRoute.post("/register",authController.register);
departmentRoute.delete("/:userId",authController.deleteUserById);
departmentRoute.patch("/:userId",authController.updateUserById);
module.exports = departmentRoute;