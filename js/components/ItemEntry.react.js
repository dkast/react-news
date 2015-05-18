var React = require('react');

var PrettyDate = require('./PrettyDate.react.js');

var ItemEntry = React.createClass({
	render: function() {
		return (
			<div className="item-entry row">
				<div className="item-counter col-xs-1">
					<button className= {this.props.disableVote ? 'btn btn-purple btn-sm btn-embossed' : 'btn btn-purple btn-sm btn-embossed'} onClick={this.handleUpBtnClick} disabled={this.props.disableVote}>
						<span className="icon-arrow-up"></span>
						<span className="counter">{this.props.item.votes}</span>
					</button>
				</div>
				<div className="item-link col-xs-11">
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
							<a href={"#/user/" + this.props.item.createdBy.username}>{this.props.item.createdBy.username}</a>
						</span>
						<span className="separator">&#8226;</span>
						<span className="ago"><PrettyDate value={this.props.item.createdAt} /></span>
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