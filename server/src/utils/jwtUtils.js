const Jwt = require("jsonwebtoken");

function decode(token) {
    try {
        if (!token) {
            throw new Error("No token provided");
        }
        token = token.toString().replace("Bearer ", ""); // Remove 'Bearer ' prefix if present
        const secretKey = process.env.JWT_SECRET;
        return Jwt.verify(token, secretKey);
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            throw new Error('Token expired. Please log in again.');
        }
        else
            throw e;

    }
}
function encode(data) {
    try {
        delete data.iat;
        delete data.exp;
        const token = Jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: '30minutes' // Token will expire in 30 minutes
        })
        return "Bearer " + token;
    }
    catch (e) {
        throw new Error("method: encode, error: " + e.name);
    }
}
module.exports = {
    decode,
    encode
};