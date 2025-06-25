const { deviceDTO, deviceDTOtoDevice } = require("../dtos/device.dto");
const { find } = require("../models/checkin.model");
const Device = require("../models/device.model")

exports.addDevice = async (device) => {
    try {
        console.log("device.service.addDevice: ", device);
        return await (new Device(deviceDTOtoDevice(device))).save();
    } catch (e) {
        throw new Error("device.service.adddevice.error:" + e.message)
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
        throw new Error("device.service.getDeviceById.error:" + e.message)
    }
}
exports.updateDeviceById = async (deviceId, device) => {
    try {
        return deviceDTO(await Device.findByIdAndUpdate(deviceId, deviceDTOtoDevice(device), { new: true }));
    } catch (e) {
        throw new Error("device.service.updateDeviceById.error:" + e.message)
    }
}
exports.deleteDeviceById = async (deviceId) => {
    try {
        return deviceDTO(await Device.findByIdAndDelete(deviceId));
    } catch (e) {
        throw new Error("device.service.deleteDeviceById.error:" + e.message)
    }
}