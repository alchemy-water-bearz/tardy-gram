const { getAgent, getUsers, getPosts, getComments } = require('./data-helpers');
const request = require('supertest');
const app = require('../lib/app');

describe('Post Routes', () => {

  it('can create a post', async() => {
    return getAgent()
      .post('/api/v1/posts')
      .send({ 
        photoURL: 'another url',
        caption: 'Danny and Claire are awesome',
        tags: ['mobbing', 'alchemy']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), 
          __v: 0,
          user: expect.any(String),
          photoURL: 'another url',
          caption: 'Danny and Claire are awesome',
          tags: ['mobbing', 'alchemy']
        });
      });
  });

  it('GET all posts', () => {
    const posts = getPosts();
    return getAgent()
      .get('/api/v1/posts')
      .then(res => {
        posts.forEach(post => {
          expect(res.body).toContainEqual({
            user: post.user,
            photoURL: post.photoURL,
            caption: post.caption,
            tags: post.tags,
            _id: expect.any(String),
            __v: 0
          });
        });
      });
  });

  it('get post by ID', async() => {
    const post = getPosts()[0];
    const comments = getComments().filter(c => {
      return c.post === post._id;
    });
    return getAgent()
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: expect.any(String),
          photoURL: post.photoURL,
          caption: post.caption,
          tags: post.tags,
          __v: 0,
          comments: expect.any(Array)
        });
      });
  });

  it('can patch by ID if auth verified', () => {
    const post = getPosts().find(p => p.user === getUsers()[0]._id);
    return getAgent()
      .patch(`/api/v1/posts/${post._id}`)
      .send({ caption: 'updated caption' })
      .then(res => {
        expect(res.body).toEqual({
          user: expect.any(String),
          _id: expect.any(String),
          photoURL: expect.any(String),
          caption: 'updated caption',
          tags: expect.any(Array),
          __v: 0
        });
      });  
  });

  it('can delete', () => { 
    const post = getPosts().find(p => p.user === getUsers()[0]._id);    
    return getAgent()
      .delete(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          user: expect.any(String),
          _id: expect.any(String),
          photoURL: expect.any(String),
          caption: expect.any(String),
          tags: expect.any(Array),
          __v: 0
        });
      });  
  });
});
