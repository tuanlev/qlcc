const Checkin = require("../models/checkin.model");
const { deviceDTO } = require("./device.dto");
const { employeeDTO } = require("./employee.dto");

exports.CheckinDTO = ({ device, timestamp, employee,faceBase64 }) => {
    const result = {};
    if (device) result.devide = deviceDTO(device);
    if (timestamp) result.timestamp = timestamp;
    if (employee) result.employee = employeeDTO(employee);
    if (faceBase64) result.faceBase64 = faceBase64;
    return result;
};