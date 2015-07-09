
// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

var querystring = require('querystring');
var githubClientId = 'client_id';
var githubClientSecret = 'client_secret';

var githubRedirectEndpoint = 'https://github.com/login/oauth/authorize?';

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
// app.get('/hello', function(req, res) {
//   res.render('hello', { message: 'Congrats, you just set up your app!' });
// });

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/authorize', function(req, res){
	//res.send('authorize');
	res.redirect(
		githubRedirectEndpoint + querystring.stringify({
			client_id: githubClientId
		})
	);
});

app.get('/:pageCalled', function(req, res) {
	console.log('retrieving page: ' + req.params.pageCalled);
	res.render('index');
});

app.get('/user/:pageCalled', function(req, res) {
	console.log('retrieving page: ' + req.params.pageCalled);
	res.render('index');
});

app.get('/page/:pageCalled', function(req, res) {
	console.log('retrieving page: ' + req.params.pageCalled);
	res.render('index');
});


// Attach the Express app to Cloud Code.
app.listen();
