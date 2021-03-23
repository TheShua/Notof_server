const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../Models/User');
const bcrypt =require('bcrypt');

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }
    , (req, email, password, done) => {
        try {

            User.findOne({ email: email }).then((current_user) => {
                console.log(current_user)
                if (!current_user) {
                    throw 'Aucun utilisateur trouvé';
                };
    
                bcrypt.compare(password, current_user.password, (err, result) => {
                    if (!result) {
                        throw 'Mot de passe incorrect';
                    };
                
                });
                return done(null, current_user);
            });

        } catch (err) {
            return done(err);
        }
    }
      
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});