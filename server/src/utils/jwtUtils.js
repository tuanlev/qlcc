const Jwt = require("jsonwebtoken");

function decode(token) {
    try {
        if (!token) {
            throw new Error("No token provided");
        }
        token = token.toString().replace("Bearer ", ""); // Remove 'Bearer ' prefix if present
        const secretKey = process.env.JWT_SECRET;
        const data =  Jwt.verify(token, secretKey);
        return  {
            role:data.role,
            username:data.username,
            device:data.device
        }
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            throw new Error('Token expired. Please log in again.');
        }
        else
            throw e;

    }
}
function encode({role,device,username}) {
    try {
  
        const token = Jwt.sign({role,device,username}, process.env.JWT_SECRET, {
            expiresIn: '30minutes' // Token will expire in 30 minutes
        })
        return "Bearer " + token;
    }
    catch (e) {
        throw new Error("method: encode, error: " + e.message);
    }
}
module.exports = {
    decode,
    encode
};