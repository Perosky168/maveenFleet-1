const express= require('express')

const adminController= require('../Controllers/adminController')
const authController= require('../Controllers/authController')

const router= express.Router();

router.route('/sign-up').post(adminController.createAdmin)
router.route('/login').post(authController.login)
router.route('/analytics').get(adminController.analyticsLog)


module.exports= router;
