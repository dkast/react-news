var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var Cookie = require('react-cookie');
var utils = require('../utils');
var Router = require('react-router');

var ItemEntry = require('./ItemEntry.react.js');
var ItemMoreButton = require('./ItemMoreButton.react.js');

var Link = Router.Link;

var ItemList = React.createClass({
	mixins: [ParseReact.Mixin],

	contextTypes: {
		router: React.PropTypes.func
	},

	getInitialState: function() {
		var page;
		if(this.context.router.getCurrentParams().page) {
				page =  this.context.router.getCurrentParams().page;
		} else {
			page = 1;
		}
		return {
			token: Cookie.load('token'),
			limit: 10,
			page: page,
		};
	},

	componentWillReceiveProps: function(nextProps) {
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
		var limit = state.limit;
		var skip = (state.page -1) * limit;
		return {
			items: (new Parse.Query('Links'))
				.descending('createdAt')
				.include('createdBy')
				.skip(skip)
				.limit(limit),
			votes: (self.getVotes()),
			user: ParseReact.currentUser
		};
	},

	getVotes: function() {
		var limit = this.state.limit;
		var skip = (this.state.page -1) * limit;
		var linksQuery = new Parse.Query('Links')
			.descending('createdAt')
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

		if(this.data.items.length == this.state.limit) {
			moreButton = <ItemMoreButton nextPage={nextPage} />;
		} else {
			moreButton = null;
		}

		return (
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
						<ItemEntry key={i.id} item={i} onUpVoteClick={self.handleUpVoteClick} disableVote={disableVote} />
					);
				})}
				{moreButton}
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
		

		ParseReact.Mutation.Increment(id, 'votes').dispatch();
		//ParseReact.Mutation.Increment(author, 'votes').dispatch();
		this.refreshQueries('votes');
	}
});

module.exports = ItemList;