const request = require('supertest')
const mongoose= require('mongoose')
const app= require('../app')
const dotenv= require('dotenv');
const express= require('express');


dotenv.config({path: './config.env'});

const DB= process.env.DATABASE

let userDetails= {
    name: 'wole runmi',
    email: 'ase@email.com',
    status: 'joiners'
};

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


describe('admin and user testing', ()=>{
    let protectMocked

    beforeAll(() => {
        mongoose.connect(DB, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        }).then(()=> console.log('DB connection successful'));

        // .mockImplementation(()=>{
        //     return 'fake logged in'
        // });   
        // protectMocked= jest.spyOn(authController, 'protect')
        // .mockReturnValue('next()');    
    });

    afterAll(async ()=>{
        await mongoose.disconnect();
        await mongoose.connection.close();

        jest.clearAllMocks();
    });

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

                //login so the delete route can be accesed
                const {body:loginBody} = await request(app).post('/api/v1/admin/login')
                .send({...loginDetails});
    
                //signing up data
                const {body, statusCode}= await request(app)
                .post('/api/v1/admin/sign-up')
                .send(signupDetails)

                //deleting the same document from the database.
                const {statusCode:deleteStatus}= await request(app).delete(`/api/v1/admin/delete/${body.data._id}`)
                .set('Cookie', [`secretoken=${loginBody.token}`]);

                expect(statusCode).toBe(201)
                expect(deleteStatus).toBe(200)

            })
        })
    });

    
    //Testing Protected Routes
    describe('given admin is not logged in and trying to accces protected route', ()=>{
        it('should reject the request with 401 status code', async()=>{
           const {statusCode:accessStatusCode}=  await request(app).get('/api/v1/user/636f2ecd4e497fc31864b6f3')
           const {statusCode:analytics}= await request(app).get('/api/v1/analytics')

           expect(accessStatusCode).toBe(401);
           expect(analytics).toBe(401)

        })
    })

    describe('given admin is correctly logged in', ()=>{

        describe("and trying to access data of visitors",()=>{
            
        it('should return a 404 statusCode for unfound data', async()=>{ 
            const fakeUser= '636f2ecd4e497fc31864b6f3'
            const {body} = await request(app).post('/api/v1/admin/login')
            .send({...loginDetails});

            const{statusCode}= await request(app).get(`/api/v1/user/${fakeUser}`)
            .set('Cookie', [`secretoken=${body.token}`]);

            expect(statusCode).toBe(404);
        })

        it('should return a 200 statusCode and a data for valid user_id', async()=>{
            const user= '636f2ecd4e497fb31864b6f1';

            const {body} = await request(app).post('/api/v1/admin/login')
            .send({...loginDetails});

            const {body:Body,statusCode}= await request(app).get(`/api/v1/user/${user}`)
            .set('Cookie', [`secretoken=${body.token}`]);

            expect(statusCode).toBe(200)
            expect(Body.data._id).toBe(user)
        });


    });

     });

     describe('saving visitor details and deleting', ()=>{
        it('should return a 201 statusCode and also 200 for deeting', async()=>{
            const {body, statusCode} = await request(app).post('/api/v2/visitors/sign-up')
            .send(userDetails);

            const deleteStausCode= await request(app).delete(`/api/v2/visitors/delete/${body.data._id}`)

            expect(statusCode).toBe(201)
            expect(deleteStausCode.statusCode).toBe(200)
        })
    });
});


