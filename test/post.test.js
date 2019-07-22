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
    ))
      .post('/api/v1/posts')
      .send({ 
        user, 
        photoURL: 'another url',
        comment: 'Danny and Claire are awesome',
        tags: ['mobbing', 'alchemy']
      });
  });
})
;
