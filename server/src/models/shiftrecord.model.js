const mongoose = require('mongoose');

const shiftRecordSchema = new mongoose.Schema({
  employee: {
    type: String,
    ref: 'Employees',
    required: true
  },
  checkIn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Checkins',
    required: false
  },
  checkOut: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Checkins',
    required: false
  },
  checkInStatus: {
    type: String,
    enum: ['on-time', 'late', 'absent',"Unassigned"],
    default: 'absent'
  },
  checkOutStatus: {
    type: String,
    enum: ['on-time', 'early-leave','absent', 'Unassigned'],
    default: 'absent'
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shifts',
  },
}, {
  timestamps: true
});
const ShiftRecord = mongoose.model('ShiftRecords', shiftRecordSchema);
module.exports = ShiftRecord
