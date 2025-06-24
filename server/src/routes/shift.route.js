const { getShifts, addShift, deleteShift, updateShiftById, getShiftsById } = require("../controller/shift.controller");

const shiftRoute = require("express").Router();
shiftRoute.get("/shifts",getShifts);
shiftRoute.post("/shifts",addShift)
shiftRoute.get("/shifts/:shiftId",getShiftsById);
shiftRoute.delete("/shifts/:shiftId",deleteShift);
shiftRoute.patch("/shifts/:shiftId",updateShiftById);
module.exports = shiftRoute;