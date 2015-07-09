var React = require('react');

var ItemTag = React.createClass({

	render: function() {
		return (
			<span className={"tag-" + this.props.item + " label label-warning"}>{this.props.item}</span>
		);
	}

});

module.exports = ItemTag;