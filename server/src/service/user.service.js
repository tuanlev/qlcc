const User = require("../models/user.model")

exports.LoadUserByUsername = async (username) => {
    try {
        return await User.findOne({username})
    } catch (e) {
        throw new Error("user.service.loaduserbyusername.error: "+e.message);
    }
}
exports.updateUser = async (user) => {
    try {
        return await User.findByIdAndUpdate(user._id,user,{new:true});
    } catch (e) {
        throw new Error("user.service.updateUser.error: "+e.message);
    }
}
exports.deleteUserById = async (userId) => {
    try {
        return await User.findByIdAndDelete(user._id);
    } catch (e) {
        throw new Error("user.service.deleteUserById.error: "+e.message);
    }
}
exports.addUser = async (user) => {
    try {
        const newUser =  await User(user);
        return await newUser.save();
    } catch (e) {
        throw new Error("user.service.addUser.error: "+e.message);
    }
}
exports.getUser = async ()=> {
    try {
        
        return await newUser.find({});
    } catch (e) {
        throw new Error("user.service.addUser.error: "+e.message);
    }
}