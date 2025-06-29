const { CustomError } = require("../../error/customError");
const { departmentDTO, departmentDTOtoDepartment } = require("../dtos/department.dto");
const Department = require("../models/department.model");

exports.getDepartments = async (keyword = null) => {
    try {
        let query = {};
        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } }
            ];
        }
        const result = await Department.find(query).sort({ updatedAt: -1 });
;
        return result.map(r => departmentDTO(r))
    } catch (e) {
        throw new CustomError("getDepartments.error: " + e.message);
    }
}
exports.getDepartmentById = async (departmentId) => {
    try {
        return departmentDTO(await Department.findById(departmentId));
    } catch (e) {
        throw new CustomError("getDepartmentById.error: " + e.message);
    }
}
exports.addDepartment = async (department) => {
    try {
        department = departmentDTOtoDepartment(department)
        return departmentDTO(await (new Department(department)).save());
    } catch (e) {
        throw new CustomError("addDepartment.error: " + e.message);

    }
}

exports.updateDepartmentById = async (deparmentId, department) => {
    try {
        department = departmentDTOtoDepartment(department)
        return departmentDTO(await Department.findByIdAndUpdate(deparmentId, department, { new: true }));
    } catch (e) {
        throw new CustomError("updateDepartmentById.error: " + e.message);

    }
}
exports.deleteDepartmentById = async (departmentId) => {
    try {
        return departmentDTO(await Department.findByIdAndDelete(departmentId));
    } catch (e) {
        throw new CustomError("deleteDepartmentById.error: " + e.message);
    }
}