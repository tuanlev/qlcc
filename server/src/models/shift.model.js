const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  checkInHour: {
    type: Number,
    required: true,
    min: 0,
    max: 23
  },
  checkOutHour: {
    type: Number,
    required: true,
    min: 0,
    max: 23,
    validate: {
      validator: function (value) {
        return value > this.checkInHour;
      },
      message: props => `Giờ về (${props.value}) phải lớn hơn giờ đến`
    }
  }
}, {
  timestamps: true
});
const Shift =mongoose.model('Shift', shiftSchema);
module.exports = Shift
