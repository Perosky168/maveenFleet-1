const express= require('express');
const authController= require('../Controllers/authController')
const userController= require('../Controllers/userController')

const router= express.Router();

router.route('/sign-up').post(userController.signUp);
router.route('/update/:id').patch(userController.updateUser)
router.route('/delete/:id').delete(userController.deleteUser)

module.exports= router