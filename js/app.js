var React = require('react');
var Parse = require('parse').Parse;
// Init app
Parse.initialize('mg5wFTDDCkeS40bMwr8UhT4DwnA1cLfpUr3thujN', 'gluiZEJI7K1pMnbnMNqKcTffGgu9cGNG79dMvP1Q');

var AppMain = require('./components/AppMain.react.js');

React.render(
	<AppMain />,
	document.getElementById('app')
);
