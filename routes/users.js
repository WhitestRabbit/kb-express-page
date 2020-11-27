const express = require('express');
const flash = require('connect-flash');
const { body, validationResult } = require ('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in User model
let User = require('../models/user');

//Add new user (registration form)
//Get the form route
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register an account'
    });
});

//Serve the post request for registration
router.post('/register', [
    body('name', 'Name is required!').not().isEmpty(),
    body('email', 'Email is required!').not().isEmpty(),
    body('username', 'Username is required!').not().isEmpty(),
    body('password1', 'Password is required!').not().isEmpty(),
    body('password1', 'Password must be at least 8 characters').isLength({ min: 8 }),
    body('password2', 'Passwords do not match!').exists().custom((value, { req }) => value === req.body.password1)
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('register', {title: 'Register an account', errors: errors.array() });
        } else {
            let user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.username = req.body.username;
            user.password = req.body.password1;
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if(err){
                        console.log(err);
                    }
                    else {
                        user.password = hash;
                        user.save((err) => {
                            if(err) {
                                console.log(err);
                                return;
                            } else {
                                req.flash('success', 'User registered succesfully.');
                                res.redirect('/users/login');
                            }
                        });
                    }
                });
            });
        }
    }
);

//Login user
//Get the login form
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Log in :)'
    });
});
//serve the login post request
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out.');
    res.redirect('/users/login');
});

module.exports = router;