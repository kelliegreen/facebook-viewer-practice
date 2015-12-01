var express = require('express'),
	session = require('express-session'),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	keys = require('./keys'),
	app = express();

app.use(session({ secret: 'I love my Freya' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
	clientID: keys.facebookId,
	clientSecret: keys.facebookSecret,
	callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function (token, refreshToken, profile, done) {
	return done(null, profile);
}));


app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/login'
}), function(req, res) {
	console.log(req.session);
});

passport.serializeUser(function(user, done) {
	
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});//function that is called by passport, after data is pulled from the session


var requireAuth = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/auth/facebook');
};


app.get('/me', function(req, res) {
	var currentLoggedInUserOnSession = req.user;
	
	res.send(currentLoggedInUserOnSession);
});

app.listen('3000', function() {
	console.log('listening on 3000');
});

app.get('/amiauthed', function (req, res){
	if (req.user) return true;
	return false;
});