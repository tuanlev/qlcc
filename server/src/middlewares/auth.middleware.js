const { LoadUserByUsername } = require("../service/user.service");
const jwtUtils = require("../utils/jwtUtils")
exports.authorizeAdmin = async (req, res, next) => {
    let token = req.get("authorization");
    try {
        if (token) {
            const data = jwtUtils.decode(token);
            res.set("authorization", jwtUtils.encode(data));
            const user = await LoadUserByUsername(data.username);
            req.authRole = user.role;
            if (user.role == "admin") {
                req.grantedAuthority = devices
            }
            next()
        }
    } catch (e) {
        console.error("Authorization error:", e.message);
        next()
    }
}