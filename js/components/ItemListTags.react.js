var React = require('react');
var ItemTag = require('./ItemTag.react.js');

var ItemListTags = React.createClass({

	render: function() {
		return (
			<div className="item-tags pull-right">
				{this.props.data.map(function(i) {
						return (
							<ItemTag key={i} item={i} />
						);
				})}
			</div>
		);
	}
});

module.exports = ItemListTags;