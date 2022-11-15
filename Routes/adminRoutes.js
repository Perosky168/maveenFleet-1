const express= require('express')

const adminController= require('../Controllers/adminController')
const authController= require('../Controllers/authController')

const router= express.Router();

router.route('/admin/sign-up').post(adminController.createAdmin)
router.route('/admin/login').post(authController.login)

//Protected Routes
// router.use(authController.protect,authController.restrictTo('admin'))
router.route('/analytics').get(adminController.analyticsLog)
router.route('/all-users').get(adminController.getAllUSers)
router.route('/user/:id').get(adminController.getOneUser)

module.exports= router;
