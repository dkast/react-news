var React = require('react');
var Parse = require('parse').Parse;

var LogoutButton = React.createClass({
	logOut: function(e) {
		e.preventDefault();
		Parse.User.logOut();
	},

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
						<a href="#">Account</a>
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
	}
});

module.exports = LogoutButton;