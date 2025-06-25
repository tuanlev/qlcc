const { userDTOQueryToUser, userDTO } = require("../dtos/user.dto");
const User = require("../models/user.model");
const { hashPassword, verifyPassword } = require("../utils/passwordHash");

exports.LoadUserByUsername = async (username) => {
    try {
        return await User.findOne({username})
    } catch (e) {
        throw new Error("user.service.loaduserbyusername.error: "+e.message);
    }
}
exports.updateUserById = async (userId,user) => {
    try {
        return await User.findByIdAndUpdate(userId,userDTOQueryToUser(user),{new:true});
    } catch (e) {
        throw new Error("user.service.updateUser.error: "+e.message);
    }
}
exports.deleteUserById = async (userId) => {
    try {
        return userDTO(await User.findByIdAndDelete(userId));
    } catch (e) {
        throw new Error("user.service.deleteUserById.error: "+e.message);
    }
}
exports.addUser = async (user) => {
    try { 
        const newUser =  new User(userDTOQueryToUser(user));
        return userDTO(await newUser.save());
    } catch (e) {
        throw new Error("user.service.addUser.error: "+e.message);
    }
}
exports.getUsers = async ()=> {
    try {
        return (await User.find({})).map(r=>userDTO(r));
    } catch (e) {
        throw new Error("user.service.addUser.error: "+e.message);
    }
}
exports.getUserById = async (userId)=> {
    try {
        return userDTO(await User.findById(userId));
    } catch (e) {
        throw new Error("user.service.addUser.error: "+e.message);
    }
}
exports.login = async ({username,password}) => {
    try {
        const user = await User.findOne({username});
       if (!user) throw new Error("User not found");
       if (!verifyPassword(password, user.password)) throw new Error("Invalid password");
       return userDTO(user);
    } catch (e) {
        throw new Error("user.service.login.error: "+e.message);
    }
}