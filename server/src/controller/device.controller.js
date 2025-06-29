const deviceService = require("../service/device.service");
exports.getDevices = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(401).json({
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
        next(e);
    }
}
exports.addDevice = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(401).json({
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
        next(e);
    }
}
exports.getDeviceById = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(403).json({
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
        next(e);
    }
}
exports.updateDeviceById = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(403).json({
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
        next(e);
    }
}
exports.deleteDeviceById = async (req, res, next) => {
    if (req.authRole != "superadmin") {
        res.status(403).json({
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
        next(e);
    }
}
