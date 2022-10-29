const User= require('../Models/adminModel')
const AppError= require('../utils/appError')


exports.createVisitor= async(req, res, next)=>{
        const admin= await User.create(req.body)

        if(!admin) return next(new(AppError('something went wrong', 400)))

        res.status(200).json({
            status: 'success',
            data: admin
        })

    
}