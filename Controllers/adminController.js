const User= require('../Models/adminModel')
const AppError= require('../utils/appError')
const google= require('googleapis')
const scopes= 'https://www.googleapis.com/auth/analytics.readonly'
const client_email= "mavenfleet-analytics@maveenfleet-analytics.iam.gserviceaccount.com"
const private_key= "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDpdroNcDcyHUJC\nrsGFYHSMDpKlrdMFVnhTnMr7lspel71Obfr9pWNmJwFLJo82no1885nrwrtB33N6\nnQPScHN7GBS7olDi39ARAIcdm1fl9OV3c1PYeegIf9eMr630WiBZ7SsOQqOCAHH/\naSZR54bryGuEGxzspy1aYzaw68xYHad2dM/PaLMebgPxbEa2lHSWfPc//nGQAFJ9\nR8eOOor+wXUYQdibLAC2XkCVtcQYHELEwLHkp1GegPqlO4v5qgwCyZyYdg9n3GB5\nQ5irpczQ0b+8k1h+TQKQunJsjME4xEN5uX8qQahSg6VrZgBYlPrXFfiqUaj2nM7p\ngatc1yHdAgMBAAECggEABzKSBlZkyBe05wAHdvdhw+MyadmOFWDdsClcbIZw+PY8\n2NDC11jUk7TC7LKpTv+XueENupRRuD2SFWArpAfGIDkQp/875KfXRdihEcNHdCGS\ncsPFjsvJ6fu9AHAI0P93msq0ppK4J4qynZfyr8+q0rlvnSCz3B4NdgA9G6hNXZQq\n0PqTrGwgy5UFBFPq4D/uVVCv4OuVidkR3HDgmCb1KVRtG3VbAkF+P4ieaeV3boqn\nD7K0Pmncox3a7cJO1fQPEl4/i6uKM2udVgoPrF04vqQ3TxRNkWHbBVCgkoZpr3YY\nQGeRa/642kmwSxJaGBRntejCd/Tqmr0Rg7b9HOHZOQKBgQD5W+jjhCWyPXjOqung\niVxC5PjD7WHOWkmPl9RMfCy6+zz5AAo3kAKLK1c8GXZY63uzwSbPLglrAs2DrAC5\nbU7g3+VL8ycLQe5tEHOHJha97p6idYSO23/Pmh9XKuaFM8Nf2RjT0DXYdRbUiF46\ny2bJc9lcZXFDYV2Sh8WOjsSQ9QKBgQDvrnIemr0x7C5VlzEPsaBls4FAsJ32z6P2\n8DxmpRdjgpFEZC5IyPWHPfH1sNchuK/wqaBF/SCktiWXfFaEjmfhhGdsY/2/aXjo\nWBZbggiSNzDoae/UqIbIRDBDr/AH3FwHqT+KmGzEvtWhWDQljmJczqBWSs9bQng3\nQ6D02dMcSQKBgQCXg2YdoDT7eWiHQsh6+1uI9fHFst5D8Q5TZrDDjIvtTSz+Ky0K\nF8HD6CDITrxfSS5PyaQYLOPiFsDjKccC5E0STFjZ7jOiHnyN3noj+1vEKlJPalKS\nLwMZFI/IejO5aftjqNjyEsg07uhhWT7QQLkC3RaMksLgay/dEgxTE6KSZQKBgGfV\nw0rO7rf6AfjCj1alNT/aDFziJw0N15LbcM9nJkLOBfEDFaoipXv5siEmg4zwXgh8\n9BpeFw5EevStwS2cJBTnL4cdqoiKQP8nakgqhVwS3PVTL7uJZxrLr70jM3G0XYpU\nIFsCvdxecF59v9mlXaenPH8l2b9HhJ0sh0aMN5FBAoGBAJmhmB7zElf8Ld2F8rPW\nclL/1A4YKaF36mBOyV9ZN52h2UJsQwgUZSdNWpgU8KciCCmlIh9HmY1GgCj4KL6L\ne7AyLnODcnI6howeFWhr+zQSN0ioS+9faJ0pBRPDMuayzNRpEwg0+NMpnmXOmnhn\niwh5uBtUYE/t/8xBS1NfBUto\n-----END PRIVATE KEY-----\n"

const jwt= new google.auth.JWT(client_email, null, private_key.replace(/\\n/g, "\n"),scopes)

console.log(process.env.PRIVATE_KEY)

exports.createAdmin= async(req, res, next)=>{
        const admin= await User.create(req.body)

        if(!admin) return next(new(AppError('something went wrong', 400)))

        res.status(200).json({
            status: 'success',
            data: admin
        })

    
};


exports.analyticsLog= async(req, res, next)=>{
  try{
    const view_id= 4258917130
    const result= await google.analytics('v3').data.ga.get({
      'auth': jwt,
      'ids': 'ga:'+ view_id,
      'start-date': '30daysAgo',
      'end-date':'today',
      'metrics': 'ga:pageviews'
    })
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

  