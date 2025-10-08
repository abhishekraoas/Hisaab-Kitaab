const {handleUserSignUp, handleUserLogin} = require('../controllers/user.controller')
const express = require('express');
const router = express.Router();

//User Sign-Up Route
router.post('/signup', handleUserSignUp);

//User Login Route
router.post('/login', handleUserLogin);


module.exports = router;