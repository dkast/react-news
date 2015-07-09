var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
// Router
var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;

var Avatar = require('./Avatar.react.js');

var Account = React.createClass({
	mixins: [ParseReact.Mixin, Navigation],

	observe: function () {
		return {
			user: ParseReact.currentUser
		};
	},

	getInitialState: function() {
		return {
			alertMsg: null,
			alertClassName: null,
		};
	},

	componentWillMount: function() {
		if (!this.data.user) {
			this.transitionTo('/');
		}
	},

	componentWillUpdate: function(nextProps, nextState) {
		if (!this.data.user) {
			this.transitionTo('/');
		}
	},

	render: function() {
		// If user logout while on account view
		if (!this.data.user) return <div/>;

		return (
			<div className="row">
				<div className="col-sm-10 col-sm-offset-1">
					<div className="panel panel-info">
						<div className="panel-heading">
							<h3 className="panel-title">Tell us about yourself</h3>
						</div>
						<div className="panel-body">
							<div className="text-center">
								<Avatar 
									name={this.data.user.fullname}
									src={this.data.user.avatarURL} 
								/>
							</div>
							<div className="form-group form-group-sm">
								<label htmlFor="name">Name</label>
								<input type="text" className="form-control" 
									placeholder="Your Name" ref="name" id="name"
									defaultValue={this.data.user.fullname}/>
							</div>
							<div className="form-group form-group-sm">
								<label htmlFor="email">Email</label>
								<input type="text" className="form-control" 
									placeholder="Email address" ref="email" id="email"
									defaultValue={this.data.user.email}/>
							</div>
							<div className="form-group form-group-sm">
								<label htmlFor="bio">Bio</label>
								<textarea name="" id="bio" rows="3" 
									className="form-control" 
									placeholder="Bio" ref="bio"
									defaultValue={this.data.user.bio}/>
							</div>
							<div className="form-group form-group-sm">
								<label htmlFor="web">Website</label>
								<input type="text" className="form-control" 
									placeholder="Website URL" ref="web" id="web"
									defaultValue={this.data.user.website}/>
							</div>
							<div className="form-group form-group-sm">
								<label htmlFor="twitter">Twitter</label>
								<input type="text" className="form-control" 
									placeholder="Twitter Username" 
									ref="twitter" id="twitter"
									defaultValue={this.data.user.twitter}/>
								<p className="help-block">Enter your username so other users can find you on Twitter</p>
							</div>
							<div className="form-group">
									{
										this.state.alertMsg ?
										<div className={'alert ' + this.state.alertClassName}>{this.state.alertMsg}</div> :
										null
									}
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary"
								onClick={this.submit} >
								Save
							</button>
							<Link to="/" className="btn btn-default">
								Cancel
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	},

	submit: function(e) {
		var self = this;
		var user = this.data.user;
		var name = React.findDOMNode(this.refs.name).value;
		var email = React.findDOMNode(this.refs.email).value;
		var bio = React.findDOMNode(this.refs.bio).value;
		var web = React.findDOMNode(this.refs.web).value;
		var twitter = React.findDOMNode(this.refs.twitter).value;

		ParseReact.Mutation.Set(user, {
			fullname: name,
			email: email,
			bio: bio,
			website: web,
			twitter: twitter
		}).dispatch().then(function() {
			self.setState({
				alertMsg: 'Your changes has been saved',
				alertClassName: 'alert-success'
			});
		}, function(error) {
			self.setState({
				 alertMsg: error,
				 alertClassName: 'alert-danger'
			});
		});
	}

});

module.exports = Account;