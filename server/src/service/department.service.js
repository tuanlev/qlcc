const Department = require("../models/department.model");

exports.getDepartments = async () => {
    try {
        return await Department.find();
    } catch (e) {
        throw new Error("department.service.getDeparments.error: "+ e.message);
    }
} 
exports.updateDepartment = async (department) => {
    try {
        return await Department.findByIdAndUpdate(department.id,department);
    } catch (e) {
        throw new Error("department.service.updateDepartmentById.error: "+ e.message);

    }
}
exports.deleteDepartmentById = async (departmentId) => {
    try {
        return await Department.findOneAndDelete(departmentId);
    } catch (e) {
        throw new Error("department.service.updateDepartmentById.error: "+ e.message);
    }
}