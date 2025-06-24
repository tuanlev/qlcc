const { getShifts, addShift, deleteShift, updateShiftById } = require("../controller/shift.controller");

const shiftRoute = require("express").Router();
shiftRoute.get("/shifts",getShifts);
shiftRoute.post("/shifts",addShift)
shiftRoute.delete("/shifts/:shiftId",deleteShift);
shiftRoute.patch("/shifts/:shiftId",updateShiftById);
module.exports = shiftRoute;