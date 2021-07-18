const express = require('express')
const router = express.Router()
const authController = require('../Controllers/auth');

router.get('/', (req, res) => {
    res.render('Home', {
        user: req.user
    })
})

router.get('/register', (req, res) => {
    res.render('Register')
})

router.get('/login', (req, res) => {
    res.render('Login')
})

router.get('/profile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('Profile', {
            user: req.user
        });
    } else {
        res.redirect("/login");
    }

});

module.exports = router