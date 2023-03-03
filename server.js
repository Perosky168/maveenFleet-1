const mongoose= require('mongoose');
const dotenv= require('dotenv')
const app= require('./app')

dotenv.config({path: './config.env'});

const DB= process.env.DATABASE

mongoose.connect(DB, {
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(()=> console.log('DB connection successful'))

const server= app.listen(process.env.PORT, ()=>{
    console.log(process.env.MODE)
    console.log('Running on port 8000...')
});

process.on('unhandledRejection', err=>{
    console.log("UNHANDLED REJECTION 1💥💥, shutting down.... 😕")
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit();
    })
});