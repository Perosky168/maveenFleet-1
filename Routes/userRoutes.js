const express= require('express')

const visitorController= require('../Controllers/visitorController')

const router= express.Router();

router.route('/').post(visitorController.createVisitor)


module.exports= router;
