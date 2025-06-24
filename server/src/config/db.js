const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/timekeeping";
 function   connectDB()  {
        mongoose.connect(mongoURI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
      
}


require("../models")

module.exports = connectDB;