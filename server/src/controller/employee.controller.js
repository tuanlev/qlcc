const { getEmployees } = require("../service/employee.service");

exports.getEmployees = async (req, res, next) => {
    console.log("employee.controller.getEmployees");

    try {
        const { departmentId, keyword } = req.query;
        const data = await getEmployees({ departmentId, keyword, deviceId: "device1" })
        res.status(201).json({
            data
        })
    } catch (e) {
        console.log("employee.controller.error: " + e.message);
        next(e);
    }

}