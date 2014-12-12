var LocalStrategy   = require('passport-local').Strategy;
var bcrypt   = require('bcrypt-nodejs');

function generateHash(password) {
	return bcrypt.hashSync(password);
}

function validPassword(password, user) {
	return bcrypt.compareSync(password, user.password);
}

// expose this function to our app using module.exports
module.exports = function(passport) {
	console.log("loaded module");
	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
		console.log("signup");
		// do a database search to find if the user currently exists.
		req.collections.users.findOne({'username': username}, function(err, user) {
            // if there are any errors, return the error
            if (err) {
				console.log(err);
                return done(err);
			}

            // check to see if there's already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUser = {
					'username' : username,
					'password' : generateHash(password)
				}

                req.collections.users.insert( newUser, function(err, result) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        req.collections.users.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!validPassword(password, user)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			}

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
