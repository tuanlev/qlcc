const Shift = require("../models/Shift.model");

exports.addShift = async (shift) => {
    try {
        const result = new Shift(shift);
        return await result.save()
    } catch (e) {
        console.log("shift.service.error: "+ e.message);
    }
}
exports.deleteShiftById = async (shiftId) => {
    try {
        return await Shift.findOneAndDelete({_id:shiftId});
    } catch (e) {
        console.log("shift.service.error: "+ e.message);
    }
}
