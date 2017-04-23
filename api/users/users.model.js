/** ./api/users/users.model.js **/

var mongoose = require('mongoose');

var words = new mongoose.Schema({
    word: String
});

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
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
  wordlist: [words],
  name: String,
  role: {
    type: String,
    required: true,
    default: 'player'
  },
  pwHash: {
    type:String
  }
});


module.exports = mongoose.model('Users', userSchema);