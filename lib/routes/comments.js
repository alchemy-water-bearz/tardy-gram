const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Comment = require('../models/Comment');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      post,
      comment
    } = req.body;

    if(req.user) {
      Comment
        .create({ commentBy: req.user._id, post, comment })
        .then(comment => res.send(comment))
        .catch(next);
    } else {
      const err = new Error('unauthorized');
      err.status = 401;
      next(err);
    }
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    if(req.user) {
      Comment
        .findByIdAndDelete(req.params.id)
        .then(comment => res.send(comment))
        .catch(next);
    } else {
      const err = new Error('unauthorized');
      err.status = 401;
      next(err);
    }
  });
