var Parse = require('parse').Parse;
var React = require('react');
// ParseReact sits on top of the Parse singleton
var ParseReact = require('parse-react');
// Router
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var utils = require('../utils');

var LoginForm = require('./LoginForm.react.js');
var LoginButton = require('./LoginButton.react.js');
var LogoutButton = require('./LogoutButton.react.js');
var ItemList = require('./ItemList.react.js');
var ItemCreator = require('./ItemCreator.react.js');
var InviteLogin = require('./InviteLogin.react.js');

// Main Layout
var AppMain = React.createClass({
	mixins: [ParseReact.Mixin],

	getInitialState: function() {
		return {
			appTitle: 'React News'
		};
	},

	observe: function  () {
		return {
			user: ParseReact.currentUser
		};
	},

	// componentWillMount: function() {
	// 	this.setState({
	// 		appTitle: utils.getAppTitle()
	// 	});
	// },

	render: function() {
		var loginButton;
		var itemCreator;
		var renderComponent;

		if (this.data.user) {
			loginButton = <LogoutButton user={this.data.user} />;
			itemCreator = <ItemCreator />;
		} else {
			loginButton = <LoginButton />;
			itemCreator = <InviteLogin />;
		}

		return (
			<div>
				<nav className="navbar navbar-default navbar-fixed-top" role="navigation">
					<div className="col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
						<div className="navbar-header">
							<Link to="app" className="navbar-brand">
								<span className="icon-command"></span>
								{this.state.appTitle}
							</Link>
						</div>
						<ul className="nav navbar-nav navbar-right">
							<li>
								<a href="#" data-toggle="modal" data-target="#addModal">
									<span className="icon-circle-plus"></span> Add Resource
								</a>
							</li>
							{loginButton}
						</ul>
					</div>
				</nav>
				<div className="container-fluid">
					<div className="row">
						<div className="col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
							<div className="context-container">
								<RouteHandler />
							</div>
							<footer className="text-center text-muted">
								Made with React + Parse
							</footer>
						</div>
					</div>
					{itemCreator}
					<LoginForm />
				</div>
			</div>
		);
	}
});

module.exports = AppMain;