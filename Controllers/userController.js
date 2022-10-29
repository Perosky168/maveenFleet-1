const User= require('../Models/adminModel')

exports.createVisitor= async(req, res, next)=>{
    try{
        const visitor= User.create(req.body)

        res.status(200).jaon({
            status: 'success',
            data: visitor
        })
    }catch(err){
        res.status(200).json({
            status: 'fail',
            message: err
        })
    }

    
}