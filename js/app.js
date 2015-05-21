var React = require('react');
var Parse = require('parse').Parse;

// Router
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// Init app
Parse.initialize('mg5wFTDDCkeS40bMwr8UhT4DwnA1cLfpUr3thujN', 'gluiZEJI7K1pMnbnMNqKcTffGgu9cGNG79dMvP1Q');

var AppMain = require('./components/AppMain.react.js');
var User = require('./components/User.react.js');
var ItemList = require('./components/ItemList.react.js');

var routes = (
	<Route name="app" path="/" handler={AppMain}>
		<Route name="user" path="/user/:userId" handler={User} />
		<Route path="/page" handler={ItemList}>
			<Route name="page" path="/page/:page" handler={ItemList} />
		</Route>
		<DefaultRoute handler={ItemList} />
	</Route>
);

Router.run(routes, function(Handler) {
	React.render(
	<Handler />,
		document.getElementById('app')
	);
});
