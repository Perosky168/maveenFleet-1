const Email = require('../utils/email');
const Message= require('../Models/messageModel');
const catchAsync= require('../utils/catchAsync');

exports.sendMessage= catchAsync(async(req, res,next)=>{
    const message= await Message.create(req.body)
    message.firstName= req.body.fullname[0]
    const url= `${req.protocol}://${req.get('host')}/class/${message.id}`

    await new Email(message,url).messageSentAlert()

    res.status(200).json({
        status: "success",
        message
    })

})

