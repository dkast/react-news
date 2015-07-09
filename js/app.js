var React = require('react');
var Parse = require('parse').Parse;

// Router
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// Init app
Parse.initialize('app_id', 'javascript_key');
Parse.User.enableRevocableSession();

var AppMain = require('./components/AppMain.react.js');
var Account = require('./components/Account.react.js');
var ItemList = require('./components/ItemList.react.js');
var User = require('./components/User.react.js');
var OAuth = require('./components/OAuth.react.js');

var routes = (
	<Route name="app" path="/" handler={AppMain}>
		<Route name="account" handler={Account} />
		<Route path="/page" handler={ItemList}>
			<Route name="page" path="/page/:page" handler={ItemList} />
		</Route>
		<Route name="user" path="/user/:userId" handler={User} />
		<Route name="oauth" path="/oauth-callback" handler={OAuth} />
		<DefaultRoute handler={ItemList} />
	</Route>
);

Router.run(routes, Router.HistoryLocation, function(Handler) {
	React.render(
	<Handler />,
		document.getElementById('app')
	);
});
