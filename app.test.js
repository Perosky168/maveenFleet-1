const supertest= require('supertest')
const request= require('request')
const app= require('./app')

describe("POST /admin", ()=>{
    describe("given username and password", ()=>{
        test("should respond with a 200 status code", async()=>{
            const response= await request(app).post("/api/v1/admin/sign-up").send({
                username: "username",
                password :"password"
            })
            expect(response.statusCode).toBe(200)
        })
    })

})