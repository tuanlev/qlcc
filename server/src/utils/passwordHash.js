const crypto = require('crypto');

const hashPassword = (password) => {
    return crypto.createHash('sha512').update(password).digest('hex');
};

const verifyPassword = (password, hash) => {
    const verifyHash = crypto.createHash('sha512').update(password).digest('hex');
    return verifyHash === hash;
};

module.exports = {
    hashPassword,
    verifyPassword
};
