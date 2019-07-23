const { Router } = require('express');
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensure-auth');

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
  })
  .get('/', (req, res, next) => {
    Post
      .find()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Post
      .findById(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    const { caption } = req.body; 
    if(req.user) {
      Post
        .findByIdAndUpdate(req.params.id, { caption }, { new: true })
        .then(post => res.send(post))
        .catch(next);
    } else {
      const err = new Error('unauthorized');
      err.status = 401;
      next(err);
    }
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    if(req.user) {
      Post
        .findByIdAndDelete(req.params.id)
        .then(post => res.send(post))
        .catch(next);
    } else {
      const err = new Error('unauthorized');
      err.status = 401;
      next(err);
    }
  });
