const User= require('../Models/adminModel')
const AppError= require('../utils/appError')
const google= require('googleapis')
const scopes= 'https://www.googleapis.com/auth/analytics.readonly'
const jwt= new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY,scopes)
const view_id= 340951165



exports.createAdmin= async(req, res, next)=>{
        const admin= await User.create(req.body)

        if(!admin) return next(new(AppError('something went wrong', 400)))

        res.status(200).json({
            status: 'success',
            data: admin
        })

    
};


exports.googleAnalytics= async(req, res, next)=>{
  try{
    const result= await google.analytics('v3').data.ga.get({
      'auth': jwt,
      'ids': 'ga:'+ view_id,
      'start-date': '30daysAgo',
      'end-date':'today',
      'metrics': 'ga:pageviews'
    })
    console.log(result)
    res.status(200).json({
      status: 'success',
      data: result

    })
  }catch(err){
    res.status(500).json({
      status: "fail",
      data: err
    })

  }
}

  