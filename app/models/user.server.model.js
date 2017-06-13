// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

// Define a new 'UserSchema'
const UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		// Set an email index
		index: true,
		// Validate the email format
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	username: {
		type: String,
		// Trim the 'username' field
		trim: true,
		// Set a unique 'username' index
		unique: true,
		// Validate 'username' value existance
		//required: true
		required: 'Username is required',
	},
	password: {
		type: String,
		// Validate the 'password' value length
		validate: [
			//(password) => password.length >= 6,
			(password) => password && password.length > 6,
			'Password Should Be Longer'
		]
	},
	website: {
		type: String,
		// Use a setter property to validate protocol existance in 'website' field
		set: function(url) {
			if (!url) {
				return url;
			} else {
				if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
					url = 'http://' + url;
				}

				return url;
			}
		}
	},
	role: {
		type: String,
		// Validate the 'role' value using enum list
		enum: ['Admin', 'Owner', 'User']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		// Validate 'provider' value existance
		required: 'Provider is required'
	},
	providerId: String,
	providerData: {},
	created: {
		type: Date,
		// Create a default 'created' value
		default: Date.now
	}
});

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	const splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

// Create the 'findOneByUsername' static method
UserSchema.statics.findOneByUsername = function(username, callback) {
	// Use the 'findOne' method to retrieve a user document
	this.findOne({
		username: new RegExp(username, 'i')
	}, callback);
};


// Use a pre-save middleware to hash the password
UserSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

// Create an instance method for hashing a password
UserSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

// Create the 'authenticate' instance method
UserSchema.methods.authenticate = function(password) {
	//return this.password === password;
	return this.password === this.hashPassword(password);
};

// Find possible not used username
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	// Add a 'username' suffix
	const possibleUsername = username + (suffix || '');

	// Use the 'User' model 'findOne' method to find an available unique username
	this.findOne({
		username: possibleUsername
	}, (err, user) => {
		// If an error occurs call the callback with a null value, otherwise find find an available unique username
		if (!err) {
			// If an available unique username was found call the callback method, otherwise call the 'findUniqueUsername' method again with a new suffix
			if (!user) {
				callback(possibleUsername);
			} else {
				return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('User', UserSchema);