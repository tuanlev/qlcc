exports.shiftDTO = ({ _id, name, checkInHour, checkOutHour }) => {
    const result = {};
    if (_id) result.shiftId = _id;
    if (name) result.shiftName = name;
    if (checkInHour !== undefined) result.checkInHour = checkInHour;
    if (checkOutHour !== undefined) result.checkOutHour = checkOutHour;
    return result;
};

exports.shiftDTOtoShift = ({ shiftId, shiftName, checkInHour, checkOutHour }) => {
    const result = {};
    if (shiftId) result._id = shiftId;
    if (shiftName) result.name = shiftName;
    if (checkInHour !== undefined) result.checkInHour = checkInHour;
    if (checkOutHour !== undefined) result.checkOutHour = checkOutHour;
    return result;
};