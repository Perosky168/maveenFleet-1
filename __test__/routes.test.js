const request = require('supertest')
const mongoose= require('mongoose')
const app= require('../app')
const dotenv= require('dotenv')
const jwt = require('jsonwebtoken')
const authController= require('../Controllers/authController');

dotenv.config({path: './config.env'});

const privateKey= process.env.JWT_SECRET

const DB= process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

const loginDetails= {
    "email": "adekunle.olanipekun.ko@gmail.com",
    "password": "kunle1374"
};

const signupDetails= {
    "name": "Akinpelu Tobiloba",
    "email": "akinpelu@gmail.com",
    "password": "kunle1374",
    "confirmPassword": "kunle1374"
};

function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
      callback(items[index]);
    }
  };




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

describe('admin route testing', ()=>{
     
    describe('loging in admin', ()=>{
        describe('testing log in', ()=>{

            //Login the admin if the correct details was given       
            it('should send 200 statusCode and login the user', async()=>{  
                const {body, statusCode} = await request(app).post('/api/v1/admin/login')
                .send(loginDetails);

            expect(statusCode).toBe(200)
            });

            //Testing if wrong email or password was provided. 
            it('send 400 statusCode for wrong user name or password', async()=>{
                const {statusCode} = await request(app).post('/api/v1/admin/login')
                .send({...loginDetails, password: "kunle112"});

                expect(statusCode).toBe(400)
            })


        })
    })

    describe('signing up admin', ()=>{
        describe('sucessful sign-up', ()=>{
            it('signing-up admin and deleting admin', async()=>{
                const {body, statusCode}= await request(app)
                .post('/api/v1/admin/sign-up')
                .send(signupDetails)

                const {statusCode:deleteStatus}= await request(app).delete(`/api/v1/admin/delete/${body.data._id}`)

                expect(statusCode).toBe(201)
                expect(deleteStatus).toBe(200)

            })
        })
    });

    
    //Testing the users valid Id

    describe('get user route', ()=>{
        describe("give a user doesn't exist",()=>{
        it('should return a 404 statusCode if there is no user with this id', async()=>{
            const fakeUser= '636f2ecd4e497fc31864b6f3'
            

            const login= jest.spyOn(authController, 'login')
            .mockReturnValueOnce(loginDetails);

            
            const{body, statusCode}= await request(app).get(`/api/v1/user/${fakeUser}`);

            expect(statusCode).toBe(404)
        })

        it('should return a 200 statusCode and a data', async()=>{
            const user= '636f2ecd4e497fb31864b6f1'
            const {body, statusCode}= await request(app).get(`/api/v1/user/${user}`);

            expect(statusCode).toBe(200)
            expect(body.data._id).toBe(user)
        });

        it('testing a call back function', ()=>{
            const mockCallback= jest.fn(authController.protect)
            forEach([0, 1], mockCallback);

            expect(mockCallback.mock.calls.length).toBe(2);
        })

    });

     });
});


