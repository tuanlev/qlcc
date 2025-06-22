const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    ref: "Devices",
    required: true
  },
  employeeId: {
    type: String,
    ref: "Employees",
    required: false
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  faceBase64: {
    type: String,
    required: false
  },
}, {
  timestamps: true
});

const Checkin = mongoose.model('Checkins', checkinSchema);

module.exports = Checkin; 