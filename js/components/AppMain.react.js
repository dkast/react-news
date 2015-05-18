var Parse = require('parse').Parse;
var React = require('react');
// ParseReact sits on top of the Parse singleton
var ParseReact = require('parse-react');

var LoginForm = require('./LoginForm.react.js');
var LoginButton = require('./LoginButton.react.js');
var LogoutButton = require('./LogoutButton.react.js');
var ItemList = require('./ItemList.react.js');
var ItemCreator = require('./ItemCreator.react.js');

// Main Layout
var AppMain = React.createClass({
	mixins: [ParseReact.Mixin],

	getInitialState: function() {
		return {
			page: 1,
			renderComponent: null
		};
	},

	observe: function  () {
		return {
			user: ParseReact.currentUser
		};
	},

	componentDidMount: function() {
		var setState = this.setState;
		var router = Router ({
			'/': setState.bind(this, {renderComponent: 'ItemList'}),
			'/user': setState.bind(this, {renderComponent: 'User'})
		});
		router.init('/');
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

		switch (this.state.renderComponent) {
			case 'Itemlist':
				renderComponent = <ItemList />;
				break;
			case 'User':
				renderComponent = <User />;
				break;
			default:
				renderComponent = <ItemList />;
		}

		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1">
						<nav className="navbar navbar-inverse" role="navigation">
							<div className="container-fluid">
								<div className="navbar-header">
									<a href="#" className="navbar-brand">React</a>
								</div>
								<div className="navbar-text navbar-right">
									{loginButton}
								</div>
								<ul className="nav navbar-nav navbar-right">
									<li>
										<a href="#" data-toggle="modal" data-target="#addModal">
											<span className="icon-circle-plus"></span> Add Resource
										</a>
									</li>
								</ul>
							</div>
						</nav>
						<div className="item-container">
							{renderComponent}
						</div>
					</div>
				</div>
				{itemCreator}
				<LoginForm />
			</div>
		);
	}
});

module.exports = AppMain;