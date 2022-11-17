const request = require('supertest')
const mongoose= require('mongoose')
const app= require('../app')
const dotenv= require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config({path: './config.env'});

const privateKey= process.env.JWT_SECRET

const DB= process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

const mockAdmin= {
    "_id": "636b487e6ba4e7b083d2afd4",
    "email": "adekunle.olanipekun.ko@gmail.com",
    "name": "Olanipekun Adkeunle",
    "password": "$2b$12$U7Lzmy9edt14JGO3GHZrtesQasGkyXBiq6na0Ce7AW08NvpJJc7Lm",
    "role": "admin",
    "__v": 0
  };

describe('admin route testing', ()=>{
    beforeAll(() => {
        mongoose.connect(DB, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        }).then(()=> console.log('DB connection successful'))     
      });

    afterAll(async ()=>{
        await mongoose.disconnect();
        await mongoose.connection.close()
    })

    //Signup test
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
    });
      
    //Authentication test 
    
    describe('loging in admin', ()=>{
        describe('testing log in', ()=>{

            //Testing if wrong email or password was provided. 
            it('send 400 statusCode for wrong user name or password', async()=>{
                const {statusCode} = await request(app).post('/api/v1/admin/login').send({
                    "email": "adekun.olanipekun.ko@gmail.com",
                    "password": "kunle1374"
                });
                expect(statusCode).toBe(400)
            })

            //Login the admin if the correct details was given       
            it('should send 200 statusCode and login the user', async()=>{  

                const {body, statusCode} = await request(app).post('/api/v1/admin/login')
                .send({
                    "email": "adekunle.olanipekun.ko@gmail.com",
                    "password": "kunle1374"
                });


            expect(statusCode).toBe(200)
            });


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
