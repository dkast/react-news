var React = require('react');
var Parse = require('parse').Parse;

var LogoutButton = React.createClass({
	logOut: function(e) {
		e.preventDefault();
		Parse.User.logOut();
	},

	render: function() {
		return (
			<a href="#" onClick={this.logOut} className="logout-button">
				<span className="icon-head"></span> Logout
			</a>
		);
	}
});

module.exports = LogoutButton;