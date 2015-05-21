var React = require('react');

var LoginButton = React.createClass({
	render: function() {
		return (
			<a href="#" data-toggle="modal" data-target="#loginModal" className="login-button">
				<span className="icon-head"></span> Log in
			</a>
		);
	}
});

module.exports = LoginButton;