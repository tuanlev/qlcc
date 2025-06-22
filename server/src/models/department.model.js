const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
  
}, {
  timestamps: true
});

const Department = mongoose.model('Department', departmentSchema);
E
module.exports = Department; 