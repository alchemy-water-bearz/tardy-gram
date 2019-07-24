const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');
const chance = require('chance').Chance();

module.exports = async({ users = 1, posts = 20, comments = 5 } = { users: 5, posts: 50, comments: 100 }) => {
  const createdUsers = await User.create(
    [...Array(users)].map(() => ({
      username: chance.animal({ type: 'grassland' }),
      profilePhoto: chance.url({ extensions: ['gif', 'jpg', 'png'] }),
      password: 'password'
    }))
  );

  const userPost = await Post.create({
    user: createdUsers[0]._id,
    photoURL: chance.url({ extensions: ['gif', 'jpg', 'png'] }),
    caption: chance.sentence(),
    tags: [chance.hashtag()]
  });

  const createdPost = await Post.create(
    [...Array(posts - 1)].map(() => ({
      user: chance.pickone(createdUsers)._id,
      photoURL: chance.url({ extensions: ['gif', 'jpg', 'png'] }),
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

  const userComment = await Comment.create({
    commentBy: createdUsers[0]._id,
    post: chance.pickone(createdPost)._id,
    comment: chance.paragraph({ setences: 2 })
  });

  return {
    users: createdUsers,
    posts: [...createdPost, userPost],
    comments: [...createdComment, userComment]
  };
};
