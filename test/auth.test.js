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
        console.log('bodyodyody', res.body)
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'Claire',
          profilePhoto: 'claire is cool url',
          __v: 0
        });
      });
  });

});

