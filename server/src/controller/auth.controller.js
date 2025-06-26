const userService = require("../service/user.service");
const {decode, encode} = require("../utils/jwtUtils");
exports.login = async (req, res) => {  
    try {
        console.log("controller.auth.login");
        const user = await userService.login(req.body);
        const token = encode(user);
        res.set("Authorization",token);
        res.status(200).json({
            message: "Login successful",
            data:user
        });
    } catch (e) {
        res.status(401).json({
            message: "Login failed",
            error: e.message
        });
    }
};
exports.register = async (req, res) => {
    try {
        if (req.authRole !== "superadmin") {
            res.status(403).json({
                message: "Forbidden: You do not have permission to register users"
            });
            return;
        }
        const user = await userService.addUser(req.body);
        res.status(201).json({
            message: "Registration successful",
            data: user    
        });
    } catch (e) {
        res.status(400).json({
            message: "Registration failed",
            error: e.message
        });
    }
};
