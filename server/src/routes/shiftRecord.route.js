const { getShiftRecords } = require("../controller/shiftRecord.controller");

const shiftRecordRoute = require("express").Router();
shiftRecordRoute.get("/",getShiftRecords);

module.exports = shiftRecordRoute;