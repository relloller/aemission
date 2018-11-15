'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  highscore: {
    type: Number,
    required: true,
    default: 0
  },
  role: {
    type: String,
    required: true,
    default: 'player'
  },
  pwHash: {
    type:String,
    required: true
  }
});

module.exports = mongoose.model('Users', userSchema);
