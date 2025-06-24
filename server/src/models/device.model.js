const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        unique: true,
    }
}
);

const Device = mongoose.model('Devices', deviceSchema);
module.exports = Device; 