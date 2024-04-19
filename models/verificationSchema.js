const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hash: { 
    type: String,
    required: true 
},
verified: { 
    type: Boolean,
    default: false 
} 
});

module.exports = mongoose.model('Verification', verificationSchema);
