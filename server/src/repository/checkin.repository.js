const Checkin = require("../models/checkin.model")

exports.addCheckin = async (checkinData) => {
    try {
        const checkin = new Checkin(checkinData);
        const dataB = await checkin.save();
        return await Checkin.findById(dataB._id).populate("employee");
    } catch(e) {
        throw new Error("checkin.repository.error :"+e.message);
    }
}