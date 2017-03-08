'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    bcrypt   = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var User = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'The field "username" is required']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'The field "email" is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        trim: true,
        minlength: [3, 'Password must be at least 3 characters'],
        required: [true, 'The field "password" is required']
    }
});

// Hash the password
User.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // Hash the password
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

// Check password match
User.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', User);