const express= require('express');
const messageController= require('../Controllers/messageController')
const authController= require('../Controllers/authController')

router= express.Router()

router.route('/send-message').post(messageController.sendMessage);
router.route('/update/:id').patch(messageController.updateMessage)

router.use(authController.protect, authController.restrictTo("admin"))

router.route('/delete/:id').delete(messageController.deleteMessage)

module.exports= router