const express = require('express');
const router = express.Router();
const passport = require('passport')

router.post('/login', passport.authenticate('local'), (req, res) => {
    return res.status(200).json(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;