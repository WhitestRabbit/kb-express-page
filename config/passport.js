const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    //Local Strategy for user-password authentication
    passport.use(new LocalStrategy((username, password, done) => {
        //Match Username
        let query = {username: username};
        User.findOne(query, (err, user) => {
            if(err) {
                return done(err);
            }
            if(!user) {
                return done(null, false, {message: 'No user found with this username.'});
            }
            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) {
                    return done(err);
                }
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password incorrect.'});
                }
            });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}