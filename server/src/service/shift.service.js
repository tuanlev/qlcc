const Shift = require("../models/shift.model");

exports.getShiftById = async (shiftId) => {
    try {
        return await Shift.findById({_id:shiftId});
    } catch (e) {
        console.log("shift.service.error: "+ e.message);
    }
}
exports.getShifts = async () => {
    try {
        return await Shift.findById();
    } catch (e) {
        console.log("shift.service.error: "+ e.message);
    }
}
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
        return await Shift.findByIdAndDelete({_id:shiftId});
    } catch (e) {
        console.log("shift.service.error: "+ e.message);
    }
}
exports.updateShift = async (shift) => {
    try {
        return await Shift.findByIdAndUpdate({_id:shift._id},shift,{new:true});
    } catch (e) {
        console.log("shift.service.error: "+ e.message);
    } 
}