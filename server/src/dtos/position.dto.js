const { departmentDTO } = require("./department.dto")

exports.positionDTO = ({ _id, name, department }) => {
    const result = {};
    if (_id) result.positionId = _id;
    if (name) result.positionName = name;
    if (department) result.department = departmentDTO(department);
    return result;
};
exports.positionDTOQueryToPosition = ({ positionId, positionName, departmentId }) => {
    const result = {};
    if (positionId) result._id = positionId;
    if (positionName) result.name = positionName;
    if (departmentId !== undefined) result.department = (departmentId =="")? null : departmentId; // Ensure department is null if not provided
    else result.department = null; // Ensure department is null if not provided
    return result;
};