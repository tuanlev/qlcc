const departmentService = require("../service/department.service")

exports.getDepartments = async (req, res, next) => {
    try {
        const {keyword} = req.query;
        const result = await departmentService.getDepartments();
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(new Error("department.controller.getDepartments.error: " + e.message));
    }
}
exports.addDepartment = async (req, res, next) => {
    try {
        const result = await departmentService.addDepartment(req.body);
        res.status(200).json({
            data: result,
            message: "success"
        })
    } catch (e) {
        next(new Error("department.controller.addDepartment.error: " + e.message));

    }
}
exports.getDepartmentsById = async (req, res, next) => {
    try {
        const { departmentId } = req.params;
        const result = await departmentService.getDepartmentById(departmentId);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(new Error("department.controller.getDepartmentsById.error: " + e.message));
    }
}
exports.deleteDepartment = async (req, res, next) => {
    try {
        const { departmentId } = req.params;
        const result = await departmentService.deleteDepartmentById(departmentId);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(new Error("department.controller.getDepartmentsById.error: " + e.message));
    }
}
exports.updateDepartmentById = async (req, res, next) => {
    try {
        const { departmentId } = req.params;
        const result = await departmentService.updateDepartmentById(departmentId,req.body);
        res.status(200).json({
            data: result,
            message: "success"
        })
    }
    catch (e) {
        next(new Error("department.controller.getDepartmentsById.error: " + e.message));
    }
}