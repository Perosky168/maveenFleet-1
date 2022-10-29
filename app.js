const express= require('express')
const cookieParser= require('cookie-parser')
const bodyParser= require('body-parser')
const path= require('path')
const visitorRouter= require('./Routes/adminRoutes')

const app= express();
app.use(cookieParser())

app.use((req,res,next)=>{
    req.requestTime= new Date().toISOString();
    next();
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/admin', visitorRouter)


module.exports= app