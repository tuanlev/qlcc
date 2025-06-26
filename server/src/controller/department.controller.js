const departmentService = require("../service/department.service")

exports.getDepartments = async (req, res, next) => {
    if (req.authRole != "admin") {
        res.status(404).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    try {

        const { keyword } = req.query;
        const result = await departmentService.getDepartments(keyword);
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

        if (req.authRole != "admin") {
            res.status(404).json({
                message: "Unauthorized: You do not have permission to access this resource"
            });
            return;
        }
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
     if (req.authRole != "admin") {
            res.status(404).json({
                message: "Unauthorized: You do not have permission to access this resource"
            });
            return;
        }
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
         if (req.authRole != "admin") {
            res.status(404).json({
                message: "Unauthorized: You do not have permission to access this resource"
            });
            return;
        }
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
         if (req.authRole != "admin") {
            res.status(404).json({
                message: "Unauthorized: You do not have permission to access this resource"
            });
            return;
        }
        try {
            const { departmentId } = req.params;
            const result = await departmentService.updateDepartmentById(departmentId, req.body);
            res.status(200).json({
                data: result,
                message: "success"
            })
        }
        catch (e) {
            next(new Error("department.controller.getDepartmentsById.error: " + e.message));
        }
    }