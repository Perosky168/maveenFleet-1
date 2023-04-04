const mongoose = require('mongoose');
const validator = require('validator');
const now = Date.now();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    status: {
        type: String,
        enum: {
            values: ['joiners', 'intersted in partnership', 'Want to stay in touch']
        },
    },
    createdAt: {
        type: Date,
        default: new Date(now).toLocaleDateString()
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;