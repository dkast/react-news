var React = require('react');
// Router
var Router = require('react-router');
var Link = Router.Link;

var PrettyDate = require('./PrettyDate.react.js');
var ItemListTags = require('./ItemListTags.react.js');

var ItemEntry = React.createClass({
	render: function() {
		var itemListTags;

		if (this.props.item.tags) {
			itemListTags = <ItemListTags data={this.props.item.tags} />;
		} else {
			itemListTags = null;
		}

		return (
			<div className="item-entry row">
				<div className="item-counter col-xs-2 col-sm-1">
					<button className= "btn btn-purple btn-sm btn-embossed" onClick={this.handleUpBtnClick} disabled={this.props.disableVote}>
						<span className="ion-chevron-up"></span>
						<span className="counter">{this.props.item.votes}</span>
					</button>
				</div>
				<div className="item-link col-xs-10 col-sm-11">
					<span className="hostname text-muted">{this.props.item.hostname}</span>
					<span className="title">
						<a href={this.props.item.url} title={this.props.item.title} 
							target="_blank">
							{this.props.item.title}
						</a>
					</span>
					<div className="item-meta text-muted">
						<span className="user">
							From &nbsp;
							<Link to="user" params={{userId: this.props.item.createdBy.username}}>{this.props.item.createdBy.username}</Link>
						</span>
						<span className="separator">&#8226;</span>
						<span className="ago"><PrettyDate value={this.props.item.createdAt} /></span>
						{itemListTags}
					</div>
				</div>
			</div>
		);
	},

	handleUpBtnClick: function(e){
    e.preventDefault();
    this.props.onUpVoteClick(this.props.item.id, this.props.item.createdBy);
	}
});

module.exports = ItemEntry;