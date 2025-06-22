const { LoadUserByUsername } = require("../service/user.service");
const jwtUtils = require("../utils/jwtUtils")
const authorizeAdmin = async (req, res, next) => {
    let token = req.get("authorization").toString().replace("Bearer ", "");
    try {
        if (token) {
            const data = jwtUtils.decode(token);
            const user = await LoadUserByUsername(data.username);
            req.authRole = user.role;
            if (user.role == "admin") {
                req.grantedAuthority = devices
            }
            next()
        }
    } catch (e) {
        next(new Error("auth.middleware.error :"+e.message));
    }
}