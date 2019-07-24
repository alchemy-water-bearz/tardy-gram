const { getAgent, getPosts } = require('./data-helpers');

describe('comments routes', () => {
  it('post comment', async() => {
    const post = getPosts()[0];
    return getAgent()
      .post('/api/v1/comments')
      .send({
        commentBy: post.user,
        post: post._id,
        comment: 'ahhhh'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          commentBy: expect.any(String),
          post: post._id.toString(),
          comment: 'ahhhh',
          __v: 0
        });
      });  
  });

  it('delete comment', async() => {
    const post = getPosts()[0];
    return getAgent()
      .post('/api/v1/comments')
      .send({
        commentBy: post.user,
        post: post._id,
        comment: 'k BYEEEEE'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          commentBy: expect.any(String),
          post: post._id.toString(),
          comment: 'k BYEEEEE',
          __v: 0
        });
      });  
  });
});



