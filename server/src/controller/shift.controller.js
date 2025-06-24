const { getShifts, getShiftById, updateShift, addShift, deleteShiftById } = require("../service/shift.service")

exports.getShifts = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const result = await getShifts(keyword);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(new Error("shift.controller.getShifts.error: " + e.message));
    }
}
exports.addShift = async (req, res, next) => {
    try {
        const result = await addShift(req.body);
        res.status(200).json({
            data: result,
            message: "success"
        })
    } catch (e) {
        next(new Error("shift.controller.addShift.error: " + e.message));

    }
}
exports.getShiftsById = async (req, res, next) => {
    try {
        const { shiftId } = req.params;
        const result = await getShiftById(shiftId);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(new Error("shift.controller.getShiftsById.error: " + e.message));
    }
}
exports.deleteShiftById = async (req, res, next) => {
    try {
        const { shiftId } = req.params;
        const result = await deleteShiftById(shiftId);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(new Error("shift.controller.getShiftsById.error: " + e.message));
    }
}
exports.updateShiftById = async (req, res, next) => {
    try {
        const { shiftId } = req.params;
        const result = await updateShift(shiftId, req.body);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(new Error("shift.controller.getShiftsById.error: " + e.message));
    }
}