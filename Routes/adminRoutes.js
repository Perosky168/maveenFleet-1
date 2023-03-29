const express= require('express')

const adminController= require('../Controllers/adminController')
const authController= require('../Controllers/authController')

const router= express.Router();

router.route('/admin/sign-up').post(adminController.createAdmin)
router.route('/admin/login').post(authController.login)

//Protected Routes
router.use(authController.protect,authController.restrictTo('admin'))
router.route('/analytics').get(adminController.analyticsLog)
router.route('/all-users').get(adminController.getAllUsers)
router.route('/user/:id').get(adminController.getOneUser)
router.route('/admin/update-profile').patch(adminController.updateAdmin)
router.route('/admin/delete/:id').delete(adminController.deleteAdmin)

module.exports= router;
