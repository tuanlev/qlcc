const crypto = require('crypto');

const hashPassword = (password) => {
    return crypto.createHash('sha512').update(password).digest('hex');
};

const verifyPassword = (password, hash) => {
    const verifyHash = hashPassword(password);
    return verifyHash.toString() == hash.toString();
};

module.exports = {
    hashPassword,
    verifyPassword
};
