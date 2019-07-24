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
    const user = getUsers()[0];
    const post = getPosts()[0];
    const comments = getComments().filter(c => {
      return c.post === post._id;
    })
    comments.forEach(c => delete c.__v)
    console.log(comments);
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

  it('can patch by ID if auth verified', async() => {
    const user = await User.create({
      username: 'Claire',
      profilePhoto: 'claire is cool url',
      password: 'password'
    });
    const claire = request.agent(app);
    return claire
      .post('/api/v1/auth/signin')
      .send({ username: 'Claire', password: 'password' })
      .then(() => {
        return claire
          .get('/api/v1/auth/verify');
      })
      .then(async() => {
        const post = JSON.parse(JSON.stringify(
          await Post.create({ 
            user: user._id,
            photoURL: 'a url link',
            caption: 'this is  a caption',
            tags: ['moblife', 'pillows']
          })
        ));
            
        return claire
          .patch(`/api/v1/posts/${post._id}`)
          .send({ caption: 'updated caption' })
          .then(res => {
            expect(res.body).toEqual({
              user: user._id.toString(),
              _id: expect.any(String),
              photoURL: 'a url link',
              caption: 'updated caption',
              tags: ['moblife', 'pillows'],
              __v: 0
            });
          });  
      });
  });

  it('can delete', async() => {
    const user = await User.create({
      username: 'Claire',
      profilePhoto: 'claire is cool url',
      password: 'password'
    });
    const claire = request.agent(app);
    return claire
      .post('/api/v1/auth/signin')
      .send({ username: 'Claire', password: 'password' })
      .then(() => {
        return claire
          .get('/api/v1/auth/verify');
      })
      .then(async() => {
        const post = JSON.parse(JSON.stringify(
          await Post.create({ 
            user: user._id,
            photoURL: 'a url link',
            caption: 'this is a caption',
            tags: ['moblife', 'pillows']
          })
        ));
            
        return claire
          .delete(`/api/v1/posts/${post._id}`)
          .then(res => {
            expect(res.body).toEqual({
              user: user._id.toString(),
              _id: expect.any(String),
              photoURL: 'a url link',
              caption: 'this is a caption',
              tags: ['moblife', 'pillows'],
              __v: 0
            });
          });  
      });
  });
  
});
