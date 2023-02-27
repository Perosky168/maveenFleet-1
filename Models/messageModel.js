const mongoose = require('mongoose');
const validator= require('validator')

const messageSchema= new mongoose.Schema({
    fullname:{
        type: String,
        required:[true, 'what is your fullname'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    message:{
        type: String,
        required: [true, 'must contain message']
    }

});

const Message = mongoose.model('Message',messageSchema) 

module.exports= Message