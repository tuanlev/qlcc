const Jwt = require("jsonwebtoken");

function decode(token) {
    try {
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
        const token = Jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: '24h'
        })
        return token;
    }
    catch (e) {
        console.log("method: encode, error: "+ e.name);
        throw e;
    }
} 