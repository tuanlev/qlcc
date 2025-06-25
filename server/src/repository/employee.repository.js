const Employee = require("../models/employee.model")

const addEmployee = async (employeeData) => {
    try {
        let employee = new Employee(employeeData);
        const result = await employee.save();
        return result
    } catch (e) {
        throw new Error("employee.repository.addEmployee.error" + e.message);
    }
}
const deleteEmployeeById = async (employeeId) => {
    try {
        let employee = await Employee.findByIdAndDelete(employeeId);
        return employee;
    } catch (e) {
        throw new Error("employee.repository.deleteEmployeeById.error" + e.message);
    }
}
const editEmployee = async (employeeData) => {
    try {
        let employee = await Employee.findByIdAndUpdate(employeeData._id, employeeData, { new: true });
        return employee;
    }
    catch (e) {
        throw new Error("employee.repository.editEmployee.error" + e.message);
    }
}
const getEmployeeById = async (employeeId) => {
    try {
        const employee = await Employee.findById(employeeId)
            .populate('department')
            .populate('position')
            .populate('shift')
            .populate('userId')
            .populate('device');
        if (!employee) {
            throw new Error('Employee not found');
        }
        return employeeDTO(employee);
    } catch (error) {
        throw new Error('employee.service.getEmployeeById.error: ' + error.message);
    }
};

module.exports = {
    addEmployee,
    deleteEmployeeById,
    editEmployee,
    getEmployeeById
}
