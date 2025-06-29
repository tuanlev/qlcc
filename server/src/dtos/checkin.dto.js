const Checkin = require("../models/checkin.model");
const { deviceDTO } = require("./device.dto");
const { employeeDTO } = require("./employee.dto");

exports.CheckinDTO = ({ _id,device, timestamp, employee,faceBase64 }) => {
    const result = {};
    if (_id) result.checkinId = _id;
    if (device) result.devide = deviceDTO(device);
    if (timestamp) result.timestamp = timestamp;
    if (employee) result.employee = employeeDTO(employee);
    if (faceBase64) result.faceBase64 = faceBase64;
    return result;
};