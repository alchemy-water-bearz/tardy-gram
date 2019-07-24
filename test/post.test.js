const { getAgent, getUsers, getPosts, getComments } = require('./data-helpers');


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

  it('GET all posts', async() => {
    const user = JSON.parse(JSON.stringify(
      await User.create({ 
        username: 'Danny',
        profilePhoto: 'some url',
        password: 'password'
      })
    ));
    const post = JSON.parse(JSON.stringify(
      await Post.create({ 
        user: user._id,
        photoURL: 'a url link',
        caption: 'this is  a caption',
        tags: ['moblife', 'pillows']
      })
    ));
    return request(app)
      .get('/api/v1/posts')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          user: user._id,
          photoURL: 'a url link',
          caption: 'this is  a caption',
          tags: ['moblife', 'pillows'],
          __v: 0
        }]);

      });
  });

  it('get post by ID', async() => {
    const user = JSON.parse(JSON.stringify(
      await User.create({ 
        username: 'Danny',
        profilePhoto: 'some url',
        password: 'password'
      })
    ));
    const post = JSON.parse(JSON.stringify(
      await Post.create({ 
        user: user._id,
        photoURL: 'a url link',
        caption: 'this is  a caption',
        tags: ['moblife', 'pillows']
      })
    ));
    const comment = JSON.parse(JSON.stringify(
      await Comment.create({
        commentBy: user._id,
        post: post._id,
        comment: 'this is a comment'
      })
    ));
    return request(app)
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        console.log(res.body);
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: user._id.toString(),
          photoURL: 'a url link',
          caption: 'this is  a caption',
          tags: ['moblife', 'pillows'],
          __v: 0,
          comments: [{ 
            _id: comment._id.toString(),
            post: comment.post, 
            commentBy: comment.commentBy,
            comment: comment.comment
          }]

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
