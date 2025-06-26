const { userDTOQueryToUser, userDTO } = require("../dtos/user.dto");
const User = require("../models/user.model");
const employeeRepository = require("../repository/employee.repository");
const { hashPassword, verifyPassword } = require("../utils/passwordHash");

exports.LoadUserByUsername = async (username) => {
    try {
        return await User.findOne({ username })
    } catch (e) {
        console.error("user.service.LoadUserByUsername.error: ", e.message);
        throw new Error("username not exist");
    }
}
exports.updateUserById = async (userId, user) => {
    try {
        const userData = await User.findByIdAndUpdate(userId, userDTOQueryToUser(user), { new: true });
        if (!userData) throw new Error("User not found");
        return userDTO(userData);
    } catch (e) {
        throw new Error("update user failed " + e.message);
    }
}
exports.deleteUserById = async (userId) => {
    try {
        return userDTO(await User.findByIdAndDelete(userId));
    } catch (e) {
        throw new Error("delete user failed " + e.message);
    }
}
exports.addUser = async (user) => {
    const userData = userDTOQueryToUser(user);
    try {
        if (await this.LoadUserByUsername(userData.username)) {
            throw new Error("Username already exists");
        }
    } catch (e) {
        throw new Error(e.message);
    }
    try {
        const newUser = new User(userDTOQueryToUser(user));
        return userDTO(await newUser.save());
    } catch (e) {
        throw new Error("register failed " + e.message);
    }
}
exports.getUsers = async () => {
    try {
        return (await User.find({}).populate({
            path: "employee",
            populate: [
                { path: "department" },
                { path: "device" },
                { path: "shift" },
                { path: "position" }
            ]
        })

        ).map(r => userDTO(r));
    } catch (e) {
        throw new Error("user.service.getUsers.error: " + e.message);
    }
}
exports.getUserById = async (userId) => {
    try {
        return userDTO(await User.findById(userId));
    } catch (e) {
        throw new Error("user.service.addUser.error: " + e.message);
    }
}
exports.login = async ({ username, password }) => {
    try {
        const user = await User.findOne({ username }).populate("employee");
        if (!user) throw new Error("User not found");
        if (!verifyPassword(password, user.password)) throw new Error("Invalid password");
        return userDTO(user);
    } catch (e) {
        throw new Error("user.service.login.error: " + e.message);
    }
}