var template = require('./utils/template');
var express = require('express');
var app = express();

// folder public
app.use('/static', express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(template('index.html'));
});

var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
});