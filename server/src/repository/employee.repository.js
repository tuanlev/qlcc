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

module.exports = {
    addEmployee,
    deleteEmployeeById,
    editEmployee
}
