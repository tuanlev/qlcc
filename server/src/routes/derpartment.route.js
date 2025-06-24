const departmentController = require("../controller/department.controller");

const departmentRoute = require("express").Router();
departmentRoute.get("/",departmentController.getDepartments);
departmentRoute.post("/",departmentController.addDepartment)
departmentRoute.get("/:departmentId",departmentController.getDepartmentsById);
departmentRoute.delete("/:departmentId",departmentController.deleteDepartment);
departmentRoute.patch("/:departmentId",departmentController.updateDepartmentById);
module.exports = departmentRoute;