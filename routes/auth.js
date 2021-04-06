const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/isLoggedIn', (req, res, next) => {
    if (req.user) {
        return res.status(200).json(req.user);
    } else {
        return res.status(500).json({ message: "NO USER, MOVE OVER." });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    return res.status(200).json(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;