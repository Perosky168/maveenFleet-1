const mongoose= require('mongoose')
const bcrypt= require('bcrypt')
const crypto= require('crypto')
const validator= require('validator')

const adminSchema= new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    name: {
        type: String,
        required: [true, 'please what is your name']
    },
    password: {
        type: String,
        minlength: 8,
        select: false,
        required:[true, 'input your password']
    }, 
    role: String,
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
      }
});


adminSchema.pre('save', async function(next){
    this.role= 'admin'
    if(!this.isModified('password')) return next();

    this.password= await bcrypt.hash(this.password, 12);

    this.confirmPassword= undefined;
    next();    
});

adminSchema.methods.correctPassword =  async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  


adminSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
    };


adminSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
    };
const Admin= mongoose.model('Admin', adminSchema)

module.exports = Admin