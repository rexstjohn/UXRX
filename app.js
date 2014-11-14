// Module Dependencies and Setup

var express = require('express')
  , mongoose = require('mongoose')
  , home = require('./controllers/home')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals')
  , flash = require('connect-flash')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , expressValidator = require('express-validator')
  , mailer = require('express-mailer')
  , config = require('./config')
  , app = express();

app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator);
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Helpers
app.use(function(req, res, next){
  app.locals.errorMessages = req.flash('error'); // make error alert messages available in all views
  app.locals.successMessages = req.flash('success'); // make success messages available in all views
  app.locals.layoutPath = "../shared/layout";
  next();
});

// Routing Initializers
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// Error Handling
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
} else {
  app.use(function(err, req, res, next) {
    res.render('errors/500', { status: 500 });
  });
}

// Database Connection
var MONGOHQ_URL='mongodb://rexstjohn:1killab3@dharma.mongohq.com:10000/app20104117'
app.set('env', 'production');

if ('development' == app.get('env')) {
  mongoose.connect('mongodb://localhost/nodedemo');
} else {
  // insert db connection for production
  mongoose.connect(MONGOHQ_URL);
}

// Routing
app.get('/', home.index);
app.all('*', home.not_found);


// Start Server w/ DB Connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});
