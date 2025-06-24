const { getShifts, addShift, deleteShift, updateShiftById, getShiftsById } = require("../controller/shift.controller");

const shiftRoute = require("express").Router();
shiftRoute.get("/",getShifts);
shiftRoute.post("/",addShift)
shiftRoute.get("/:shiftId",getShiftsById);
shiftRoute.delete("/:shiftId",deleteShift);
shiftRoute.patch("/:shiftId",updateShiftById);
module.exports = shiftRoute;