var React = require('react');

var Avatar = React.createClass({

	getInitialState: function() {
		return {
			src: null,
			initials: null
		};
	},

	getDefaultProps: function() {
		return {
			name: null,
			round: false,
			size: 75
		};
	},

	componentWillMount: function() {
		if (this.props.src) {
			this.setState({
					src: this.props.src
			});
		}

		if (this.props.name) {
			this.setState({
				initials: this.getInitials(this.props.name)
			});
		}
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.src && nextProps.src !== this.props.src) {
			this.setState({
				src: nextProps.src
			});
		} else if (nextProps.name && nextProps.name !== this.props.name) {
			this.setState({
				initials: this.getInitials(nextProps.name)
			});
		}
	},

	render: function() {
		var hostStyle = {
			display: 'inline-block',
			width: this.props.size,
			height: this.props.size,
		};

		var avatarDOM = this.getAvatarDOM();
		return (
			<div className="avatar" style={hostStyle}>
				{avatarDOM}
			</div>
		);
	},

	getInitials: function(name) {
		var parts = name.split(' ');
		var initials = '';
		for (var i = 0; i < parts.length; i++) {
			initials += parts[i].substr(0,1).toUpperCase();
		}

		return initials;
	},

	getAvatarDOM: function() {
		var imageStyle = {
			maxWidth: '100%',
			width: this.props.size,
			height: this.props.size,
			borderRadius: '50%'
		};

		var initialsStyle = {
			background: '#67597A',
			width: this.props.size,
			height: this.props.size,
			fontSize: Math.floor(this.props.size/3),
			color: '#fff',
			textAlign: 'center',
			lineHeight: (this.props.size) + 'px',
			borderRadius: '50%'
		};

		if (this.state.src) {
			return (
				<img width={this.props.size} 
					height={this.props.size} 
					style={imageStyle} 
					src={this.state.src} />
			);
		} else {
			return (
				<div style={initialsStyle}>{this.state.initials}</div>
			);
		}
	}

});

module.exports = Avatar;