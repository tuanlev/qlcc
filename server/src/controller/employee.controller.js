const { getEmployees } = require("../service/employee.service");

exports.getEmployees = async (req, res, next) => {
    if (req.authRole != "admin") {
        res.status(404).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const { departmentId, keyword } = req.query;
        console.log("deviceId: " + req.grantedAuthority);
        const data = await getEmployees({ departmentId, keyword, deviceId: req.grantedAuthority });
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
        res.status(404).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {
        const { employeeId } = req.params;
        const data = await getEmployees({ employeeId, deviceId: req.grantedAuthority });
        res.status(201).json({
            data
        })  
    } catch (e) {
        console.log("employee.controller.error: " + e.message);
        next(e);
    }   
}
