require('cloud/app.js');

var _ = require('underscore');
var Buffer = require('buffer').Buffer;
var querystring = require('querystring');

var githubClientId = 'client_id';
var githubClientSecret = 'client_secret';

var githubRedirectEndpoint = 'https://github.com/login/oauth/authorize?';
var githubValidateEndpoint = 'https://github.com/login/oauth/access_token';
var githubUserEndpoint = 'https://api.github.com/user';

Parse.Cloud.define('incrementUserVotes', function(request, response) {
	//Avoid abuse counting only votes from registered users
	// if(!request.user) {
	// 	response.error('Must be signed in to call this function');
	// 	return;
	// }

	Parse.Cloud.useMasterKey();

	var queryUser = new Parse.Query(Parse.User);
	queryUser.equalTo('username', request.params.username);
	
	queryUser.first({
		success: function(levelUser) {
			levelUser.increment('votes');

			//Save changes to user
			levelUser.save(null, {
				success: function(levelUser) {
					response.success('Successfully updated user');
				},
				error: function(levelUser, error) {
					response.error('Could not save changes to user');
				}
			});
		},
		error: function(error) {
			response.error('User not found');
		}
	});
});

Parse.Cloud.define('incrementLinkVotes', function(request, response) {
	//Avoid abuse counting only votes from registered users
	// if(!request.user) {
	// 	response.error('Must be signed in to call this function');
	// 	return;
	// }

	Parse.Cloud.useMasterKey();

	var queryLink = new Parse.Query('Links');
	queryLink.get(request.params.link.objectId, {
		success: function(link) {
			link.increment('votes');

			//Save changes to link
			link.save(null, {
				success: function(link) {
					response.success('Successfully updated link');
				},
				error: function(link, error) {
					response.error('Could not save changes to link');
				}
			});
		},
		error: function(error) {
			response.error('Link not found');
		}
	});
	
});

Parse.Cloud.define('getGitHubAccess', function(request, response) { 
	if(!request.params.code) {
		response.error('Code is not valid');
		return;
	}
	// Validate and Exchange the code param for an acces token from Github
	var code = request.params.code;
	var token;
	var userData;
	Parse.Promise.as().then(function() {
		return getGitHubAccessToken(code);
	}).then(function(access) {
		// Process the response from Github
		var githubData = access.data;
		if (githubData && githubData.access_token && githubData.token_type) {
			token = githubData.access_token;
			return getGitHubUserDetails(token);
		} else {
			return Parse.Promise.error('Invalid access request');
		}
	}).then(function(userDataResponse) {
		// Process the users GitHub details
		userData = userDataResponse.data;
		if (userData && userData.login && userData.id) {
			return upsertGitHubUser(token, userData);
		} else {
			return Parse.Promise.error('Unable to parse GitHub data');
		}
	}).then(function(user) {
		console.log('Sending Session Token');
		response.success(user.getSessionToken());
	}, function(error) {
		if (error.code == Parse.Error.INVALID_SESSION_TOKEN) {
			console.log('Try again');
			Parse.User.logOut();
			//return Parse.User.logIn(user.get('username'), password.toString('base64'));
			return Parse.Promise.as().then(function() {
				return upsertGitHubUser(token, userData);
			}).then(function(user) {
				console.log('Second Chance, sending Session Token');
				response.success(user.getSessionToken());
			}, function(error) {
				response.error(error);
			});
		} else {
			response.error(error);	
		}
	});
});

var getGitHubAccessToken = function(code) {
	var body = querystring.stringify({
		client_id: githubClientId,
		client_secret: githubClientSecret,
		code: code
	});
	return Parse.Cloud.httpRequest({
		method: 'POST',
		url: githubValidateEndpoint,
		headers: {
			'Accept': 'application/json',
			'User-Agent': 'Parse.com Cloud Code'
		},
		body: body
	});
};

