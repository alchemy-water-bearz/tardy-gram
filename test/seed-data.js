const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');
const chance = require('chance').Chance();

module.exports = async({ users = 10, posts = 100, comments = 100 } = { users: 10, posts: 100, comments: 100 }) => {
  const createdUsers = await User.create(
    [...Array(users)].map(() => ({
      username: chance.animal({ type: 'grassland' }),
      profilePhoto: chance.url({ extensions: ['gif', 'jpg', 'png'] }),
      password: 'password'
    }))
  );

  const createdPost = await Post.create(
    [...Array(posts)].map(() => ({
      user: chance.pickone(createdUsers)._id,
      profilePhoto: chance.url({ extensions: ['gif', 'jpg', 'png'] }),
      caption: chance.sentence(),
      tags: [chance.hashtag()]
    }))
  );
  
  const createdComment = await Comment.create(
    [...Array(comments)].map(() => ({
      commentBy: chance.pickone(createdUsers)._id,
      post: chance.pickone(createdPost)._id,
      comment: chance.paragraph({ setences: 2 })
    }))
  );

  return {
    users: createdUsers,
    posts: createdPost,
    comments: createdComment
  };
};
