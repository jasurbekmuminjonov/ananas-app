const express = require('express');
const upload = require('./utils/multer');
const { createUser, continueWithGoogle, verifyOtp, resendOtp, loginUser } = require('./controllers/UserController');
const rt = express.Router()


rt.post('/user/create', upload.single('user_photo'), createUser)
rt.post('/user/login', loginUser)
rt.post('/user/google', continueWithGoogle)
rt.post('/user/verify', verifyOtp)
rt.post('/user/resend', resendOtp)


module.exports = rt