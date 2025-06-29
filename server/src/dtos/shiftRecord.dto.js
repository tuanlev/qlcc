const { employeeDTO } = require("./employee.dto");
const { shiftDTO } = require("./shift.dto");

exports. shiftRecordDTO = ({ _id, employee,  checkIn, checkOut, checkInStatus, checkOutStatus, shift }) => {
    const result = {};
    if (_id) result.shiftRecordId = _id;
    if (employee) result.employee = employeeDTO(employee);
    if (checkIn) result.checkInTime = checkIn.timestamp;
    if (checkInStatus) result.checkInStatus = checkInStatus;
    if (checkOut) result.checkOutTime = checkOut.timestamp;
    if (checkOutStatus) result.checkOutStatus = checkOutStatus;
    if (shift) result.shift = shiftDTO(shift);
    return result;
}