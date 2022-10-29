const jwt = require('jsonwebtoken')
const AppError= require('../utils/appError')
const Admin= require('../Models/adminModel')


const signToken= id=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

const createSendToken= (user, statusCode, req, res)=>{
    const token= signToken(user._id);

    res.cookie('secretoken', token, {
        httpOnly: true,
        secure: req.secure
    })

    res.status(statusCode).json({
        status: 'success',
        token,
        data:{
            user
        }
    });
};



exports.login= async(req, res, next)=>{
        const {email, password}= req.body;

        if(!email || !password){
            return next(new AppError('provide username and password', 400))
        }

        const admin= await Admin.findOne({email}).select('+password')

        if (!admin || !(await admin.correctPassword(password, user.password))){
            return next(new AppError('Wrong password', 400))
        }

        createSendToken(admin, 200, req, res)

}