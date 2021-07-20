const express = require('express')
const router = express.Router()
const authController = require('../Controllers/auth')
const limitter = require('express-rate-limit')
const loginLimitter =limitter({
    windowMs: 60 * 1000 ,
    max: 100,
    message:{
        code:429,
        message: 'Too many request my friend !! try later'
    }
})


router.post('/register', authController.register)
router.post('/login', loginLimitter, authController.login)
router.get('/logout', authController.logout)

module.exports = router