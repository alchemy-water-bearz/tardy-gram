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

postSchema.statics.findPostById = function(id) {
  return Promise.all([
    this.findById(id), 
    this.model('Comment').find({ post: id }) 
      .select({ commentBy: true, comment: true, post: true })
  ])
    .then(([post, comments]) => ({
      ...post.toJSON(),
      comments
    }));
};

postSchema.statics.findTopPosts = function() {
  return this.model('Comment').aggregate([
    {
      '$group': {
        '_id': '$post', 
        'commentCount': {
          '$sum': 1
        }
      }
    }, {
      '$sort': {
        'commentCount': -1
      }
    }, {
      '$limit': 10
    }
  ]);
};

postSchema.statics.findProlificPost = function() {
  return this.aggregate([
    {
      '$group': {
        '_id': '$user', 
        'postCount': {
          '$sum': 1
        }
      }
    }, {
      '$sort': {
        'postCount': -1
      }
    }, {
      '$limit': 10
    }
  ]);
};

module.exports = mongoose.model('Post', postSchema);

