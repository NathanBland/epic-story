var express = require('express');
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var routes = require('./routes/');


mongoose.connect('mongodb://' + (process.env.IP || 'localhost') + '/epic');


var app = express();
hbsutils.registerPartials('./views/partials');
hbsutils.registerWatchedPartials('views/partials');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.set('port', process.env.PORT || 8000);
app.set('ip', process.env.IP || '0.0.0.0');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser('buildt the stories for tomorrow, that will be told as if yesterday.'));
app.use(session({
    secret: 'The key to a secret is knowing where it lies.',
    resave: true,
    saveUninitialized: true
}));
app.use(routes.setup(app));

var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Stories are what make us who we are.");
    console.log("Epic-story running on https://%s:%s",
        address.address, address.port);
});