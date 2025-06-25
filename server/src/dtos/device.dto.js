exports.deviceDTO = ({ _id, name }) => {
    const result = {};
    if (_id) result.deviceId = _id;
    if (name) result.nameDevice = name;
    else result.nameDevice = "";
    return result;
};
exports.deviceDTOtoDevice = ({deviceId,nameDevice}) => {
    const result = {}
    if (deviceId) result._id = deviceId;
    if (nameDevice!==undefined) result.name = (nameDevice =="")?null:nameDevice ;
    return result;
}