const User = require("../models/user.model")

exports.LoadUserByUsername = async (username) => {
    try {
        return await User.findOne({username})
    } catch (e) {
        throw new Error("user.service.loaduserbyusername.error: "+e.message);
    }
}