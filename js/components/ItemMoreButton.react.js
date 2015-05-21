var React = require('react');
var Router = require('react-router');

var Link = Router.Link;

var ItemMoreButton = React.createClass({

	render: function() {
		return (
			<div className="row">
				<div className="col-xs-12 text-center">
					<Link to="page" params={{page: this.props.nextPage}} className="btn btn-default more">More</Link>
				</div>
			</div>
		);
	}

});

module.exports = ItemMoreButton;