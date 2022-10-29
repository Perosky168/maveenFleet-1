const mongoose= require('mongoose')
const bcrypt= require('bcrypt')
const crypto= require('crypto')

const adminSchema= new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'provide a valid e-mail addresss']
    },
    name: {
        type: String,
        required: [true, 'please what is your name']
    },
    options:{
        type: String,
        enum:['joiner', 'interested in partenership', 'want to stay in touch']
    }
});


adminSchema.pre('save', async function(next){
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