var LocalStrategy = require('passport-local').Strategy;
var User          = require('../models/users');

module.exports = function (passport) {
    
    // Serialize and deserialize user instances to and form the session
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
    
    // Login using username + password
    passport.use(new LocalStrategy(function(username, password, done) {

        // Find user with the given username
        User.findOne({ username: username }, function (err, user) {
    
            // Err access db
            if (err) {
              return done(err);
            }
            // Err user doesn't exist
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            // Verify password
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return done(err); }
                
                // Err wrong password
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                // Success
                return done(null, user);
            });
        });
      }
    )); // end LocalStrategy
};