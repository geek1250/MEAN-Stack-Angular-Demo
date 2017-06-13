// Load the 'User' Mongoose model
const User = require('mongoose').model('User');
const passport = require('passport');

// Create a new 'create' controller method
exports.create = function(req, res, next) {
	// Create a new instance of the 'User' Mongoose model
	const user = new User(req.body);

	// Use the 'User' instance's 'save' method to save a new user document
	user.save((err) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(user);
		}
	});
};

// Create a new 'list' controller method
exports.list = function(req, res, next) {
	// Use the 'User' static 'find' method to retrieve the list of users
	User.find({}, (err, users) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(users);
		}
	});
};

// Create a new 'read' controller method
exports.read = function(req, res) {
	// Use the 'response' object to send a JSON response
	res.json(req.user);
};

// Create a new 'update' controller method
exports.update = function(req, res) {
//exports.update = function(req, res, next) { //old way
	/* old way, password will be same as input, not crypto and this is cause can not login because the system will crypto password before login 
	// Use the 'User' static 'findByIdAndUpdate' method to update a specific user
	User.findByIdAndUpdate(req.user.id, req.body, (err, user) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			//user.password = undefined;
        	//user.salt = undefined;
		
			// Use the 'response' object to send a JSON response
			res.json(user);

		}
	})
	*/
	
	const user = req.user;

    // Update the user fields
    req.user.firstName = req.body.firstName;
    req.user.lastName = req.body.lastName;
    req.user.email = req.body.email
    req.user.username = req.body.username
    req.user.password = req.body.password
    
    // Try saving the updated user
    user.save((err) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
            // Call the next middleware with an error message
			//return next(err); //old way
        } else {
            // Send a JSON representation of the article 
            res.json(user);
        }
    });

};


// Create a new 'delete' controller method
exports.delete = function(req, res, next) {
	// Use the 'User' instance's 'remove' method to save a new user document
	req.user.remove((err) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(req.user);
		}
	})
};

// Create a new 'userByID' controller method
exports.userByID = function(req, res, next, id) {
	// Use the 'User' static 'findOne' method to retrieve a specific user
	User.findOne({
		_id: id
	}, (err, user) => {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Set the 'req.user' property
			req.user = user;

			// Call the next middleware
			next();
		}
	});
};



// Create a new error handling controller method
const getErrorMessage = function(err) {
	// Define the error message variable
	let message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (const errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

// Create a new controller method that signin users
exports.signin = function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            // Use the Passport 'login' method to login
            req.login(user, (err) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                    
                }
            });
        }
    })(req, res, next);
};

// Create a new controller method that creates new 'regular' users
exports.signup = function(req, res) {
	const user = new User(req.body);
	user.provider = 'local';
	
	// Try saving the User
	user.save((err) => {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			
			// Login the user
			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});
}

// Create a new controller method that creates new 'OAuth' users
exports.saveOAuthUserProfile = function(req, profile, done) {
	// Try finding a user document that was registered using the current OAuth provider
	User.findOne({
		provider: profile.provider,
		providerId: profile.providerId
	}, (err, user) => {
		// If an error occurs continue to the next middleware
		if (err) {
			return done(err);
		} else {
			// If a user could not be found, create a new user, otherwise, continue to the next middleware
			if (!user) {
				// Set a possible base username
				const possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

				// Find a unique available username
				User.findUniqueUsername(possibleUsername, null, (availableUsername) => {
					// Set the available user name 
					profile.username = availableUsername;
					
					// Create the user
					user = new User(profile);

					// Try saving the new user document
					user.save(function(err) {
						// Continue to the next middleware
						return done(err, user);
					});
				});
			} else {
				// Continue to the next middleware
				return done(err, user);
			}
		}
	});
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
	// Use the Passport 'logout' method to logout
	req.logout();

	// Redirect the user back to the main application page
	res.redirect('/');
};

// Create a new controller middleware that is used to authorize authenticated operations 
exports.requiresLogin = function(req, res, next) {
	// If a user is not authenticated send the appropriate error message
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	// Call the next middleware
	next();
};