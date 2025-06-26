exports.shiftDTO = ({ _id, name, checkInHour, checkOutHour }) => {
    const result = {};
    if (_id) result.shiftId = _id;
    if (name) result.nameShift = name;
    if (checkInHour !== undefined) result.checkInHour = checkInHour;
    if (checkOutHour !== undefined) result.checkOutHour = checkOutHour;
    return result;
};

exports.shiftDTOtoShift = ({ shiftId, nameShift, checkInHour, checkOutHour }) => {
    const result = {};
    if (shiftId) result._id = shiftId;
    if (nameShift) result.name = nameShift;
    if (checkInHour !== undefined) result.checkInHour = checkInHour;
    if (checkOutHour !== undefined) result.checkOutHour = checkOutHour;
    return result;
};