const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    _id: {
        type: String,
    }
}
);

const Device = mongoose.model('Devices', deviceSchema);
module.exports = Device; 