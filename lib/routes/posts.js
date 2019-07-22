const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router()

  .post('/', (req, res, next) => {
    const { 
      user, 
      photoUrl, 
      caption, 
      tags 
    } = req.body;

    Post
      .create({ user, photoUrl, caption, tags })
      .then(post => res.send(post))
      .catch(next);
  });
