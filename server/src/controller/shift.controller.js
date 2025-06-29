const { getShifts, getShiftById, updateShift, addShift, deleteShiftById } = require("../service/shift.service")

exports.getShifts = async (req, res, next) => {
      if (req.authRole != "admin") {
            res.status(401).json({
                message: "Unauthorized: You do not have permission to access this resource"
            });
            return;
        }
    try {
        const { keyword } = req.query;
        const result = await getShifts(keyword);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(e);
    }
}
exports.addShift = async (req, res, next) => {
      if (req.authRole != "admin") {
            res.status(401).json({
                message: "Unauthorized: You do not have permission to access this resource"
            });
            return;
        }
    try {
        const result = await addShift(req.body);
        res.status(200).json({
            data: result,
            message: "success"
        })
    } catch (e) {
        next(e);

    }
}
exports.getShiftsById = async (req, res, next) => {
      if (req.authRole != "admin") {
            res.status(401).json({
                message: "Unauthorized: You do not have permission to access this resource"
            });
            return;
        }
    try {
        const { shiftId } = req.params;
        const result = await getShiftById(shiftId);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(e);
    }
}
exports.deleteShiftById = async (req, res, next) => {
      if (req.authRole != "admin") {
            res.status(401).json({
                message: "Unauthorized: You do not have permission to access this resource"
            });
            return;
        }
    try {
        const { shiftId } = req.params;
        const result = await deleteShiftById(shiftId);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(e);
    }
}
exports.updateShiftById = async (req, res, next) => {
      if (req.authRole != "admin") {
            res.status(401).json({
                message: "Unauthorized: You do not have permission to access this resource"
            });
            return;
        }
    try {
        const { shiftId } = req.params;
        const result = await updateShift(shiftId, req.body);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(e);
    }
}