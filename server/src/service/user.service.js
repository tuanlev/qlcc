const { userDTOQueryToUser, userDTO } = require("../dtos/user.dto");
const { findByIdAndUpdate } = require("../models/shift.model");
const User = require("../models/user.model");
const employeeRepository = require("../repository/employee.repository");
const { hashPassword, verifyPassword } = require("../utils/passwordHash");

exports.LoadUserByUsername = async (username) => {
    const adminUsername = process.env.SUPERADMIN || "superadmin";
    if (username === adminUsername) {
        return userDTO({
            username: adminUsername,
            role: "superadmin",
            employee: null,
            device: null,
        });
    }
    try {
        return await User.findOne({ username })
    } catch (e) {
        console.error("user.service.LoadUserByUsername.error: ", e.message);
        throw new Error("username not exist");
    }
}
exports.updateUserById = async (userId, user) => {
    try {
        const userData = await User.findOneAndUpdate({
            _id: userId,
            role: "admin"
        }, userDTOQueryToUser(user), { new: true }).populate("employee").populate("device");
        if (!userData) throw new Error("User not found");
        console.log(userData)
        return userDTO(userData);
    } catch (e) {
        throw new Error("update user failed " + e.message);
    }
}
exports.deleteUserById = async (userId) => {
    try {
        return userDTO(await User.findOneAndDelete({
            _id: userId,
            role: "admin"
        }));
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
exports.getUsers = async ({ keyword }) => {
    try {
        const query = { role: "admin" };

        if (keyword) {
            query.username = { $regex: keyword, $options: "i" };
        }

        return (await User.find(query).populate({
            path: "employee",
            populate: [
                { path: "department" },
                { path: "device" },
                { path: "shift" },
                { path: "position" }
            ]
        }).populate("device").sort({updateAt:-1})

        ).map(r => userDTO(r));
    } catch (e) {
        throw new Error("user.service.getUsers.error: " + e.message);
    }
}
exports.getUserById = async (userId) => {
    try {
        return userDTO(await User.findOne({
            _id: userId,
            role: "admin"
        }));
    } catch (e) {
        throw new Error("user.service.addUser.error: " + e.message);
    }
}
exports.login = async ({ username, password }) => {
    const adminUsername = process.env.SUPERADMIN || "superadmin";
    const adminPassword = process.env.SUPERADMIN_PASSWORD || "1234568";
    if (username === adminUsername && password === adminPassword) {
        return userDTO({
            username: adminUsername,
            role: "superadmin",
            employee: null,
            device: null,
        });
    }
    try {
        const user = await User.findOne({ username })
            .populate([
                {
                    path: "employee",
                    populate: [
                        { path: "department" },
                        { path: "device" },
                        { path: "shift" },
                        { path: "position" }
                    ]
                },
                {
                    path: "device"
                }
            ]);


        if (!user) throw new Error("User not found");
        if (!verifyPassword(password, user.password)) throw new Error("Invalid password");
        console.log("user.service.login: ", user);
        return userDTO(user);
    } catch (e) {
        throw new Error("service.login.error: " + e.message);
    }
}
exports.resetPassword = async ( userId ) => {
    const pass = process.env.DEFAULT_PASSWORD || "12345678";
    const hash = hashPassword(pass);
   await User.findByIdAndUpdate(userId, { password: hash },{new:true})
    return;

}