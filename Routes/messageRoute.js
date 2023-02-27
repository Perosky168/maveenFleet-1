const express= require('express');
const messageController= require('../Controllers/messageController')

router= express.Router()

router.route('/send-message').post(messageController.sendMessage);

module.exports= router