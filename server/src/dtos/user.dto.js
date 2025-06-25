const { deviceDTO } = require("./device.dto");

exports.userDTO = ({ _id, username, role, imageAvatar, device }) => {
  const result = {};
  if (_id) result.userId = _id;
  if (username) result.username = username;
  if (role) result.role = role;
  if (imageAvatar !== undefined) result.imageAvatar = imageAvatar;
  if (device) result.device = deviceDTO(device); // có thể populate riêng nếu cần
  return result;
};
exports.userDTOQueryToUser = ({userId,username,password,role,imageAvatar,deviceId}) => {
  const result = {};
  if (userId) result._id = userId;
  if (username) result.username = username;
  if (password) result.password = hashPassword(password);
  if (role) result.role =role;
  if (deviceId != undefined) result.device = (deviceId=="" || deviceId ==null)?null:deviceId;
  if (imageAvatar !=undefined) result.imageAvatar = (imageAvatar=="" || imageAvatar ==null)?null:imageAvatar;
  return result;
}

