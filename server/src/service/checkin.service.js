const { CheckinDTO } = require("../dtos/checkin.dto");
const Checkin = require("../models/checkin.model");

exports.getCheckins = async (deviceId) => {
    try {
        if (!deviceId) {
            throw new Error("Device ID is required");
        }
        let checkins = await Checkin.find({ device: deviceId })
            .populate([
                {
                    path: "employee",
                    populate: [
                        { path: "department" },
                        { path: "position" },
                        { path: "shift" }
                    ]
                },
                {
                    path: "device"
                }
            ]).sort({ timestamp: -1}).limit(20)  ;
        checkins = checkins.map(checkin => CheckinDTO(checkin));
        return checkins;
    } catch (e) {
        throw new Error("getCheckins.error: " + e.message);
    }
}