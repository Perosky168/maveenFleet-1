const express= require('express')
const cookieParser= require('cookie-parser')
const bodyParser= require('body-parser')
const path= require('path')
const adminRouter= require('./Routes/adminRoutes')
const globalError= require('./Controllers/errorController')
const AppError= require('./utils/appError')
const session= require('express-session')
const helmet= require('helmet')
const rateLimit= require('express-rate-limit')
const xss= require('xss-clean')
const mongoSanitize= require('express-mongo-sanitize')

const app= express();
app.use(cookieParser())


app.use((req,res,next)=>{
    req.requestTime= new Date().toISOString();
    next();
});

//implemnting sessions
app.use(session({secret: 'adekunlesessionsecretdonttryitatall'}));

//implementing body parser to reead req.body
app.use(bodyParser.json());

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//set security HTTP headers
app.use(helmet())


//limit request from same IP address
const limiter= rateLimit({
    max:50,
    windowsMs: 60*60*1000,
    message: 'There is too many request from this device, try in 1hour time.'
})

app.use('/api', limiter)

//Data sanitization against NoSQL query injection
app.use(mongoSanitize())

//Data Sanitization against XSS
app.use(xss())



//routes
app.use('/api/v1', adminRouter)

//handling unexisting page
app.all('*', (req, res, next)=>{
    next(new AppError(`Page ${req.originalUrl} is not found`, 404));
});

app.use(globalError);


module.exports= app