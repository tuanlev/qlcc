const mongoose = require('mongoose');

const shiftRecordSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: true
  },
  checkIn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Checkin',
    required: false
  },
  checkOut: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Checkin',
    required: false
  },
  checkInStatus: {
    type: String,
    enum: ['on-time', 'late', 'absent'],
    default: 'absent-time'
  },
  checkOutStatus: {
    type: String,
    enum: ['on-time', 'early-leave', 'absent'],
    default: 'on-absent'
  },
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});
const ShiftRecord = mongoose.model('ShiftRecord', shiftRecordSchema);
module.exports = ShiftRecord
