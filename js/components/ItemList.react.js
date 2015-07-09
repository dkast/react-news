var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var Cookie = require('react-cookie');
var utils = require('../utils');
var Router = require('react-router');
var Loader = require('halogen/ScaleLoader');

var ItemEntry = require('./ItemEntry.react.js');
var ItemMoreButton = require('./ItemMoreButton.react.js');

var Link = Router.Link;

var ItemList = React.createClass({
	mixins: [ParseReact.Mixin],

	contextTypes: {
		router: React.PropTypes.func
	},

	getDefaultProps: function() {
		return {
			filterBy: 'score',
			limit: 10,
			showPagination: true,
			userProfile: null
		};
	},

	getInitialState: function() {
		var page;
		if(this.context.router.getCurrentParams().page) {
				page = this.context.router.getCurrentParams().page;
		} else {
			page = 1;
		}
		return {
			token: Cookie.load('token'),
			page: page,
		};
	},

	componentWillReceiveProps: function(nextProps) {
		console.log('componentWillReceiveProps');
		if(this.context.router.getCurrentParams().page) {
			this.setState({
				page: this.context.router.getCurrentParams().page 
			});
		} else {
			this.setState({
				page: 1
			});
		}

		// votes Query is a function, is not called automatically when state is changed
		this.refreshQueries('votes');
	},

	observe: function(props, state) {
		var self = this;
		var limit = props.limit;
		var filterBy = props.filterBy;
		var skip = (state.page -1) * limit;

		return {
			items: (self.getItems(props, state)),
			votes: (self.getVotes()),
			user: ParseReact.currentUser
		};

		// if(props.userProfile) {
		// 	return {
		// 		items: (new Parse.Query('Links'))
		// 			.descending('score')
		// 			.include('createdBy')
		// 			.equalTo('createdBy', props.userProfile.id)
		// 			.skip(skip)
		// 			.limit(limit),
		// 		votes: (self.getVotes()),
		// 		user: ParseReact.currentUser
		// 	};
		// } else {
		// 	return {
		// 		items: (new Parse.Query('Links'))
		// 			.descending('score')
		// 			.include('createdBy')
		// 			.skip(skip)
		// 			.limit(limit),
		// 		votes: (self.getVotes()),
		// 		user: ParseReact.currentUser
		// 	};
		// }
	},

	getItems: function(props, state) {
		var self = this;
		var limit = props.limit;
		var filterBy = props.filterBy;
		var skip = (state.page -1) * limit;

		var query = new Parse.Query('Links')
			.include('createdBy')
			.skip(skip)
			.limit(limit);

		console.log(this.pendingQueries().length);
		switch(filterBy) {
			case 'user':
				query.descending('createdAt');
				if (props.userProfile) { 
					query.equalTo('createdBy', {
		        __type: 'Pointer',
						className: '_User',
						objectId: props.userProfile.objectId
					});
					return query;
				}
				break;
			case 'score':
				query.descending('score');
			break;
		}

		return query;
	},

	getVotes: function() {
		var limit = this.props.limit;
		var skip = (this.state.page -1) * limit;
		var linksQuery = new Parse.Query('Links')
			.descending('score')
			.include('createdBy')
			.skip(skip)
			.limit(limit);

		var query = new Parse.Query('Votes');
		query.matchesQuery('link', linksQuery);
		query.include('user');
		return query;
	},

	render: function() {
		var self = this;
		var username;
		var token;
		var nextPage;
		var moreButton;
		var loading;

		if(this.state.token) {
			token = this.state.token;
		} else {
			token = null;
		}

		if(this.state.page) {
			nextPage = parseInt(this.state.page) + 1;
		} else {
			nextPage = 1;
		}

		if((this.data.items.length == this.props.limit) && (this.props.showPagination)) {
			moreButton = <ItemMoreButton nextPage={nextPage} />;
		} else {
			moreButton = null;
		}

		if(this.pendingQueries().length) {
			loading = <Loader color="#9c27b0" height="16px" margin="2px"/>;
		} else {
			loading = null;
		}

		return (
			<div>
				<div className="loader">
					{loading}
				</div>
				<div className={this.pendingQueries().length ? 'item-list loading' : 'item-list'}>
					{this.data.items.map(function(i) {
						//loop items

						var disableVote = false;
						self.data.votes.forEach(function(j){
							
							// if have votes
							if (i.id == j.link.id) {
								if (j.user) {

									if(self.data.user) {
										username = self.data.user.username;
									} else {
										username = null;
									}

									if (j.user.username === username) {
										disableVote = true;
									}
								} 

								if (j.token) {
									if (j.token === token) {
										disableVote = true;
									}
								}
							}
						});

						return(
							<ItemEntry
								key={i.id} 
								item={i} 
								onUpVoteClick={self.handleUpVoteClick} 
								disableVote={disableVote} />
						);
					})}
					{moreButton}
				</div>
			</div>
		);
	},

	handleUpVoteClick: function(id, author) {
		var token = this.state.token;
		var user;

		if(this.data.user) {
			user = this.data.user;
		} else {
			user = null;
		}

		if(token) {
			console.log(token);
		} else {
			token = utils.generateUUID();
			this.setState({
				token: token
			});
			//save token
			Cookie.save('token', token);
		}

		if(user) {
			var voteUser = ParseReact.Mutation.Create('Votes', {
				link: id,
				user: user,
				token: token
			}).dispatch();
		} else {
			//anonymous
			var voteAnon = ParseReact.Mutation.Create('Votes', {
				link: id,
				token: token
			}).dispatch();
		}
		

		//ParseReact.Mutation.Increment(id, 'votes').dispatch();
		Parse.Cloud.run('incrementLinkVotes', {link: id}, {
			success: function(result) {
				// link updated
			},
			error: function(error) {
				console.log(error);
			}
		});
		
		Parse.Cloud.run('incrementUserVotes', {username: author.username}, {
			success: function(result) {
				// link updated
			},
			error: function(error) {
				console.log(error);
			}
		});

		this.refreshQueries(['items', 'votes']);
	}
});

module.exports = ItemList;