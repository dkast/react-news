var React = require('react');

var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

var PrettyDate = React.createClass({
  componentWillMount: function() {
    this.interval = null;
  },
  componentDidMount: function() {
    var delta = (new Date() - this.props.value) / 1000;
    if (delta < 60 * 60) {
      this.setInterval(this.forceUpdate.bind(this), 10000);
    }
  },
  componentWillUnmount: function() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  setInterval: function() {
    this.interval = setInterval.apply(null, arguments);
  },
  render: function() {
    var val = this.props.value;
    var text = months[val.getMonth()] + ' ' + val.getDate();
    var delta = (new Date() - val) / 1000;
    if (delta < 60) {
      text = 'Just now';
    } else if (delta < 60 * 60) {
      var mins = ~~(delta / 60);
      text = mins + (mins === 1 ? ' minute ago' : ' minutes ago');
    } else if (delta < 60 * 60 * 24) {
      var hours = ~~(delta / 60 / 60);
      text = hours + (hours === 1 ? ' hour ago' : ' hours ago');
    }
    return (
      <span>{text}</span>
    );
  }
});

module.exports = PrettyDate;