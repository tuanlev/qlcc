const { CustomError } = require("../../error/customError");
const { CheckinDTO } = require("../dtos/checkin.dto");
const Checkin = require("../models/checkin.model");

exports.getCheckins = async (deviceId) => {
    try {
        if (!deviceId) {
            throw new CustomError("Device ID is required",400);
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
        throw new CustomError("getCheckins.error: " + e.message,500);
    }
}