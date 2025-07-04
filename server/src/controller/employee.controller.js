const employeeService= require("../service/employee.service");
const shiftRecordService = require("../service/shiftrecord.service")
exports.getEmployees = async (req, res, next) => {
    if (req.authRole != "admin") {
        res.status(401).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const { departmentId, keyword } = req.query;
        console.log("deviceId: " + req.grantedAuthority);
        const data = await employeeService.getEmployees({ departmentId, keyword, deviceId: req.grantedAuthority });
        res.status(200).json({
            message: "success",
            data
        })
    } catch (e) {
        console.log("employee.controller.error: " + e.message);
        next(e);
    }

}
exports.getEmployeeById = async (req, res, next) => {
    if (req.authRole != "admin") {
        res.status(401).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const { employeeId } = req.params;
        const data = await employeeService.getEmployees({ employeeId, deviceId: req.grantedAuthority });
        res.status(201).json({
            data
        })  
    } catch (e) {
        console.log("employee.controller.error: " + e.message);
        next(e);
    }   
}
exports.addEmployee = async (req, res, next) => {
    if (req.authRole != "admin") {
        res.status(401).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const employee = await employeeService.addEmployee(req.grantedAuthority,req.body);
        res.status(201).json({
            message: "Employee added successfully",
            data: employee
        });
    } catch (e) {
        next(e);
    }   
}
exports.updateEmployeeById = async (req, res, next) => {
    if (req.authRole != "admin") {
        res.status(401).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const { employeeId } = req.params;
        const updateData = req.body;
        const employee = await employeeService.updateEmployeeById(employeeId, updateData);
        res.status(200).json({
            message: "Employee updated successfully",
            data: employee
        });
    } catch (e) {
        next(e);
    }   
}
exports.deleteEmployeeById = async (req, res, next) => {
    if (req.authRole != "admin") {
        res.status(401).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const { employeeId } = req.params;
        await employeeService.deleteEmployeeById(employeeId);
        res.status(200).json({
            message: "Employee deleted successfully"
        });
    } catch (e) {
        next(e);
    }
}
exports.getShiftRecordByEmployee = async (req, res, next) => {
    if (req.authRole != "admin") {
        res.status(401).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const { employeeId } = req.params;
        const data = await shiftRecordService.getShiftRecordsWithFiltersByEmployee({ employeeId, deviceId: req.grantedAuthority,...req.params });
        res.status(201).json({
            data
        })  
    } catch (e) {
        console.log("employee.controller.error: " + e.message);
        next(e);
    }   
}