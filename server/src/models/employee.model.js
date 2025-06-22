const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: false,
    match: [/^[0-9]{10}$/, 'Please enter a valid phone number']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments',
    required: false
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Positions',
    required: false
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Shifts'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  faceBase64: {
    type: String,  // Base64 string or file path
    default: ''
  },
  device: {
    type: String,
    ref:"Devices"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: false // Employee might not always be linked to a specific user for creation
  },
  faceEmbedding: {
    type: String, // Base64 string hoặc vector embedding
    default: ''
  },
}, {
  timestamps: true
});


const Employee = mongoose.model('Employees', employeeSchema);

module.exports = Employee; 