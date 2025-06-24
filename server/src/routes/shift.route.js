const { getShifts, addShift, deleteShift, updateShiftById, getShiftsById, deleteShiftById } = require("../controller/shift.controller");

const shiftRoute = require("express").Router();
shiftRoute.get("/",getShifts);
shiftRoute.post("/",addShift)
shiftRoute.get("/:shiftId",getShiftsById);
shiftRoute.delete("/:shiftId",deleteShiftById);
shiftRoute.patch("/:shiftId",updateShiftById);
module.exports = shiftRoute;