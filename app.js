var express  = require('express'),
    app      = express(),
    routes   = require('./app/routes/index.js'),
    passport = require('passport');

require('dotenv').load();                   // Load .env file
require('./app/config/passport')(passport); // Auth handler

// Connect DB
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

// Session + MongoDB session store
var session    = require('express-session'),
    MongoStore = require('connect-mongo')(session);

// Handle query
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({
    secret: 'ce0c04361d',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 24 * 60 * 60 * 1000}, // 1 day
    
    // Save session in database (so it doesn't get lost when server stops)
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoRemove: 'interval',  // remove expired sessions
        autoRemoveInterval: 30,  // check every 30 min
        touchAfter: 12 * 3600    // update db only one time in a period of 12 hours
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('connect-flash')());

app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

// Set controller and view paths
app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + 'app/controllers'));
routes(app);

// Start server
var port = process.env.PORT || 8080;
app.listen(port, function(){
    console.log('The server is listening on port ' + port);
});
module.exports = app;