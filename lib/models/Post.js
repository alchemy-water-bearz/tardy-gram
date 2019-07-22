const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  photoURL: String,
  caption: String,
  tags: [String]
});

module.exports = mongoose.model('Post', postSchema);

