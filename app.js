var template = require('./utils/template');
var express = require('express');
var cookieParser = require('cookie-parser');
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));

var app = express();
var token;
var key;

// cookie
app.use(cookieParser());

// folder public
app.use('/static', express.static('public'));

// templates nunjucks
nunjucks.configure('/views', {
    autoescape: true,
    express: app,
    watch: true
});

nunjucks.precompile('views', { env: env });
app.set('view engine', 'html');

// render template for nunjucks
app.get('/', function(req, res) {
    if ( req.cookies.key && req.cookies.token ) {
		res.redirect('/profile/me/');
    } else {
    	res.render(template('index.html'));
    }
});

app.get('/authentication/', function(req, res) {
	token = req.query.token;
	key = req.query.key;

	res.cookie('key', key);
	res.cookie('token', token);

	res.json({ url: '/profile/me/' });
});

// middlewares Trello API
require('./app/routes.js')(app);

// env express
env.express(app);

var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
});