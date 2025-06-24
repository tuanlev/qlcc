const { departmentDTO } = require("./department.dto")

exports.positionDTO = ({ _id, name, department }) => {
    const result = {};
    if (_id) result.positionId = _id;
    if (name) result.namePosition = name;
    if (department) result.department = departmentDTO(department);
    return result;
};
exports.positionDTOQueryToPosition = ({ positionId, namePosition, departmentId }) => {
    const result = {};
    if (positionId) result._id = positionId;
    if (namePosition) result.name = namePosition;
    if (departmentId != undefined) result.department = null;
    if (departmentId)  result.department = departmentId
    return result;
};