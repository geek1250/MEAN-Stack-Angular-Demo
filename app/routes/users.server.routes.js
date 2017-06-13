// Load the 'users' controller
const users = require('../../app/controllers/users.server.controller');
const passport = require('passport');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'users' base routes 
	app.route('/api/users')
	   .post(users.create)
	   .get(users.list);

	// Set up the 'users' parameterized routes
	app.route('/api/users/:userId')
	   .get(users.read)
	   .put(users.update)
	   .delete(users.delete);

	// Set up the 'userId' parameter middleware
	app.param('userId', users.userByID);


	

	// Set up the 'signup' routes 
    app.route('/api/auth/signup').post(users.signup);

    // Set up the 'signin' routes 
    app.route('/api/auth/signin').post(users.signin);

    // Set up the 'signout' route
    app.route('/api/auth/signout').get(users.signout);

	// Set up the Facebook OAuth routes 
	app.get('/oauth/facebook', passport.authenticate('facebook', {
		failureRedirect: '/signin'
	}));
	app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));

	// Set up the Twitter OAuth routes 
	app.get('/oauth/twitter', passport.authenticate('twitter', {
		failureRedirect: '/signin'
	}));
	app.get('/oauth/twitter/callback', passport.authenticate('twitter', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));

	// Set up the Google OAuth routes 
	app.get('/oauth/google', passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		],
		failureRedirect: '/signin'
	}));
	app.get('/oauth/google/callback', passport.authenticate('google', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));
};