var React = require('react');
var Router = require('react-router');
var Loader = require('halogen/ScaleLoader');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');

var Avatar = require('./Avatar.react.js');
var ItemList = require('./ItemList.react.js');

var User = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	mixins: [ParseReact.Mixin],

	observe: function (props, state) {
		return {
			userProfile: (new Parse.Query('User'))
				.equalTo('username', state.userId)
				.limit(1)
		};
	},

	getInitialState: function() {
		return {
			userId: this.context.router.getCurrentParams().userId
		};
	},

	render: function() {
		var user;
		var loading;
		var fullname;
		var bio;
		var website;
		var twitter;
		var votes;
		var posts;
		
		if(this.pendingQueries().length) {
			loading = <Loader color="#9c27b0" height="16px" margin="2px"/>;
			votes = 0;
			posts = 0;
		} else {
			loading = null;
			user = this.data.userProfile[0];
			fullname =  user.fullname;
			bio =  user.bio;
			if (user.website) {
				website = <span>
										<a href={user.website}>
											<span className="icon-link"></span>
										</a>
									</span>;
			}
			if (user.twitter) {
				twitter = <span>
										<a href={'http://twitter.com/' + user.twitter}>
											<span className="ion-social-twitter"></span>
										</a>
									</span>;
			}
			votes =  user.votes;
			posts =  user.posts;
		}

		return (
			<div>
				<div className="user-profile col-xs-12">
					<Avatar name={fullname} />
					<p className="lead">{fullname}</p>
					<p className="bio">{bio}</p>
					<div className="col-xs-12 icons">
						{twitter}
						{website}
					</div>
					<div className="col-xs-3 col-xs-offset-3 points">
						<strong>{votes}</strong>
						<span>Points</span>
					</div>
					<div className="col-xs-3 posts">
						<strong>{posts}</strong>
						<span>Posts</span>
					</div>
				</div>
				<div className="loader">
					{loading}
				</div>
				<h3>Recent Posts</h3>
				<ItemList 
					filterBy={'user'}
					userProfile={this.data.userProfile[0]} 
					showPagination={false} />
			</div>
		);
	},

	updateInfo: function() {
		var user;
		if (this.data.userProfile.length) {
			user = this.data.userProfile[0];
		}

		if (user) {
			this.setState({
				fullname: user.fullname,
				bio: user.bio,
				website: user.website,
				twitter: user.twitter,
				votes: user.votes 
			});
		}
	},

});

module.exports = User;