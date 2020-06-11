const mongoose = require('mongoose');
const crypto = require('crypto');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  displayName: String,
  firstName: {
    type: String,
    required: [true, 'first name is required'],
    unique: false,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  },
  middleName: {
    type: String,
    required: [true, 'first name is required'],
    unique: false,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'first name is required'],
    unique: false,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  },
  nickName: String,
  suffix: String,
  gender: {
    type: String,
    enum: ['Male','Female']
  },
  mailingAddress: String,
  mobileNumber: String,
  landLineNumber: String,
  address: String,
  slug: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  username: {
      type: String,
     required: [true, 'Please add an email'],
      unique: true
    },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
    contact: String,
    userType: {
        type: [String],
        enum: [
            'Administrator',
            'LeagueOwner',
            'TeamOwner',
            'Player'
      ],
        default: ['LeagueOwner']
    },
    photoUrl: {
        type: String,
        default: 'no-photo.jpg'
    },
  loggedIn: Date,
  dateCreated: {
    type: Date,
    default: Date.now
  }
});
 
UserSchema.pre('save', async function (next) {

 this.slug = slugify(this.displayName, { lower: true });
 if(!this.isModified('password'))
  {
   next();
  }
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getSignJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE });
}

UserSchema.methods.matchPassword = async function (enteredPassword) {
  result = await bcrypt.compare(enteredPassword, this.password);
  return result;
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;

}

module.exports = mongoose.model('User', UserSchema);