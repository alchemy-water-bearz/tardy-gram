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

// postSchema.statics.findPostById = function(id) {
//   return Promise.all([
//     this.findById(id)
//       .populate('comment', )
//   ])
// }

module.exports = mongoose.model('Post', postSchema);

