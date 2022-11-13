const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const Admin = require('../Models/adminModel')
const { promisify } = require('util')
const catchAsync= require('../utils/catchAsync')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    res.cookie('secretoken', token, {
        httpOnly: true,
        secure: req.secure
    })

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.protect= catchAsync(async (req, res, next)=>{
    if(req.cookies){
            // verify if token is real
            const decoded= await promisify(jwt.verify)(
                req.cookies.secretoken,
                process.env.JWT_SECRET
            );

            // check if user still exists
            const currentUser= await Admin.findById(decoded.id);  

            if(!currentUser){
                return (next(new AppError('Login again', 400)))
            };

            //check if user changed password after the token was issued

            if(currentUser.changedPasswordAfter(decoded.iat)){
                return (next(new AppError('password has been changed please login again', 400)))
            }

            //if all these are coditions are met then there is a logged in user, therfore store user info in locals
            req.user= currentUser
            res.locals.user= currentUser


            //Allow next middleware
            return next();
    }
    //Else if there are no saved cookies, user isnt logged in
    next(new AppError('user is not logged in', 400))

});


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('provide username and password', 400))
    }

    const admin = await Admin.findOne({ email }).select('+password')

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
        return next(new AppError('Wrong password', 400))
    }

    createSendToken(admin, 200, req, res)

};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
  
      next();
    };
  };