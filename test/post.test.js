require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const User = require('../lib/models/User');
const Post = require('../lib/models/Post');

describe('Post Routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a post', async() => {
    const user = JSON.parse(JSON.stringify(
      await User.create({ 
        username: 'Danny',
        profilePhoto: 'some url',
        password: 'password'
      })
    ));
    return request(app)
      .post('/api/v1/posts')
      .send({ 
        user, 
        photoURL: 'another url',
        caption: 'Danny and Claire are awesome',
        tags: ['mobbing', 'alchemy']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), 
          __v: 0,
          user: user._id.toString(),
          photoURL: 'another url',
          caption: 'Danny and Claire are awesome',
          tags: ['mobbing', 'alchemy']
        });
      });
  });

  it('GET all posts', async() => {
    const user = JSON.parse(JSON.stringify(
      await User.create({ 
        username: 'Danny',
        profilePhoto: 'some url',
        password: 'password'
      })
    ));
    const post = JSON.parse(JSON.stringify(
      await Post.create({ 
        user: user._id,
        photoURL: 'a url link',
        caption: 'this is  a caption',
        tags: ['moblife', 'pillows']
      })
    ));
    return request(app)
      .get('/api/v1/posts')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          user: user._id,
          photoURL: 'a url link',
          caption: 'this is  a caption',
          tags: ['moblife', 'pillows'],
          __v: 0
        }]);

      });
  });
});
