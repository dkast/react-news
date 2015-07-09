var Parse = require('parse').Parse;
var React = require('react');
var querystring = require('query-string');

var LoginForm = React.createClass({
	getInitialState: function() {
		return {
			error: null, 
			signup: false
		};
	},

	render: function() {
		return (
			<div className="modal jelly" id="loginModal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" arial-label="close">
								<span className="icon-cross"></span>
							</button>
							<h4 className="modal-title">Welcome!</h4>
						</div>
						<div className="modal-body">
							<div className="lead text-center">
								{/**
								<div className="input-icon">
									<span className="icon-head"></span>
									<input type="text" className="form-control" 
										placeholder="Username" ref="username" id="username"/>
								</div>
								<div className="input-icon">
									<span className="icon-lock"></span>
									<input type="password" className="form-control" 
										placeholder="Password" ref="password" id="password"/>
								</div>
								**/}
								<p>Please sign in with your Github account</p>
								<button type="button" className="btn btn-purple btn-embossed"
									onClick={this.authorize} >
									<span className="ion-social-github"></span>
									&nbsp;
									Sign in With Github
								</button>
								{
									this.state.error ?
									<div className="alert alert-danger">{this.state.error}</div> :
									null
								}
							</div>
						</div>
						{/**
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" 
								onClick={this.submit.bind(this, 'login')} >
								Log in
							</button>
							<button type="button" className="btn btn-purple"
								onClick={this.submit.bind(this, 'signup')} >
								Sign up
							</button>
						</div>
						**/}
					</div>
				</div>
			</div>
		);
	},

	// componentWillUnmount: function() {
	// 	$('#loginModal').modal('hide');
	// },

	submit: function(action) {
		var self = this;
		var username = React.findDOMNode(this.refs.username).value;
		var password = React.findDOMNode(this.refs.password).value;
		if (username.length && password.length) {
			if (action == 'login') {
				console.log('login');
				Parse.User.logIn(username, password).then(function() {
					$('#loginModal').modal('hide');
					self.setState({
						error: null
					});
				}, function(){
					self.setState({
						error: 'Incorrect username or password'
					});
				});
			} else {
				console.log('signup');
				var u = new Parse.User({
					username: username,
					password: password,
					votes: 0,
					posts: 0
				});
				u.signUp().then(function() {
					$('#loginModal').modal('hide');
					self.setState({
						error: null
					});
				}, function() {
					self.setState({
						error: 'Invalid account information'
					});
				});
			}
		} else {
			this.setState({
				error: 'Please enter all fields'
			});
		}
	},

	authorize: function() {
		window.location.href = '/authorize';
	}
});

module.exports = LoginForm;