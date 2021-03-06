var express = require("express");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User.js');
exports.setup = function(app) {
    var router = express.Router();

    passport.use(new LocalStrategy(User.authenticate()));
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    router.use(passport.initialize());
    router.use(passport.session());
    router.use(function(req, res, next) {
        var user = req.user;
        if (user) {
            res.locals.user = {
                username: user.username
            };
        }
        next();
    });

    router.get('/signup', function(req, res) {
        res.render('signup', {
            title: "Epic Story - Create an Account"
        });
    });
    router.post('/signup', function(req, res) {
        if (req.body.password != req.body.password2) {
            return res.render('signup', {
                title: "Epic Story - Create an Account",
                notification: {
                    severity: "error",
                    message: "Failed to register user: Passwords did not match!"
                },
            });
        }
        console.log("signing up:" + req.body.username);
        User.register(new User({
            username: req.body.username,
        }), req.body.password, function(err, user) {
            if (err) {
                console.log(err);
                return res.render('signup', {
                    title: "Epic Story - Create an Account",
                    notification: {
                        severity: "error",
                        message: "Failed to register user: " + err.message
                    },
                    user: user
                });
            }
            console.log(req.body.username);
            passport.authenticate('local')(req, res, function() {
                res.redirect('/dash');
            });
        });
    });

    router.get('/login', function(req, res) {
        res.render('login', {
            title: "Epic Story - Log in",
            user: req.user
        });
    });
    router.post('/login', function(req, res, next) {
        console.log(req.body.username);
        passport.authenticate('local', function(err, user, info) {
            console.log("AUTH ME");
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log(err);
                console.log(user);
                return res.render('login', {
                    title: "Epic Story - Log in",
                    notification: {
                        severity: 'error',
                        message: "Your username or password is wrong. Try again."
                    }
                });
            }
            // Log the user in and redirect to the homepage.
            req.login(user, function(err) {
                console.log("LOG ME IN");
                if (err) {
                    return next(err);
                }
                return res.redirect('/dash');
            });
        })(req, res, next); /**/
    });
    // Log the user out and redirect to the homepage.
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    return router;
}