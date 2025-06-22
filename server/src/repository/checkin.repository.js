const Checkin = require("../models/checkin.model")

exports.addCheckin = async (checkinData) => {
    try {
        const checkin = new Checkin(checkinData);
        return await checkin.save()
    } catch(e) {
        throw new Error("checkin.repository.error :"+e.message);
    }
}