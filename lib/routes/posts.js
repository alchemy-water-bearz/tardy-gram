const { Router } = require('express');
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      photoURL,
      caption, 
      tags 
    } = req.body;

    Post
      .create({ user: req.user._id, photoURL, caption, tags })
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Post
      .find()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/popular', (req, res, next) => {
    Post
      .findTopPosts()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Post
      .findPostById(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    const { caption } = req.body; 
    Post
      .findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { caption }, { new: true })
      .then(post => {
        if(post) {
          res.send(post);
        } else {
          const err = new Error('unahtorizif');
          err.status = 401;
          next(err);
        }
      })
      .catch(next);
  })



  .delete('/:id', ensureAuth, (req, res, next) => {
    Post
      .findOneAndDelete({ _id: req.params.id, user: req.user._id })
      .then(post => {
        if(post) {
          res.send(post);
        } else {
          const err = new Error('unahtorizif');
          err.status = 401;
          next(err);
        }
      })
      .catch(next);
  });
