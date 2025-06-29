const { addYears } = require('date-fns/addYears');
const Employee = require('../models/employee.model'); // hoặc đúng đường dẫn bạn có
const { employeeDTO, employeeDTOQueryToEmployee } = require('../dtos/employee.dto');
const { CustomError } = require('../../error/customError');

exports.getEmployees = async ({ departmentId, keyword, deviceId }) => {
    const filter = {};
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
            .populate('device')
            .sort({ updatedAt: -1 });
        ;
        return employees.map(r => employeeDTO(r));
    } catch (error) {
        throw new Error('getEmployees.error: ' + error.message);
    }
};
exports.getEmployeeById = async (employeeId, deviceId) => {
    try {
        const employee = await Employee.findOne({ _id: employeeId, device: deviceId })
            .populate('department')
            .populate('position')
            .populate('shift')
            .populate('userId')
            .populate('device')
            .sort({ updatedAt: -1 });
        return employee;
    } catch (error) {
        throw new Error('getEmployeeById.error: ' + error.message);
    }
};
exports.addEmployee = async (deviceId,employeeData) => {
    try {
        employeeData.deviceId = deviceId; // Set deviceId from grantedAuthority
        const newEmployee = new Employee({
            ...employeeDTOQueryToEmployee(employeeData),
            registrationDate: addYears(new Date(), 0) // Set current date
        });
        const savedEmployee = await newEmployee.save();
        return employeeDTO(savedEmployee);
    } catch (error) {
        throw new Error('addEmployee.error: ' + error.message);
    }
}
exports.updateEmployeeById = async (employeeId, updateData) => {
    try {
        console.log("updateData: " + JSON.stringify(updateData));
        const updateDataWithId = employeeDTOQueryToEmployee(updateData);
        delete updateDataWithId._id; // Remove employeeId if it exists in updateData
        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateDataWithId, { new: true })
            .populate('department')
            .populate('position')
            .populate('shift')
            .populate('device');
        if (!updatedEmployee) {
            throw new CustomError('Employee not found or update failed',404);
        }
        return employeeDTO(updatedEmployee);
    } catch (error) {
        if (error instanceof CustomError) {
            throw error; // Re-throw custom errors
        }
        throw new Error('updateEmployeeById.error: ' + error.message);
    }
};
exports.deleteEmployeeById = async (employeeId) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
        if (!deletedEmployee) {
            throw new CustomError('Employee not found or delete failed',404);
        }
        return { message: 'Employee deleted successfully' };
    } catch (error) {
        if (error instanceof CustomError) {
            throw error; // Re-throw custom errors
        }
        throw new Error('deleteEmployeeById.error: ' + error.message);
    }
};