const request = require('supertest')
const server = require('../utils/server')
const {MongoMemoryServer}= require('mongodb-memory-server')
const mongoose= require('mongoose')
const app= require('../app')
const dotenv= require('dotenv')

dotenv.config({path: './config.env'});

const DB= process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)


const userId= new mongoose.Types.ObjectId().toString();

describe('get users route', ()=>{
    beforeAll(() => {
        mongoose.connect(DB, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        }).then(()=> console.log('DB connection successful'))     
      });

    describe('signing up admin', ()=>{
        describe('sucessful sign-up', ()=>{
            it('signing up correctly', async()=>{
                const {body, statusCode}= await request(app)
                .post('/api/v1/admin/sign-up')
                .send({
                        "name": "Akinpelu Tobiloba",
                        "email": "akinpelu@gmail.com",
                        "password": "kunle1374",
                        "confirmPassword": "kunle1374"
                    })
                expect(statusCode).toBe(201)
            })
        })
    })
      
    describe('loging in admin', ()=>{
        describe('testing log in', ()=>{

            //Login the admin if the correct details was given       
            it('should send 200 statusCode and login the user', async()=>{                
                const {body, statusCode} = await request(app).post('/api/v1/admin/login').send({
                    "email": "adekunle.olanipekun.ko@gmail.com",
                    "password": "kunle1374"
                });
            expect(statusCode).toBe(200)
            });

            //Testing if wrong email or password was provided. 
            it('send 400 statusCode for wrong user name or password', async()=>{
                const {statusCode} = await request(app).post('/api/v1/admin/login').send({
                    "email": "adekun.olanipekun.ko@gmail.com",
                    "password": "kunle1374"
                });
                expect(statusCode).toBe(400)
            })
        })
    })

    //Testing the users valid Id

    describe('get user route', ()=>{
        describe("give a user doesn't exist",()=>{
        it('should return a 404 statusCode if there is no user with this id', async()=>{
            const fakeUser= '636f2ecd4e497fc31864b6f3'
            const{body, statusCode}= await request(app).get(`/api/v1/user/${fakeUser}`)

            expect(statusCode).toBe(404)
        })

        it('should return a 200 statusCode and a data', async()=>{
            const user= '636f2ecd4e497fb31864b6f1'
            const {body, statusCode}= await request(app).get(`/api/v1/user/${user}`);

            expect(statusCode).toBe(200)
            expect(body.data._id).toBe(user)
        })

    });

     });
});
