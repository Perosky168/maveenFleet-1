const APIFeatures = require('../utils/apiFeatures')
const Admin = require('../Models/adminModel')
const User = require('../Models/userModel')
const AppError = require('../utils/appError')
const google = require('googleapis')
const catchAsync = require('../utils/catchAsync');
const { Parser } = require('json2csv')


exports.createAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.create(req.body)

    if (!admin) return next(new (AppError('something went wrong', 400)))

    res.status(201).json({
      status: 'success',
      data: admin
    })

  } catch (err) {
    res.status(409).json({
      status: 'fail',
      error: err
    })
  }

};


exports.updateAdmin = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('wrong route to update password', 400))
  };

  const admin = await Admin.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!admin) return next(new AppError('error', 400))

  res.status(200).json({
    status: 'success',
    data: admin
  });

});

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  await Admin.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success'
  })
})




exports.getAllUsers = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  if (req.params.Id) filter = { user: req.params.Id };

  const features = new APIFeatures(User.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc
    }
  });
});


exports.getOneUser = catchAsync(async (req, res, next) => {
  // authController.protect()
  // authController.restrictTo('admin')
  const user = await User.findById(req.params.id)

  if (!user) return next(new AppError('no user with this Id', 404))

  res.status(200).json({
    status: 'success',
    data: user
  })
});

exports.downloadUserdocument = (async (req, res, next) => {
  try {
    let docs = await User.find().lean();
    const fields = ["_id", "name", "email", "status"];
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(docs);

    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvData);
  } catch (err) {
    res.status(400).json({ message: err })
  }
});


exports.analyticsLog = catchAsync(async (req, res, next) => {
  const scopes = 'https://www.googleapis.com/auth/analytics.readonly'


  const jwt = new google.auth.JWT(process.env.client_email, null, process.env.private_key.replace(/\\n/g, "\n"), scopes)

  const view_id = 279731425
  // google.options({auth:jwt})
  await jwt.authorize();
  const result = await google.analytics('v3').data.ga.get({
    auth: jwt,
    ids: 'ga:' + view_id,
    'start-date': '30daysAgo',
    'end-date': 'today',
    metrics: 'ga:pageviews'
  });


  res.status(200).json({
    status: 'success',
    data: result
  })

});