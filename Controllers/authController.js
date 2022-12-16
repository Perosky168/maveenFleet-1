const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const Admin = require('../Models/adminModel')
const { promisify } = require('util')
const catchAsync= require('../utils/catchAsync')
const User= require('../Models/userModel');
const Email= require('../utils/email')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

const createSendToken = (user, statusCode, req, res) => {
  try{
    const token = signToken(user._id);
    res.cookie('secretoken', token, {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    //saving username and Id in session
    req.session.user_name= user.name
    req.session.user_id= user._id
    req.session.email= user.email
    //Removing password from output
    user.password= undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });

  }catch(err){
    console.log(err)
      res.status(500).json({
        status: 'fail', 
        error: err.Error
      })
    }
  };

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.secretoken) {
      token = req.cookies.secretoken;
    }
  
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
  
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    // 3) Check if user still exists
    const currentUser = await Admin.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
  
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }
  
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
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
