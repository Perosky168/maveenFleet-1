const express= require('express')
const cookieParser= require('cookie-parser')
const bodyParser= require('body-parser')
const path= require('path')
const adminRouter= require('./Routes/adminRoutes')
const globalError= require('./Controllers/errorController')
const AppError= require('./utils/appError')

const app= express();
app.use(cookieParser())

app.use((req,res,next)=>{
    req.requestTime= new Date().toISOString();
    next();
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', adminRouter)

app.all('*', (req, res, next)=>{
    next(new AppError(`Page ${req.originalUrl} is not found`, 404));
});

app.use(globalError);

module.exports= app