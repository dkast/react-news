var React = require('react');
var Router = require('react-router');


var User = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			userId: this.context.router.getCurrentParams().userId
		};
	},

	render: function() {
		return (
			<span>{this.state.userId}</span>
		);
	}

});

module.exports = User;