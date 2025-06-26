const userService = require("../service/user.service");
const {decode, encode} = require("../utils/jwtUtils");
exports.updateUserById = async (req, res) => {
    
    const {userId} = req.params;
    if (!userId) {
        res.status(400).json({
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
        res.status(400).json({
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
        res.status(400).json({
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
        res.status(400).json({
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
        const users = await userService.getUsers();
        res.status(200).json({
            message: "Users retrieved successfully",
            data: users
        });
    } catch (e) {
        res.status(400).json({
            message: "Get users failed",
            error: e.message
        });
    }
}