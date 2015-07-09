var React = require('react');
var Parse = require('parse').Parse;
// Router
var Router = require('react-router');
var Link = Router.Link;

var LogoutButton = React.createClass({

	render: function() {
		return (
			<li className="dropdown">
				<a href="#" className="dropdown-toggle" data-toggle="dropdown" 
				role="button" aria-expanded="false">
					<span className="icon-head"></span>
					{this.props.user.username}
					&nbsp;
					<span className="caret"></span>
				</a>
				<ul className="dropdown-menu" role="menu">
					<li>
						<Link to="account">Account</Link>
					</li>
					<li className="divider"></li>
					<li>
						<a href="#" onClick={this.logOut} className="logout-button">
							Logout
						</a>
					</li>
				</ul>
				
			</li>
		);
	},

	logOut: function(e) {
		e.preventDefault();
		Parse.User.logOut();
	}
});

module.exports = LogoutButton;