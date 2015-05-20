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

var LoginForm = require('./LoginForm.react.js');
var LoginButton = require('./LoginButton.react.js');
var LogoutButton = require('./LogoutButton.react.js');
var ItemList = require('./ItemList.react.js');
var ItemCreator = require('./ItemCreator.react.js');

// Main Layout
var AppMain = React.createClass({
	mixins: [ParseReact.Mixin],

	observe: function  () {
		return {
			user: ParseReact.currentUser
		};
	},

	render: function() {
		var loginButton;
		var itemCreator;
		var renderComponent;

		if (this.data.user) {
			loginButton = <LogoutButton />;
			itemCreator = <ItemCreator />;
		} else {
			loginButton = <LoginButton />;
			itemCreator = null;
		}

		return (
			<div className="container-fluid">
				<div className="row">
					<nav className="navbar navbar-default" role="navigation">
						<div className="col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
							<div className="navbar-header">
								<a href="#" className="navbar-brand">React</a>
							</div>
							<ul className="nav navbar-nav navbar-right">
								<li>
									<a href="#" data-toggle="modal" data-target="#addModal">
										<span className="icon-circle-plus"></span> Add Resource
									</a>
								</li>
								<li>
									{loginButton}
								</li>
							</ul>
						</div>
					</nav>
					<div className="col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
						
						<div className="item-container">
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
		);
	}
});

module.exports = AppMain;