const Employee = require("../models/employee.model")

const add_employee = async (employeeData) => {
    try {
        let employee = new Employee (employeeData);
        const result = await employee.save();   
        return result
    } catch (e) {
        console.log(e.message)
    }      
}

module.exports = {add_employee}