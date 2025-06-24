exports.departmentDTO = ({ _id, name }) => {
    const result = {};
    if (_id) result.departmentId = _id;
    if (name) result.nameDepartment = name;
    return result;
};

exports.departmentDTOtoDepartment = ({ departmentId, nameDepartment }) => {
    const result = {};
    if (departmentId) result._id = departmentId;
    if (nameDepartment) result.name = nameDepartment;
    return result
};