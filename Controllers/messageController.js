const Email = require('../utils/email');
const Message= require('../Models/messageModel');
const catchAsync= require('../utils/catchAsync');

exports.sendMessage= catchAsync(async(req, res,next)=>{
    const message= await Message.create(req.body)


    res.status(200).json({
        status: "success",
        message
    })

});

exports.updateMessage= catchAsync(async(req,res,next)=>{
    const message= await Message.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    });
    res.status(200).json({
        status: "sucess",
        message
    })

});

exports.deleteMessage= catchAsync(async (req,res,next)=>{
    await Message.findByIdAndDelete(req.params.id)

    res.status(200).json({
        status: "success",
    })
});

exports.getAllMessages= catchAsync(async(req,res,next)=>{
    const messages= await Message.find();

    res.status(200).json({
        status:"success",
        messages
    })
})

