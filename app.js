var template = require('./utils/template');
var express = require('express');
var session = require('express-session');

var nunjucks = require('nunjucks');
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));

var app = express();
var token;
var key;
var sess;

// cookie
app.use(session({ 
    secret: 'e5dc9464afef4134ceacd798cfaf8dc13908faea1ceb1cb5bb04b307350407b9', 
    resave: true,
    saveUninitialized: false
}));
 
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
    sess = req.session;
    // sess.key;
    // sess.token;    
    // console.log(sess);

    if ( sess.key && sess.token ) {
        res.redirect('/profile/me/');
    } else {
        res.render(template('index.html'));
    }
});

app.get('/authentication/', function(req, res) {
    sess = req.session;

    sess.key = req.query.key;
    sess.token = req.query.token;
    
    res.json({ url: '/profile/me/' });

    // console.log(sess);
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