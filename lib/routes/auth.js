const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      username,
      profilePhoto,
      password,
    } = req.body;

    User
      .create({ username, profilePhoto, password })
      .then(user => {
        const token = user.authToken();

        res.cookie('session', token);
        res.send(user.toJSON());
      })
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const {
      userName,
      password
    } = req.body;

    User.findOne({ userName })
      .then(user => {
        const isValidPassword = user.compare(password);
        if(isValidPassword) {
          const token = user.authToken();
          res.cookie('session', token);
          res.send(user);
        } else {
          const err = new Error('Invalid username/password');
          err.status = 401;
          next(err);
        }
      });
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  })

  .get('/users/leader', (req, res, next) => {
    User
      .mostComments()
      .then(users => res.send(users))
      .catch(next);
  });