var getGitHubUserDetails = function(accessToken) {
	return Parse.Cloud.httpRequest({
		method: 'GET',
		url: githubUserEndpoint,
		params: {access_token: accessToken},
		headers: {
			'User-Agent': 'Parse.com Cloud Code'
		}
	});
};

var upsertGitHubUser = function(accessToken, githubData) {
	var password = new Buffer(24);
	var query = new Parse.Query('TokenStorage');

	query.equalTo('githubId', githubData.id);
	query.ascending('createdAt');
	// Check if this githubId has previously logged in
	return query.first({useMasterKey: true}).then(function(tokenData) {
		// If not, create a new user
		if (!tokenData) {
			console.log('Adding new user');
			return newGitHubUser(accessToken, githubData);
		}

		// If found, fetch user
		var user = tokenData.get('user');
		return user.fetch({useMasterKey: true}).then(function(user){
			console.log('User found');
			// Update the access token if is different
			if (accessToken !== tokenData.get('accessToken')) {
				tokenData.set('accessToken', accessToken);
			}
			tokenData.save(null, {useMasterKey: true});

			// Generate new password so user can login
			_.times(24, function(i) {
				password.set(i, _.random(0, 255));
			});

			user.set('password', password.toString('base64'));
			user.set('contact', githubData.email);
			user.set('fullname', githubData.name);
			user.set('bio', githubData.bio);
			user.set('website', githubData.blog);
			user.set('avatarURL', githubData.avatar_url);

			return user.save(null, {useMasterKey: true});
		}).then(function(user) {
			// Return the user object
			//return Parse.Promise.as(user);
			console.log(user.get('username'));
			return Parse.User.logIn(user.get('username'), password.toString('base64'));
		});
	});
};

var newGitHubUser = function(accessToken, githubData) {
	var user = new Parse.User();
	// Generate random password
	var username = githubData.login;
	var password = new Buffer(24);
	_.times(24, function(i) {
		password.set(i, _.random(0, 255));
	});

	user.set('username', username);
	user.set('password', password.toString('base64'));
	user.set('votes', 0);
	user.set('posts', 0);
	// Sign up
	return user.signUp().then(function(user) {
		// create new TokenStorage
		var TokenStorage = Parse.Object.extend('TokenStorage');
		var ts = new TokenStorage();
		ts.set('githubId', githubData.id);
		ts.set('githubLogin', githubData.login);
		ts.set('accessToken', accessToken);
		ts.set('user', user);

		return ts.save(null, {useMasterKey: true});
	}).then(function(tokenStorage) {
		console.log('User created, update user');
		return upsertGitHubUser(accessToken, githubData);
	});
};

Parse.Cloud.job('updateScoreItems', function(request, status) {
	Parse.Cloud.useMasterKey();

	var gravity = 1.8;
	
	var itemsToSave = [];
	var query = new Parse.Query('Links');
	query.descending('createdAt');
	query.limit(1000);

	// query.each(function(item) {
	// 	var hourAge = (Date.now() - item.createdAt) / (1000 * 3600);
	// 	var score = (item.get('votes') - 1) / Math.pow(hourAge + 2, gravity);
		
	// 	console.log(item.createdAt);
		
	// 	item.set('score', score);
	// 	return item.save();
	// }).then(function() {
	// 	status.success('Score updated');
	// }, function(error) {
	// 	status.error('Something went wrong');
	// });

	query.find({
		success: function(items) {
			_.each(items, function(item) {
				var hourAge = (Date.now() - item.createdAt) / (1000 * 3600);
				var votes = item.get('votes');
				var score = votes / Math.pow(hourAge + 2, gravity);
				item.set('score', score);
				itemsToSave.push(item);
			});
		}

	}).then(function() {
		Parse.Object.saveAll(itemsToSave, {
			success: function(list) {
				if (status) {
					status.success('Score updated');
				}
			},
			error: function(model, error) {
				if (status) {
					status.error(error);
				}
			}
		});
	}, function(error) {
		status.error('updateScoreItems failed');
	});
});