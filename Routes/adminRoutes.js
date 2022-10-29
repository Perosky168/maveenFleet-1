const express= require('express')

const adminController= require('../Controllers/adminController')
const authController= require('../Controllers/authController')

const router= express.Router();

router.route('/sign-up').post(adminController.createVisitor)
router.route('/login').post(authController.login)


module.exports= router;
