const { departmentDTO } = require("./department.dto");
const { positionDTO } = require("./position.dto");
const { shiftDTO } = require("./shift.dto");
const { userDTO } = require("./user.dto");
const { deviceDTO } = require("./device.dto");

exports.employeeDTO = ({
  _id,
  fullName,
  email,
  phone,
  department,
  position,
  shift,
  registrationDate,
  faceBase64,
  device,
  userId,
  faceEmbedding

}) => {
  const result = {};
  if (_id) result.employeeId = _id;
  if (fullName) result.fullName = fullName;
  if (email) result.email = email;
  if (phone) result.phone = phone;
  if (department) result.department = departmentDTO(department);
  if (position) result.position = positionDTO(position);
  if (shift) result.shift = shiftDTO(shift);
  if (registrationDate) result.registrationDate = registrationDate;
  if (faceBase64) result.faceBase64 = faceBase64;
  if (device) result.device = deviceDTO(device);
  if (userId) result.user = userDTO(userId);
  if (faceEmbedding) result.faceEmbedding = faceEmbedding;
  return result;
};
exports.employeeDTOQueryToEmployee = ({
  employeeId,
  fullName,
  email,
  phone,
  departmentId,
  positionId,
  shiftId,
  registrationDate,
  faceBase64,
  deviceId
}) => {
  const result = {};
  if (employeeId) result._id = employeeId;
  if (fullName) result.fullName = fullName;
  if (email) result.email = email;
  if (phone) result.phone = phone;
  if (departmentId!==undefined && departmentId !=="") result.department = departmentId ; else result.department = null;
  if (positionId!==undefined &&positionId!=="") result.position = positionId;else result.position = null;
  if (shiftId!==undefined&&shiftId!=="") result.shift = shiftId; else result.shift = null;
  if (registrationDate) result.registrationDate = registrationDate;
  if (faceBase64) result.faceBase64 = faceBase64;
  if (deviceId!==undefined) result.device = deviceId;
  return result;
};