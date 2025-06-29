const userController = require("../controller/user.controller");

const userRoute = require("express").Router();
userRoute.get("/",userController.getUsers);
userRoute.delete("/:userId",userController.deleteUserById);
userRoute.patch("/:userId",userController.updateUserById);
userRoute.get("/reset/:userId",userController.resetPassword);
module.exports = userRoute;