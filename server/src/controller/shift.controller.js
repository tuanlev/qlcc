const { getShifts, getShiftById,updateShift } = require("../service/shift.service")

exports.getShifts = async (req, res, next) => {
    try {
        const result = await getShifts();
        res.status(200).json({
            data: result
        })
    }
    catch (e) {
        console.log("shift.controller.error: " + e.message);
        next(e)
    }
}

exports.getShiftsById = async (req, res, next) => {
    try {
        const {shiftId} = req.params;
        const result = await getShiftById(shiftId);
        res.status(200).json({
            data: result
        })
    }
    catch (e) {
        console.log("shift.controller.error: " + e.message);
        next(e)
    }
}
exports.updateShiftById = async (req, res, next) => {
    try {
        const {shiftId} = req.params;
        const result = await this.updateShift(shiftId);
        res.status(200).json({
            data: result
        })
    }
    catch (e) {
        console.log("shift.controller.error: " + e.message);
        next(e)
    }
}