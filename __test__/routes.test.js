const request = require('supertest')
const server = require('../utils/server')
const {MongoMemoryServer}= require('mongodb-memory-server')
const mongoose= require('mongoose')
const User= require('../Models/userModel')
const { login } = require('../Controllers/authController')

const app= server()

const userId= new mongoose.Types.ObjectId().toString();

const user= {
    id: userId,
    name: "kolu fewo",
    email: "ades@email.com",
    password: "kunle1374",
    confirmPassword: "kunle1374"
}

describe('get users route', ()=>{
    beforeAll(async()=>{
       const monogServer= await MongoMemoryServer.create();
       await mongoose.connect(monogServer.getUri())
    });

    afterAll(async ()=>{
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe('get user route', ()=>{
        describe("give a user doesn't exist",()=>{
        it('should return a 200 statusCode', async()=>{
            const newUser= await User.create(user)  
            const{body, statusCode}= await request(app).get(`/api/v1/user/${newUser.id}`)

            expect(statusCode).toBe(200)
            expect(body.id).toBe(newUser.id)
        })
    });

     });
});

// describe('sign-up admin route', ()=>{
//      describe('given admin is not logged in', ()=>{
//         it('should return a 403',async()=>{
//             const{statusCode}= await request(app).post('/api/v1/all-users')
//             expect(statusCode).toBe(403)
//         })
// })