const userService = require("../service/user.service");
const {decode, encode} = require("../utils/jwtUtils");
exports.updateUserById = async (req, res) => {
    
    const {userId} = req.params;
    if (!userId) {
        res.status(404).json({
            message: "User ID is required"
        });
        return;
    }
    if (!(req.authRole == "superadmin" ||  req.user?.userId !== userId)) {
        res.status(403).json({
            message: "Forbidden: You do not have permission to update users"
        });
        return;
    }
    try {
        const user = await userService.updateUserById(userId, req.body);
        res.status(200).json({
            message: "User updated successfully",
            data: user
        });
    } catch (e) {
        res.status(500).json({
            message: "Update failed",
            error: e.message
        });
    }
};
exports.deleteUserById = async (req, res) => {
    if (req.authRole !== "superadmin") {
        res.status(403).json({
            message: "Forbidden: You do not have permission to update users"
        });
        return;
    }
    const {userId} = req.params;
    if (!userId) {
        res.status(404).json({
            message: "User ID is required"
        });
        return;
    }
    try {
        const user = await userService.deleteUserById(userId);
        res.status(200).json({
            message: "User deleted successfully",
            data: user
        });
    } catch (e) {
        res.status(500).json({
            message: "Delete failed",
            error: e.message
        });
    }
}
exports.getUsers = async (req, res) => {
     if (req.authRole !== "superadmin") {
        res.status(403).json({
            message: "Forbidden: You do not have permission to update users"
        });
        return;
    }
    try {
        const users = await userService.getUsers(req.query);
        res.status(200).json({
            message: "Users retrieved successfully",
            data: users
        });
    } catch (e) {
        res.status(500).json({
            message: "Get users failed",
            error: e.message
        });
    }
}
exports.resetPassword = async (req, res) => {
    if (req.authRole !== "superadmin") {
        res.status(403).json({
            message: "Forbidden: You do not have permission to update users"
        });
        return;
    }
    const {userId} = req.params;
    if (!userId) {
        res.status(404).json({
            message: "User ID is required"
        });
        return;
    }
    try {
         await userService.resetPassword(userId);
        res.status(200).json({
            message: "User password reset successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: "password reset failed",
            error: e.message
        });
    }
}