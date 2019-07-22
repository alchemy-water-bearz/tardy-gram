const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      username,
      password,
      profilePhoto
    } = req.body;

    User
      .create({ userName, password })
      .then(user => {
        const token = user.authToken();

        res.cookie('session', token);
        res.send(user);
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
    req.send(req.user);
  });
