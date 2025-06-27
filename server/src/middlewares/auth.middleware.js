const { LoadUserByUsername } = require("../service/user.service");
const jwtUtils = require("../utils/jwtUtils")
exports.authorizeAdmin = async (req, res, next) => {
    let token = req.get("Authorization");
    try {
        if (token) {
            const data = jwtUtils.decode(token);
            const newToken =jwtUtils.encode(data);
            res.set("Authorization",newToken );
            const user = await LoadUserByUsername(data.username);
            req.authRole = user.role;
            if (user.role == "admin") {
                req.grantedAuthority = user.device;
            }
            console.log("req.grantedAuthority: " + req.grantedAuthority);
            req.user = data
            next()
        }
        else next()
    } catch (e) {
        console.error("Authorization error:", e.message);
        next()
    }
}