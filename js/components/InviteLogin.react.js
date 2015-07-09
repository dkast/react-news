var React = require('react');

var ItemCreator = React.createClass({

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
							<div className="lead text-center">
								<p>Please sign in to contribute</p>
								<button type="button" className="btn btn-purple btn-embossed"
									onClick={this.authorize} >
									<span className="ion-social-github"></span>
									&nbsp;
									Sign in With Github
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},
	
	authorize: function() {
		window.location.href = '/authorize';
	}
});

module.exports = ItemCreator;