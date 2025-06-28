const { LoadUserByUsername } = require("../service/user.service");
const jwtUtils = require("../utils/jwtUtils")
exports.authorizeAdmin = async (req, res, next) => {
    let token = req.get("Authorization");
    try {
        if (token) {
            const data = jwtUtils.decode(token);
            const user = await LoadUserByUsername(data.username);
            req.authRole = user.role;
            if (user.role == "admin") {
                req.grantedAuthority = user.device;
            }
            const newToken =jwtUtils.encode(user);
            res.set("Authorization",newToken );
            req.user = user
            next()
        }
        else next()
    } catch (e) {
        console.error("auth.middelware Authorization error:", e.message);
        next()
    }
}