const { addYears } = require('date-fns/addYears');
const Employee = require('../models/employee.model'); // hoặc đúng đường dẫn bạn có
const { employeeDTO } = require('../dtos/employee.dto');

exports.getEmployees = async ({ departmentId, keyword, deviceId }) => {
    const filter = {};
    console.log(deviceId);
    if (keyword) {
        filter.$or = [
            { fullName: { $regex: keyword, $options: 'i' } },
            { _id: { $regex: keyword, $options: 'i' } }
        ];

    }

    if (departmentId) {
        filter.department = departmentId;
    }
    if (deviceId) {
        filter.device = deviceId;
    } else filter.device = "";
    try {
        const employees = await Employee.find(filter)
            .populate('department')
            .populate('position')
            .populate('shift')
            .populate('device');
        if (!employees || employees.length === 0) {
            throw new Error('No employees found');
        }
        return employees.map(r=>employeeDTO(r));
    } catch (error) {
        throw new Error('employee.service.error: ' + error.message);
    }
};
exports.getEmployeeById = async (employeeId, deviceId) => {
    try {
        const employee = await Employee.findOne({ _id: employeeId, device: deviceId })
            .populate('department')
            .populate('position')
            .populate('shift')
            .populate('userId')
            .populate('device');
        if (!employee) {
            throw new Error('Employee not found');
        }
        return employee;
    } catch (error) {
        throw new Error('employee.service.getEmployeeById.error: ' + error.message);
    }
};
