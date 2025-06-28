const { deviceDTO, deviceDTOtoDevice } = require("../dtos/device.dto");
const { find } = require("../models/checkin.model");
const Device = require("../models/device.model")

exports.addDevice = async (device) => {
    try {
        const existingDevice = await Device.findById(device._id);
        if (existingDevice) {
            throw new Error("Device with this ID already exists");
        }
        return await (new Device(deviceDTOtoDevice(device))).save();
    } catch (e) {
        throw new Error("adddevice.error:" + e.message)
    }

}
exports.getDevices = async (keyword = null) => {
    let query = {}
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: 'i' } }
        ];
    }
    return await Device.find(query);
}
exports.getDeviceById = async (deviceId) => {
    try {
        return deviceDTO(await Device.findById(deviceId));
    } catch (e) {
        throw new Error("getDeviceById.error:" + e.message)
    }
}
exports.updateDeviceById = async (deviceId, device) => {
    try {
        return deviceDTO(await Device.findByIdAndUpdate(deviceId, deviceDTOtoDevice(device), { new: true }));
    } catch (e) {
        throw new Error("updateDeviceById.error:" + e.message)
    }
}
exports.deleteDeviceById = async (deviceId) => {
    try {
        return deviceDTO(await Device.findByIdAndDelete(deviceId));
    } catch (e) {
        throw new Error("deleteDeviceById.error:" + e.message)
    }
}