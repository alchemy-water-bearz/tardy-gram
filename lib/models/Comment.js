const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  comment: String
});

commentSchema.statics.findUserMostTotalComments = function() {
  return this.aggregate([
    { $group: { _id: '$post', 'totalCommentsForPost': { '$sum': 1 } } },
    { $lookup: { from: 'posts', 'localField': '_id', 'foreignField': '_id', 'as': 'posts' } }, 
    {
      '$unwind': {
        'path': '$posts'
      }
    }, {
      '$group': {
        '_id': '$posts.user', 
        'commentsOnUserPosts': {
          '$sum': '$totalCommentsForPost'
        }
      }
    }, {
      '$sort': {
        'commentsOnUserPosts': -1
      }
    }, {
      '$limit': 10
    }
  ]);
};

commentSchema.statics.findUserHighestAvgComments = function() {
  return this.aggregate([
    {
      '$group': {
        '_id': '$post', 
        'commentCount': {
          '$sum': 1
        }
      }
    }, {
      '$lookup': {
        'from': 'posts', 
        'localField': '_id', 
        'foreignField': '_id', 
        'as': 'posts'
      }
    }, {
      '$unwind': {
        'path': '$posts'
      }
    }, {
      '$group': {
        '_id': '$posts.user', 
        'commentsOnAllPostsByUser': {
          '$avg': '$commentCount'
        }
      }
    }, {
      '$sort': {
        'commentsOnAllPostsByUser': -1
      }
    }, {
      '$limit': 10
    }
  ]);
};

module.exports = mongoose.model('Comment', commentSchema);
