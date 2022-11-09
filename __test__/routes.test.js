const request = require('supertest')
const app = require('../app')

// const jest= require('jest')

// const createAdmin= jest.fn()

describe('Post Endpoints', () => {
  it('should return a 400 statusCode', async () => {
    const res = await request(app)
      .post('/api/v1/admin/login')
      .send({
        password: 'kunle1374',
        confirmPassword:'kunle1374'
      })

    expect(res.statusCode).toEqual(400)
  })
})



