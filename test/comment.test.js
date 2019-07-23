require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const User = require('../lib/models/User');
const Post = require('../lib/models/Post');

describe('comments routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('post comment', async() => {
    const user = await User.create({
      username: 'Claire',
      profilePhoto: 'claire is cool url',
      password: 'password'
    });
    const claire = request.agent(app);
    return claire
      .post('/api/v1/auth/signin')
      .send({ username: 'Claire', password: 'password' })
      .then(() => {
        return claire
          .get('/api/v1/auth/verify');
      })
      .then(async() => {
        const post = JSON.parse(JSON.stringify(
          await Post.create({ 
            user: user._id,
            photoURL: 'a url link',
            caption: 'this is a caption',
            tags: ['moblife', 'pillows']
          })
        ));
            
        return claire
          .post('/api/v1/comments')
          .send({
            commentBy: user._id,
            post: post._id,
            comment: 'ahhhh'
          })
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              commentBy: user._id.toString(),
              post: post._id.toString(),
              comment: 'ahhhh',
              __v: 0
            });
          });  
      });
  });
});
