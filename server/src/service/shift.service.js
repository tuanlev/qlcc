const { shiftDTO, shiftDTOtoShift } = require("../dtos/shift.dto");
const Shift = require("../models/shift.model");

exports.getShiftById = async (shiftId) => {
    try {
        return shiftDTO(await Shift.findById({ _id: shiftId }));
    } catch (e) {
        throw new Error(("getShiftById.error: " + e.message));
    }
}
exports.getShifts = async (keyword = null) => {
    try {
        let query = {};
        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } }];
        }
        let result = await Shift.find(query).sort({ updatedAt: -1 });
        return result.map(r => shiftDTO(r));
    } catch (e) {
        throw new Error(("getShifts.error: " + e.message));
    }
}
exports.addShift = async (shift) => {
    try {
        shift = shiftDTOtoShift(shift)
        const result = new Shift(shift);
        return shiftDTO(await result.save())
    } catch (e) {
        throw new Error(("service.error: " + e.message));
    }
}
exports.deleteShiftById = async (shiftId) => {
    try {
        return shiftDTO(await Shift.findByIdAndDelete({ _id: shiftId }));
    } catch (e) {
        throw new Error(("deleteShiftById.error: " + e.message));
    }
}
exports.updateShift = async (shiftId, shift) => {
    try {
        shift = shiftDTOtoShift(shift)
        return shiftDTO(await Shift.findByIdAndUpdate({ _id: shiftId }, shift, { new: true }));
    } catch (e) {
        throw new Error(("deleteShiftById.error: " + e.message));
    }
}