const checkinController = require("../controller/checkin.controller");

const checkinRoute = require("express").Router();

checkinRoute.get("/",checkinController.getCheckins);
module.exports = checkinRoute;