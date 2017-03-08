var AuthHandler = require(process.cwd() + '/app/controllers/auth.js'),
    authHandler = new AuthHandler(),
    passport    = require('passport');

module.exports = function (app) {
    
    // pages that require an authenticated user redirect to /login
    function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
    }

    // homepage
    app.get('/', function(req, res){
        res.render('index', {
            title: 'Homepage'
        });
    });

    // signup
    app.route('/signup')
        .get(authHandler.signup)
        .post(authHandler.addUser);
    
    // login
    app.route('/login')
		.get(authHandler.signin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

    // logout
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
    });

    // change password
    app.route('/settings')
        .get(isLoggedIn, authHandler.settings)
        .post(isLoggedIn, authHandler.settingsSubmit);
};