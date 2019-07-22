require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const User = require('../lib/models/User');

describe('user auth', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('signs up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        username: 'Claire',
        profilePhoto: 'claire is cool url',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'Claire',
          profilePhoto: 'claire is cool url',
          __v: 0
        });
      });
  });

  it('signs in user', async() => {
    const user = await User.create({
      username: 'Claire',
      profilePhoto: 'claire is cool url',
      password: 'password'
    });

    return request(app)
      .post('/api/v1/auth/signin')
      .send({ 
        username: 'Claire',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: user.username,
          profilePhoto: 'claire is cool url',
          __v: 0
        });
      });
  });

  it('verify that username and email are correct', async() => {
    await User.create({
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
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'Claire',
          profilePhoto: 'claire is cool url',
          __v: 0
        });
      });
  });
});

