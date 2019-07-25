const { getUsers, getAgent } = require('./data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('user auth', () => {
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
    const user = getUsers()[0];
    return request(app)
      .post('/api/v1/auth/signin')
      .send({ 
        username: user.username,
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: user.username,
          profilePhoto: expect.any(String),
          __v: 0
        });
      });
  });

  it('verify that username and email are correct', async() => {
    return getAgent()
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: expect.any(String),
          profilePhoto: expect.any(String),
          __v: 0
        });
      });
  });

  it('10 users with most comments', () => {
    return getAgent()
      .get('/api/v1/auth/users/leader')
      .then(res => {
        expect(res.body[0].commentCount).toBeGreaterThan(res.body[9].commentCount);
        expect(res.body).toHaveLength(10);
      });
  });
});

