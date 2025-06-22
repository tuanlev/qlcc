const jwtUtils = require("../utils/jwtUtils")
const authorizeAdmin = (req, res, next) => {
    let token  = req.get("authorization").toString().replace("Bearer ","");
    const data = jwtUtils.decode(token);
    req.user = data;
    try{

    } catch (e) {

    }
}