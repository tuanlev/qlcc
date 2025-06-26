const deviceRouter = require("express").Router();
const { getDevices, addDevice, deleteDeviceById, updateDeviceById, getDeviceById } = require("../controller/device.controller");
deviceRouter.get("/", getDevices);
deviceRouter.post("/", addDevice);
deviceRouter.get("/:deviceId", getDeviceById);
deviceRouter.delete("/:deviceId", deleteDeviceById);
deviceRouter.patch("/:deviceId", updateDeviceById);
module.exports = deviceRouter;