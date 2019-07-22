const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router()

  .post('/', (req, res, next) => {
    const { 
      user, 
      photoURL,
      caption, 
      tags 
    } = req.body;

    Post
      .create({ user, photoURL, caption, tags })
      // .populate('user', { username: true })
      .then(post => res.send(post))
      .catch(next);
  });
