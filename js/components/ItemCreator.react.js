var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var MultiSelect = require('react-widgets/lib/MultiSelect');

var TagItem = React.createClass({
  render: function() {
    var tag = this.props.item;
    return (
      <span className={"tag-" + tag}>
        {tag}
      </span>);
  }
});

var ItemCreator = React.createClass({
	mixins: [ParseReact.Mixin],

	observe: function () {
		return {
			user: ParseReact.currentUser
		};
	},

	getInitialState: function() {
		return {
			error: null,
			tags: ['Obj-c', 'Swift', 'WatchKit', 'Control', 'Design', 'News', 'Video', 'Podcast', 'Tools', 'Bussiness'],
			selectedTags: null
		};
	},

	render: function() {
		return (
			<div className="modal jelly" id="addModal">
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
								<MultiSelect 
									defaultValue={this.state.selectedTags}
									data={this.state.tags}
									tagComponent={TagItem}
									onChange={this.onMultiSelectChange} 
									placeholder='Select Tags (Optional)'/>
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

	onMultiSelectChange: function(value) {
		this.setState({
			selectedTags: value 
		});
	},

	submit: function(e) {
		var self = this;
		var title = React.findDOMNode(this.refs.title).value;
		var url = React.findDOMNode(this.refs.url).value;
		var author = this.data.user;
		var tags = [];

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

			if (hostname === '') {
				this.setState({
					error: 'URL is not valid, please verify'
				});
				return;
			}

			if (this.state.selectedTags) {
				tags = this.state.selectedTags;
			}

			var acl = new Parse.ACL(Parse.User.current());
			acl.setPublicReadAccess(true);
			// Access write to moderators
			acl.setRoleWriteAccess('Moderator', true);

			var item = ParseReact.Mutation.Create('Links', {
				title: title,
				url: url,
				hostname: hostname,
				createdBy: author,
				votes: 1,
				score: 0,
				tags: tags,
				ACL: acl
			}).dispatch().then(function() {
				React.findDOMNode(self.refs.title).value='';
				React.findDOMNode(self.refs.url).value='';

				ParseReact.Mutation.Increment(author,'posts').dispatch();
				
				self.setState({
					error: null,
					selectedTags: null,
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