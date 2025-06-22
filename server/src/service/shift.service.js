const Shift = require("../models/Shift.model");

const addShift = async (shift) => {
    try {
        const result = new Shift(shift);
        return await result.save()
    } catch (e) {
        console.log("shift.service.error: "+ e.message);
    }
}