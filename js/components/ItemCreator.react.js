var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');

var ItemCreator = React.createClass({
	mixins: [ParseReact.Mixin],

	observe: function  () {
		return {
			user: ParseReact.currentUser
		};
	},

	getInitialState: function() {
		return {
			error: null
		};
	},

	render: function() {
		return (
			<div className="modal fade" id="addModal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" arial-label="close">
								<span className="icon-cross"></span>
							</button>
							<h4 className="modal-title">Add a Resource</h4>
						</div>
						<div className="modal-body">
							<div className="form-group">
								<div className="input-icon">
									<span className="icon-file"></span>
									<input type="text" className="form-control" 
										placeholder="Title" ref="title" id="title"/>
								</div>
							</div>
							<div className="form-group">
								<div className="input-icon">
									<span className="icon-link"></span>
									<input type="text" className="form-control" 
										placeholder="URL" ref="url" id="url"/>
								</div>
							</div>
							<div className="form-group">
								{
									this.state.error ?
									<div className="alert alert-danger">{this.state.error}</div> :
									null
								}
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary"
								onClick={this.submit} >
								Submit
							</button>
							<button type="button" className="btn btn-default" data-dismiss="modal" >
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	submit: function(e) {
		var self = this;
		var title = React.findDOMNode(this.refs.title).value;
		var url = React.findDOMNode(this.refs.url).value;
		var author = this.data.user;

		if (title.length && url.length) {
			//validate hostname
			var uri = new URI(url);
			var hostname = uri.hostname();

			if (typeof hostname == 'undefined') {
				this.setState({
					error: 'URL is not valid, please verify'
				});
				return;
			}

			var item = ParseReact.Mutation.Create('Links', {
				title: title,
				url: url,
				hostname: hostname,
				createdBy: author,
				votes: 1,
				score: 0
			}).dispatch().then(function() {
				React.findDOMNode(self.refs.title).value='';
				React.findDOMNode(self.refs.url).value='';
				
				self.setState({
					error: null
				});
				$('#addModal').modal('hide');
			}, function() {
				self.setState({
					error: 'Sorry, something went wrong. Please try again later'
				});
			});
			
		} else {
			this.setState({
				error: 'Please enter all fields'
			});
		}
	}
});

module.exports = ItemCreator;