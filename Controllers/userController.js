const User= require('../Models/userModel');
const catchAsync= require('../utils/catchAsync');
const Email= require('../utils/email')

exports.signUp = catchAsync(async (req, res, next)=>{
        
    const user= await User.create(req.body);
    const url= `${req.protocol}://${req.get('host')}/`
    
    req.session.user_name= user.name
    req.session.user_id= user._id
    req.session.email= user.email
    
    res.status(201).json({
      status: 'success',
      data: user
    })
    
});

exports.updateUser= catchAsync(async(req, res, next)=>{
    const newUser= await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true
    } );

    res.status(200).json({
        status: 'successful',
        data: newUser
    })

});

exports.deleteUser= catchAsync(async(req, res, next)=>{
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'succesful'
    })
});