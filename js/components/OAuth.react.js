var React = require('react');
var Router = require('react-router');
var querystring = require('query-string');
var Parse = require('parse').Parse;
var Loader = require('halogen/ScaleLoader');
// Router
var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;

var OAuth = React.createClass({
	mixins: [Navigation],

	getInitialState: function() {
		var parsed = querystring.parse(location.search);
		return {
			code: parsed.code,
			error:  null
		};
	},

	componentDidMount: function() {
		var code = this.state.code;
		var self = this;
		Parse.Cloud.run('getGitHubAccess', {code: code}).then(function(result){
			Parse.User.become(result).then(function(user) {
				self.transitionTo('/');
				// window.location.replace('../');
			}, function(error) {
				self.setState({
					error: 'Login with GitHub Failed'
				});
			});
		}, function(error){
			self.setState({
				error: 'Something went wrong :('
			});
		});
	},
	
	render: function() {
		return (
			<div>
				{
					this.state.error ?
					<div className="alert alert-danger">{this.state.error}</div> :
					<div className="loader"><Loader color="#9c27b0" height="16px" margin="2px"/></div>
				}
			</div>
		);
	}

});

module.exports = OAuth;