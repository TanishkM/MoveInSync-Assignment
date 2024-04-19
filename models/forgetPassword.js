const mongoose = require('mongoose');

const forgetPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  },
});

const ForgetPassword = mongoose.model('ForgetPassword', forgetPasswordSchema);
module.exports = ForgetPassword;
