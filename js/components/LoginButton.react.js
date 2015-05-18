var React = require('react');

var LoginButton = React.createClass({
	render: function() {
		return (
			<span className="loginButton">
				<a href="#" data-toggle="modal" data-target="#loginModal">Log in</a>
			</span>
		);
	}
});

module.exports = LoginButton;