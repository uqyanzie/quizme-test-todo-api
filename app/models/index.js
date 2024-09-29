const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Mongoose = mongoose;
const User = require('./user.model');
const Todo = require('./todo.model');
const OTP = require('./otp.model');

const dbInstance = {
    Mongoose,
    User,
    Todo,
    OTP
};

module.exports = dbInstance;