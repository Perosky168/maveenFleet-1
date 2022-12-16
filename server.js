const mongoose= require('mongoose');
const dotenv= require('dotenv')
const app= require('./app')

dotenv.config({path: './config.env'});

const DB= process.env.DATABASE

mongoose.connect(DB, {
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(()=> console.log('DB connection successful'))

const server= app.listen(8000, ()=>{
    console.log(process.env.MODE)
    console.log('Running on port 8000...')
})