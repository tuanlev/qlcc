const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments',
    required: true
  }
});

const Position = mongoose.model('Positions', positionSchema);

module.exports = Position; 