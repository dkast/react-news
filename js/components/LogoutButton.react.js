var React = require('react');
var Parse = require('parse').Parse;

var LogoutButton = React.createClass({
	logOut: function(e) {
		e.preventDefault();
		Parse.User.logOut();
	},

	render: function() {
		return (
			<a href="#" onClick={this.logOut} className="logout-button">Logout</a>
		);
	}
});

module.exports = LogoutButton;