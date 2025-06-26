const deviceService = require("../service/device.service");
exports.getDevices = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(404).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const devices = await deviceService.getDevices(req.query.keyword);
        res.status(200).json({
            message: "success",
            data: devices
        });
    } catch (e) {
        next(new Error("device.controller.getDevices.error: " + e.message));
    }
}
exports.addDevice = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(404).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const device = await deviceService.addDevice(req.body);
        res.status(201).json({
            message: "Device added successfully",
            data: device
        });
    } catch (e) {
        next(new Error("device.controller.addDevice.error: " + e.message));
    }
}
exports.getDeviceById = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(404).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const device = await deviceService.getDeviceById(req.params.deviceId);
        res.status(200).json({
            message: "success",
            data: device
        });
    } catch (e) {
        next(new Error("device.controller.getDeviceById.error: " + e.message));
    }
}
exports.updateDeviceById = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(404).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const device = await deviceService.updateDeviceById(req.params.deviceId, req.body);
        res.status(200).json({
            message: "Device updated successfully",
            data: device
        });
    } catch (e) {
        next(new Error("device.controller.updateDeviceById.error: " + e.message));
    }
}
exports.deleteDeviceById = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(404).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const result = await deviceService.deleteDeviceById(req.params.deviceId);
        res.status(200).json({
            message: "Device deleted successfully",
            data: result
        });
    }
    catch (e) {
        next(new Error("device.controller.deleteDeviceById.error: " + e.message));
    }
}
