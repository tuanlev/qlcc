exports.departmentDTO = ({ _id, name }) => {
    const result = {};
    if (_id) result.departmentId = _id;
    if (name) result.departmentName = name;
    return result;
};

exports.departmentDTOtoDepartment = ({ departmentId, departmentName }) => {
    const result = {};
    if (departmentId) result._id = departmentId;
    if(departmentName !==undefined) result.name = (departmentName)?departmentName:null
    return result
};